import { Link } from "wouter";
import { SiFacebook, SiInstagram, SiX, SiLinkedin } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-4">
              <div className="flex flex-col items-end">
                <h3 className="font-serif text-2xl font-bold text-primary leading-none mb-2">
                  Kosmospace
                </h3>
                <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground/80">
                  Luxe Beauty
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Dubai's premier platform for luxury home beauty services.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-facebook">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-instagram">
                <SiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-twitter">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-linkedin">
                <SiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services/manicure" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Manicure
                </Link>
              </li>
              <li>
                <Link href="/services/pedicure" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Pedicure
                </Link>
              </li>
              <li>
                <Link href="/services/lashes" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Lash Extensions
                </Link>
              </li>
              <li>
                <Link href="/services/makeup" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Makeup
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Beauticians</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/become-beautician" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Join Our Network
                </Link>
              </li>
              <li>
                <Link href="/beautician-login" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Beautician Login
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Kosmospace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
