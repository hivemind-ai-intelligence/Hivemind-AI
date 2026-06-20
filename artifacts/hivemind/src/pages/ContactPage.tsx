import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Handshake, Wrench, HelpCircle, CheckCircle2, Send } from "lucide-react";
import Logo from "@/components/Logo";

const CATEGORIES = [
  { id: "business", label: "Business Inquiries", icon: MessageSquare, desc: "Project proposals, pricing, and partnerships", color: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5" },
  { id: "partnership", label: "Partnerships", icon: Handshake, desc: "Strategic alliances and collaborations", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
  { id: "support", label: "Technical Support", icon: Wrench, desc: "Help with existing services and integrations", color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5" },
  { id: "general", label: "General Questions", icon: HelpCircle, desc: "Anything else you'd like to know", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
];

export default function ContactPage() {
  const [selected, setSelected] = useState<string>("business");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-900/6 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-7 opacity-80 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 max-w-5xl py-16 sm:py-24 relative z-10">
        {/* Hero */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] text-white/30 tracking-[0.2em] uppercase mb-4">Get In Touch</p>
          <h1 className="text-4xl sm:text-5xl md:text-[58px] font-bold tracking-tight text-white mb-4 leading-tight">
            Let's build something<br />
            <span className="bg-gradient-to-r from-white/85 via-violet-200/60 to-white/25 bg-clip-text text-transparent">
              intelligent together.
            </span>
          </h1>
          <p className="text-white/35 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Whether you have a project in mind, a question to ask, or a partnership to explore — we're ready to listen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Category Selector */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-white/40 text-xs tracking-widest uppercase mb-4">How can we help?</p>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selected === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                    isActive
                      ? `${cat.border} ${cat.bg} border-opacity-100`
                      : "border-white/6 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? cat.bg : "bg-white/5"} border ${isActive ? cat.border : "border-white/8"}`}>
                    <Icon className={`w-4 h-4 ${isActive ? cat.color : "text-white/40"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isActive ? "text-white" : "text-white/60"}`}>
                      {cat.label}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{cat.desc}</p>
                  </div>
                </button>
              );
            })}

            {/* Info card */}
            <div className="mt-6 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <p className="text-white/60 text-xs font-medium mb-2">Response Time</p>
              <p className="text-white/30 text-xs leading-relaxed">
                We typically respond to all enquiries within <span className="text-white/55">24–48 hours</span> during business days.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-white/6 bg-white/[0.02] min-h-[440px]">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Message sent.</h3>
                <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-8">
                  Thank you for reaching out. A member of the HiveMind AI team will be in touch within 24–48 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="text-sm text-white/40 hover:text-white transition-colors underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-white/6 bg-white/[0.02] p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-medium tracking-wide uppercase">Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/5 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white/50 text-xs font-medium tracking-wide uppercase">Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/5 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-medium tracking-wide uppercase">Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder={`${CATEGORIES.find(c => c.id === selected)?.label || "Subject"}`}
                    className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/5 transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-medium tracking-wide uppercase">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your project, question, or idea..."
                    className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/5 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <p className="text-white/25 text-xs">
                    By submitting this form you agree to our{" "}
                    <Link href="/privacy" className="text-white/45 hover:text-white transition-colors underline underline-offset-2">Privacy Policy</Link>.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex-shrink-0"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <p>© 2026 HiveMind AI™. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/disclaimer" className="hover:text-white/60 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
