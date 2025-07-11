import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTicketsApi } from "@/hooks/useTicketsApi";
import { useToast } from "@/hooks/use-toast";
import { Plane, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CreateTicket() {
  const navigate = useNavigate();
  const { createTicket } = useTicketsApi();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    kickofaddress: "",
    destination: "",
  });
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.kickofaddress || !formData.destination || !date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createTicket.mutateAsync({
        passengerName: formData.name,
        kickoffAddress: formData.kickofaddress,
        destinationAddress: formData.destination,
        bookingDate: date,
      });

      toast({
        title: "Ticket Created Successfully! ✈️",
        description: `Ticket for ${formData.name} from ${formData.kickofaddress} to ${formData.destination} has been created.`,
      });

      // Simulate API delay for better UX
      setTimeout(() => {
        navigate("/view");
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const popularDestinations = [
    "New York (JFK)", "London (LHR)", "Paris (CDG)", "Tokyo (NRT)",
    "Dubai (DXB)", "Singapore (SIN)", "Sydney (SYD)", "Los Angeles (LAX)"
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-sky rounded-full mb-4">
            <Plane className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-poppins mb-2">Book Your Flight</h1>
          <p className="text-muted-foreground">Create a new airline ticket with all the details</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl font-poppins">Flight Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter passenger name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="transition-all duration-300 focus:shadow-soft"
                  required
                />
              </div>

              {/* Kickof Address */}
              <div className="space-y-2">
                <Label htmlFor="kickofaddress" className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Kickof Address
                </Label>
                <Input
                  id="kickofaddress"
                  placeholder="Enter departure location"
                  value={formData.kickofaddress}
                  onChange={(e) => handleInputChange("kickofaddress", e.target.value)}
                  className="transition-all duration-300 focus:shadow-soft"
                  required
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="Enter destination"
                  value={formData.destination}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                  className="transition-all duration-300 focus:shadow-soft"
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

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Creating Ticket...
                    </>
                  ) : (
                    <>
                      <Plane className="h-4 w-4 mr-2" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}