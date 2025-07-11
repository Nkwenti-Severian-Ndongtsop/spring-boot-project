import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTicketsApi } from "@/hooks/useTicketsApi";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EditTicketModalProps {
  ticket: any; // Changed from Ticket to any as Ticket type is removed
  open: boolean;
  onClose: () => void;
}

export function EditTicketModal({ ticket, open, onClose }: EditTicketModalProps) {
  const { updateTicket } = useTicketsApi();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    kickofaddress: "",
    destination: "",
  });
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setFormData({
        name: ticket.passengerName, // Changed from ticket.name to ticket.passengerName
        kickofaddress: ticket.kickoffAddress, // Changed from ticket.kickofaddress to ticket.kickoffAddress
        destination: ticket.destinationAddress, // Changed from ticket.destination to ticket.destinationAddress
      });
      setDate(ticket.bookingDate); // Changed from ticket.date to ticket.bookingDate
    }
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticket || !formData.name || !formData.kickofaddress || !formData.destination || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateTicket.mutateAsync({
        id: ticket.id,
        passengerName: formData.name,
        kickoffAddress: formData.kickofaddress,
        destinationAddress: formData.destination,
        bookingDate: date,
      });

      toast({
        title: "Ticket Updated Successfully! ✈️",
        description: `Your flight details have been updated.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
          <DialogDescription>
            Update your flight details. Changes will be saved automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="edit-name"
              placeholder="Enter passenger name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Kickof Address */}
          <div className="space-y-2">
            <Label htmlFor="edit-kickofaddress" className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Kickof Address
            </Label>
            <Input
              id="edit-kickofaddress"
              placeholder="Enter departure location"
              value={formData.kickofaddress}
              onChange={(e) => handleInputChange("kickofaddress", e.target.value)}
              required
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="edit-destination" className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Destination
            </Label>
            <Input
              id="edit-destination"
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Travel Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Updating...
              </>
            ) : (
              "Update Ticket"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}