import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="flex flex-col items-end">
              <span className="font-serif text-2xl font-bold text-primary leading-none">Kosmospace</span>
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground/80">Luxe Beauty</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-services">
              Services
            </Link>
            <Link href="/beauticians" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-beauticians">
              Find Beauticians
            </Link>
            <Link href="/become-beautician" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-become-beautician">
              Become a Beautician
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" data-testid="button-login">
              Sign In
            </Button>
            <Button variant="default" data-testid="button-signup">
              Get Started
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-6 space-y-4">
            <Link href="/services" className="text-base font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-services-mobile">
              Services
            </Link>
            <Link href="/beauticians" className="text-base font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-beauticians-mobile">
              Find Beauticians
            </Link>
            <Link href="/become-beautician" className="text-base font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-become-beautician-mobile">
              Become a Beautician
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Button variant="ghost" className="w-full" data-testid="button-login-mobile">
                Sign In
              </Button>
              <Button variant="default" className="w-full" data-testid="button-signup-mobile">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
