import { Link } from "wouter";
import { useAdminData } from "@/hooks/useAdminData";
import Logo from "./Logo";

export default function Footer() {
  const { data } = useAdminData();

  return (
    <footer className="py-12 border-t border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <Logo className="h-8" />
            </Link>
            <p className="text-muted-foreground max-w-sm">
              {data.tagline}<br />
              Building the infrastructure for the next generation of creators and businesses.
            </p>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#services" className="hover:text-foreground transition-colors">Web Development</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">AI Systems</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Automation</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Discord Bots</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#projects" className="hover:text-foreground transition-colors">Our Work</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {data.brandName}. All rights reserved.</p>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}