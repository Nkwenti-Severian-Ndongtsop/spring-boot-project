import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTicketsApi } from "@/hooks/useTicketsApi";
import { Link } from "react-router-dom";
import { FlightTicket } from "@/api/models/FlightTicket";
import { Plus, TicketIcon, Pencil, Trash2 } from "lucide-react";
import { EditTicketModal } from "@/components/EditTicketModal";
import { toast } from "@/hooks/use-toast";
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
import { format } from "date-fns";

export default function ViewTickets() {
  const { ticketsQuery, deleteTicket } = useTicketsApi();
  const [editingTicket, setEditingTicket] = useState<FlightTicket | null>(null);

  if (ticketsQuery.isLoading) return <div>Loading...</div>;
  if (ticketsQuery.error) return <div>Error loading tickets</div>;

  const tickets = (ticketsQuery.data ?? []) as FlightTicket[];

  const handleEdit = (ticket: FlightTicket) => {
    setEditingTicket(ticket);
  };

  const handleDelete = (ticketId: number) => {
    deleteTicket.mutate(ticketId, {
      onSuccess: () => {
        toast({
          title: "Ticket Deleted",
          description: "The ticket has been successfully deleted.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete ticket.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-1 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold font-poppins mb-4">All Tickets</h1>
            <p className="text-xl text-muted-foreground">
              Manage your tickets and travel plans
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/create">
              <Plus className="h-7 w-7 mr-3" />
              New Ticket
            </Link>
          </Button>
        </div>

        {tickets.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
              <TicketIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your journey by creating your first ticket. 
              It only takes a few minutes to get started.
            </p>
            <Button asChild size="lg">
              <Link to="/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Ticket
              </Link>
            </Button>
          </div>
        ) :
          /* Tickets Table */
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
                {tickets.map((ticket: FlightTicket, index: number) => (
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
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this ticket to {ticket.destinationAddress}? 
                                This action cannot be undone.
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
        }
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