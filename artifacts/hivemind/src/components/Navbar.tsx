import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAdminData } from "@/hooks/useAdminData";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data } = useAdminData();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
    { name: "HiveMind AI", href: "/hivemind-ai", isRoute: true, highlight: true },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <motion.div
          layout
          className={`flex items-center justify-between rounded-2xl transition-all duration-500 px-5 py-3 ${
            isScrolled
              ? "border border-white/8 dark:border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.4)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
              : "border border-transparent"
          }`}
          style={
            isScrolled
              ? {
                  background: "rgba(8,10,14,0.85)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                }
              : {}
          }
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <Logo className="h-8 transition-transform duration-300 group-hover:scale-105" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const content = link.highlight ? (
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-sky-400" />
                  {link.name}
                </span>
              ) : link.name;

              const cls = `relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 group ${
                link.highlight
                  ? "text-sky-300 hover:text-sky-200 hover:bg-sky-500/8"
                  : "text-white/50 hover:text-white/90 hover:bg-white/5"
              }`;

              return link.isRoute ? (
                <Link key={link.name} href={link.href} className={cls}>
                  {content}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-current transition-all duration-300 group-hover:w-4/5 opacity-40 rounded-full" />
                </Link>
              ) : (
                <a key={link.name} href={link.href} className={cls}>
                  {content}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-current transition-all duration-300 group-hover:w-4/5 opacity-40 rounded-full" />
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/6 transition-all duration-200 relative overflow-hidden"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 absolute" />
              <Moon className="h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 absolute" />
            </button>

            {/* CTA */}
            <a href="#contact" className="hidden sm:block">
              <button className="relative px-5 py-2 text-sm font-semibold rounded-xl overflow-hidden group transition-all duration-200">
                <span
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "inherit",
                  }}
                />
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
                  }}
                />
                <span className="relative text-white/80 group-hover:text-white transition-colors duration-200">
                  Start Project
                </span>
              </button>
            </a>

            {/* Mobile toggle */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/6 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 px-4 mt-2 z-40"
          >
            <div
              className="rounded-2xl p-3 flex flex-col gap-1 border border-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              style={{
                background: "rgba(8,10,14,0.95)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {link.isRoute ? (
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 text-sm font-medium p-3 rounded-xl transition-all duration-200 ${
                        link.highlight
                          ? "text-sky-300 hover:bg-sky-500/8"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.highlight && <Zap className="w-3.5 h-3.5 text-sky-400" />}
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 text-sm font-medium p-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </motion.div>
              ))}

              <div className="h-px bg-white/5 my-1 mx-2" />

              <div className="flex items-center justify-between p-3">
                <span className="text-sm text-white/40">Appearance</span>
                <button
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                    setMobileMenuOpen(false);
                  }}
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>

              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-2 pb-1">
                <button className="w-full py-3 text-sm font-semibold rounded-xl text-white/80 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 hover:bg-white/5">
                  Start a Project
                </button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
