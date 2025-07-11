import { ReactNode } from "react";
import { Plane, Home, Plus, List, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Create Ticket", href: "/create", icon: Plus },
    { name: "View Tickets", href: "/tickets", icon: List },
    { name: "Search", href: "/search", icon: Search },
  ];

  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="bg-card border-b border-border shadow-soft" style={{ height: 64, minHeight: 64 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-primary font-bold text-xl font-poppins hover:text-primary-glow transition-colors"
              >
                <Plane className="h-6 w-6" />
                <span>SkyJet ✈️</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors relative",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-sky rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg py-8 text-center text-white text-lg font-semibold" style={{ height: 80, minHeight: 80 }}>
        © {new Date().getFullYear()} SkyJet. All rights reserved.
      </footer>
    </div>
  );
}