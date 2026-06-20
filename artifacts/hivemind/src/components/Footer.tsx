import type { ElementType } from "react";
import { Link } from "wouter";
import { useAdminData } from "@/hooks/useAdminData";
import Logo from "./Logo";
import { Shield, Building2, Lock, Brain, Globe2, Rocket, CheckCircle } from "lucide-react";

const ICON_MAP: Record<string, ElementType> = {
  Shield, Building2, Lock, Brain, Globe2, Rocket, CheckCircle,
};

export default function Footer() {
  const { data } = useAdminData();
  const enabledBadges = (data.trustBadges || []).filter(b => b.enabled);

  return (
    <footer className="relative border-t border-white/5 bg-black">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">

          {/* Brand column */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
              <Logo className="h-8" />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-2">
              {data.tagline}
            </p>
            <p className="text-white/30 text-xs leading-relaxed max-w-xs">
              Building the infrastructure for the next generation of creators and businesses.
            </p>

            {/* Trust badges inline */}
            {enabledBadges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {enabledBadges.map(badge => {
                  const Icon = ICON_MAP[badge.icon] || CheckCircle;
                  return (
                    <span
                      key={badge.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/8 bg-white/3 text-[10px] text-white/40 font-medium tracking-wide uppercase"
                    >
                      <Icon className="w-3 h-3 text-emerald-400/60" />
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-6 tracking-wide">Services</h4>
            <ul className="space-y-3">
              {data.services.slice(0, 6).map(s => (
                <li key={s.id}>
                  <a href="#services" className="text-white/35 hover:text-white/70 transition-colors text-sm">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-white/35 hover:text-white/70 transition-colors text-sm">About Us</a></li>
              <li><a href="#projects" className="text-white/35 hover:text-white/70 transition-colors text-sm">Our Work</a></li>
              <li><a href="#global" className="text-white/35 hover:text-white/70 transition-colors text-sm">Global Presence</a></li>
              <li><a href="#roadmap" className="text-white/35 hover:text-white/70 transition-colors text-sm">Roadmap</a></li>
              <li><a href="#pricing" className="text-white/35 hover:text-white/70 transition-colors text-sm">Pricing</a></li>
              <li><Link href="/contact" className="text-white/35 hover:text-white/70 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Bottom row */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/25 text-xs">
              © {new Date().getFullYear()} {data.brandName}™. All Rights Reserved.
            </p>
            <p className="text-white/15 text-[11px] mt-1 tracking-wider uppercase">
              Built For The Next Generation Of Digital Intelligence.
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/25">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-white/60 transition-colors">Disclaimer</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-white/60 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
