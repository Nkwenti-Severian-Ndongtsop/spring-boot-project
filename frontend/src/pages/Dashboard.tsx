import { Button } from "@/components/ui/button";
import airlineHero from "@/assets/airline-hero.jpg";
import { useAuth } from "../App";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

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
          {loading ? (
            <div className="mb-8 text-lg text-primary-foreground">Loading...</div>
          ) : user ? (
            <div className="mb-8 flex flex-col items-center gap-2">
              <span className="text-xl text-primary-foreground font-semibold">Welcome, {user.name || user.preferred_username}!</span>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" /> Logout
              </Button>
            </div>
          ) : (
            <Button
              size="xl"
              className="text-xl px-10 py-6 mb-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              onClick={() => {
                window.location.href = "http://localhost:8000/oauth2/authorization/keycloak";
              }}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}