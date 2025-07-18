import { ReactNode } from "react";
import { Plane, Plus, List, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../App";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    ...(user
      ? [
          { name: "Create Ticket", href: "/create", icon: Plus },
          { name: "View Tickets", href: "/tickets", icon: List },
          { name: "Search", href: "/search", icon: Search },
        ]
      : []),
  ];

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-card border-b border-border shadow-soft" style={{ height: 88, minHeight: 88 }}>
        <div className="flex items-center h-20 justify-between w-full px-4 sm:px-6 lg:px-8">
          {/* Logo flush left, angled */}
          <div className="flex items-center">
            <span className="flex items-center space-x-2 text-primary font-bold text-3xl font-poppins select-none" style={{ transform: 'rotate(-10deg)' }}>
              <Plane className="h-8 w-8" />
              <span>SkyJet ✈️</span>
            </span>
          </div>

          {/* Navigation Links flush right */}
          <div className="flex space-x-12">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "inline-flex items-center px-2 pt-1 text-xl font-semibold transition-colors relative",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-6 w-6 mr-3" />
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-sky rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Logo flush right, angled */}
          <div className="flex items-center">
            <span className="flex items-center space-x-2 text-primary font-bold text-3xl font-poppins select-none" style={{ transform: 'rotate(10deg)' }}>
              <Plane className="h-8 w-8" />
              <span>SkyJet ✈️</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>

      {/* Footer (hide on homepage) */}
      {!isHome && (
        <footer className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg py-8 text-center text-white text-lg font-semibold" style={{ height: 80, minHeight: 80 }}>
          © {new Date().getFullYear()} SkyJet. All rights reserved.
        </footer>
      )}
    </div>
  );
}