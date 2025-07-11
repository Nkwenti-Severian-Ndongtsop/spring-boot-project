import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTicketsApi } from "@/hooks/useTicketsApi";
import { Search, X, TicketIcon } from "lucide-react";
import { EditTicketModal } from "@/components/EditTicketModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { FlightTicket } from "@/types/flightTicket";

export default function SearchTickets() {
  const { ticketsQuery, deleteTicket } = useTicketsApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState<'kickofaddress' | 'destination' | 'date'>('kickofaddress');
  const [editingTicket, setEditingTicket] = useState<FlightTicket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<number | null>(null);

  const tickets = useMemo(() => ticketsQuery.data || [], [ticketsQuery.data]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    
    const query = searchQuery.toLowerCase();
    return tickets.filter(ticket => {
      if (searchBy === 'kickofaddress') {
        return ticket.kickoffAddress?.toLowerCase().includes(query);
      } else if (searchBy === 'destination') {
        return ticket.destinationAddress?.toLowerCase().includes(query);
      } else if (searchBy === 'date') {
        return ticket.bookingDate && format(new Date(ticket.bookingDate), "PPP").toLowerCase().includes(query);
      } else if (searchBy === 'createdAt') {
        return ticket.createdAt && format(new Date(ticket.createdAt), "PPpp").toLowerCase().includes(query);
      }
      return false;
    });
  }, [tickets, searchQuery, searchBy]);

  const handleEdit = (ticket: FlightTicket) => {
    setEditingTicket(ticket);
  };

  const handleDelete = (ticketId: number) => {
    deleteTicket.mutate(ticketId);
    toast({
      title: "Ticket Deleted",
      description: "The ticket has been successfully deleted.",
    });
    setDeletingTicketId(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background py-1 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-2 animate-fade-in">
          <h1 className="text-5xl font-bold font-poppins mb-4">Search Tickets</h1>
          <p className="text-xl text-muted-foreground">
            Find your tickets by kickof address, destination, or date
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card p-6 rounded-lg shadow-card mb-8 animate-slide-up">
          <div className="space-y-4">
            {/* Search Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search by ${searchBy}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Select value={searchBy} onValueChange={(value: 'kickofaddress' | 'destination' | 'date') => setSearchBy(value)}>
                <SelectTrigger className="w-full sm:w-48 h-12">
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kickofaddress">Kickof Address</SelectItem>
                  <SelectItem value="destination">Destination</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="createdAt">Created At</SelectItem>
                </SelectContent>
              </Select>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={clearSearch}
                  className="h-12"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Search Summary */}
            <div className="pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">
                {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredTickets.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
              <TicketIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "No tickets match your search" : "No tickets found"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search terms to find what you're looking for."
                : "You haven't created any tickets yet. Start by creating your first ticket."
              }
            </p>
            {searchQuery ? (
              <Button onClick={clearSearch} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Clear Search
              </Button>
            ) : (
              <Button asChild>
                <a href="/create">Create Your First Ticket</a>
              </Button>
            )}
          </div>
        ) : (
          /* Results Table */
          <div className="bg-card rounded-lg shadow-card animate-slide-up">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Kickof Address</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket, index) => (
                  <TableRow 
                    key={ticket.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">{ticket.passengerName}</TableCell>
                    <TableCell>{ticket.kickoffAddress}</TableCell>
                    <TableCell>{ticket.destinationAddress}</TableCell>
                    <TableCell>{ticket.bookingDate ? format(new Date(ticket.bookingDate), "PPP") : ""}</TableCell>
                    <TableCell>{ticket.createdAt ? format(new Date(ticket.createdAt), "PPpp") : ""}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(ticket)}
                        >
                          Edit
                        </Button>
                        <AlertDialog open={deletingTicketId === ticket.id} onOpenChange={(open) => setDeletingTicketId(open ? ticket.id : null)}>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this ticket for {ticket.passengerName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(ticket.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditTicketModal
        ticket={editingTicket}
        open={!!editingTicket}
        onClose={() => setEditingTicket(null)}
      />
    </div>
  );
}