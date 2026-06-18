import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Settings } from "lucide-react";

export default function Footer() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Expose a global method to open admin panel so the footer link can trigger it
  useEffect(() => {
    (window as any).openAdminPanel = () => setIsAdminOpen(true);
  }, []);

  return (
    <footer className="py-12 border-t border-white/10 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              <span className="font-bold text-xl tracking-wide text-white">HIVEMIND</span>
            </Link>
            <p className="text-neutral-500 max-w-sm">
              Humans. AI. One Mind.<br />
              Building the infrastructure for the next generation of creators and businesses.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-neutral-500">
              <li><a href="#services" className="hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">AI Systems</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Automation</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Discord Bots</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-3 text-neutral-500">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Our Work</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-neutral-600">
          <p>© 2024 HiveMind. All rights reserved.</p>
          
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <button 
              onClick={() => {
                const event = new CustomEvent('open-admin');
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Settings className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
