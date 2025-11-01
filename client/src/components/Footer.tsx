import { Link } from "wouter";
import { SiFacebook, SiInstagram, SiX, SiLinkedin } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
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
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-facebook">
                <SiFacebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-instagram">
                <SiInstagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-twitter">
                <SiX className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover-elevate p-2 rounded-md" data-testid="link-linkedin">
                <SiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/find-beauticians" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Find Beauticians
                </Link>
              </li>
              <li>
                <Link href="/become-beautician" className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Become a Beautician
                </Link>
              </li>
              <li>
                <button onClick={() => window.location.href = '/api/login'} className="text-muted-foreground hover-elevate px-2 py-1 rounded-md inline-block">
                  Sign In
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Dubai, United Arab Emirates</li>
              <li>
                <a href="mailto:hello@kosmospace.ae" className="hover-elevate px-2 py-1 rounded-md inline-block">
                  hello@kosmospace.ae
                </a>
              </li>
              <li>
                <a href="tel:+97144123456" className="hover-elevate px-2 py-1 rounded-md inline-block">
                  +971 4 412 3456
                </a>
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
