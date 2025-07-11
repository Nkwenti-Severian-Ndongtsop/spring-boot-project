import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, TicketIcon } from "lucide-react";
import airlineHero from "@/assets/airline-hero.jpg";

export default function Dashboard() {
  // Height: 100vh - navbar (88px)
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div
        className="relative bg-gradient-sky overflow-hidden w-full"
        style={{ height: 'calc(100vh - 88px)' }}
      >
        <div className="absolute inset-0">
          <img
            src={airlineHero}
            alt="Airlines"
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
          />
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-center px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 font-poppins drop-shadow-lg">
            Welcome to SkyJet
          </h1>
          <p className="text-2xl md:text-3xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Your premium airline ticket management system. Create, manage, and track your flight bookings with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="xl" className="text-xl px-10 py-6" variant="accent">
              <Link to="/create">
                <Plane className="h-7 w-7 mr-3" />
                Book New Flight
              </Link>
            </Button>
            <Button asChild size="xl" className="text-xl px-10 py-6" variant="accent">
              <Link to="/tickets">
                <TicketIcon className="h-7 w-7 mr-3" />
                View All Tickets
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}