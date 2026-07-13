import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-white text-xl font-semibold mb-4 pb-3 border-b border-white/6">{title}</h2>
      <div className="text-white/50 text-sm leading-[1.9] space-y-3">{children}</div>
    </div>
  );
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-7 opacity-80 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 max-w-4xl py-16 sm:py-24">
        {/* Hero */}
        <div className="mb-14">
          <p className="text-[11px] text-white/30 tracking-[0.2em] uppercase mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-2xl">
            Your privacy is fundamental to how we build and operate HiveMind AI. This policy explains what data we collect, why we collect it, and how we protect it.
          </p>
          <p className="text-white/25 text-xs mt-4">Last updated: June 2026 · Effective: June 2026</p>
        </div>

        <Section title="1. Data We Collect">
          <p>HiveMind AI collects information in the following categories:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-white/70">Identity Data:</strong> Name, company name, job title provided during registration or onboarding</li>
            <li><strong className="text-white/70">Contact Data:</strong> Email address, phone number, business address</li>
            <li><strong className="text-white/70">Technical Data:</strong> IP address, browser type, device identifiers, operating system</li>
            <li><strong className="text-white/70">Usage Data:</strong> Pages visited, features used, time spent, interaction patterns</li>
            <li><strong className="text-white/70">Transaction Data:</strong> Payment details, billing history (processed via secure third-party providers)</li>
            <li><strong className="text-white/70">AI Interaction Data:</strong> Queries submitted to AI systems, responses generated, feedback provided</li>
          </ul>
        </Section>

        <Section title="2. Contact Form Data">
          <p>
            When you submit a contact form on our website or platform, we collect your name, email address, subject line, and message content. This information is used solely to respond to your enquiry and improve our services.
          </p>
          <p>
            Contact form submissions are stored securely and are not shared with third parties for marketing purposes. We retain contact form data for a maximum of 2 years unless you request earlier deletion.
          </p>
        </Section>

        <Section title="3. Cookies">
          <p>HiveMind AI uses cookies to improve your experience on our platform. We use:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-white/70">Essential Cookies:</strong> Required for core functionality, authentication, and security. Cannot be disabled.</li>
            <li><strong className="text-white/70">Preference Cookies:</strong> Remember your settings such as theme preference and language.</li>
            <li><strong className="text-white/70">Analytics Cookies:</strong> Help us understand how visitors use our platform to improve performance.</li>
            <li><strong className="text-white/70">Marketing Cookies:</strong> Used to serve relevant content. These are optional and can be declined.</li>
          </ul>
          <p>You can manage cookie preferences through your browser settings or our cookie consent tool.</p>
        </Section>

        <Section title="4. Analytics">
          <p>
            We use privacy-focused analytics tools to understand how our website and services are used. Analytics data is aggregated and anonymised where possible. We do not sell analytics data to third parties.
          </p>
          <p>
            Analytics help us identify performance issues, improve user experience, and make data-driven product decisions. All analytics processing complies with applicable data protection regulations.
          </p>
        </Section>

        <Section title="5. Usage Data">
          <p>
            When you use HiveMind AI services, we collect usage data including feature interactions, performance metrics, error logs, and session data. This data is used to improve system reliability, optimise AI performance, and enhance user experience.
          </p>
          <p>
            Usage data associated with AI interactions may be used to improve our AI models, subject to strict anonymisation and privacy controls. You may opt out of AI training data collection by contacting us.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            HiveMind AI implements industry-standard security measures to protect your data, including:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>End-to-end encryption for data in transit (TLS 1.3)</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Role-based access controls limiting internal data access</li>
            <li>Regular security audits and penetration testing</li>
            <li>Multi-factor authentication for all internal systems</li>
            <li>24/7 infrastructure monitoring and intrusion detection</li>
          </ul>
          <p>
            Despite these measures, no system can guarantee absolute security. You agree to notify us immediately of any suspected unauthorised access to your data.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain personal data only for as long as necessary to provide services or comply with legal obligations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-white/70">Account Data:</strong> Retained for the duration of your relationship with us, plus 3 years</li>
            <li><strong className="text-white/70">Transaction Records:</strong> Retained for 7 years for tax and accounting compliance</li>
            <li><strong className="text-white/70">Contact Form Data:</strong> Retained for 2 years from date of submission</li>
            <li><strong className="text-white/70">Analytics Data:</strong> Aggregated and anonymised after 12 months</li>
            <li><strong className="text-white/70">AI Interaction Logs:</strong> Retained for 6 months unless required for dispute resolution</li>
          </ul>
        </Section>

        <Section title="8. Your Rights">
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Access a copy of the personal data we hold about you</li>
            <li>Request correction of inaccurate or incomplete data</li>
            <li>Request deletion of your personal data ("right to be forgotten")</li>
            <li>Object to or restrict processing of your data</li>
            <li>Request portability of your data in a machine-readable format</li>
            <li>Withdraw consent for processing where consent is the legal basis</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at privacy@hivemindai.com. We will respond within 30 days.
          </p>
        </Section>

        <Section title="9. Third Party Services">
          <p>
            HiveMind AI uses select third-party services to operate our platform. These providers have been assessed for privacy compliance and are contractually bound to protect your data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-white/70">Payment Processing:</strong> Secure payment gateways (PCI-DSS compliant)</li>
            <li><strong className="text-white/70">Cloud Infrastructure:</strong> Enterprise cloud providers with SOC 2 certification</li>
            <li><strong className="text-white/70">AI Processing:</strong> Select AI infrastructure providers under data processing agreements</li>
            <li><strong className="text-white/70">Email Services:</strong> Business email providers for transactional communications</li>
          </ul>
          <p>We do not sell, rent, or share your personal data with third parties for their own marketing purposes.</p>
        </Section>

        <Section title="10. Contact">
          <p>For privacy-related enquiries, data subject requests, or to report a privacy concern:</p>
          <div className="mt-3 p-4 rounded-xl border border-white/6 bg-white/2">
            <p className="text-white font-medium">HiveMind AI — Privacy Team</p>
            <p>Email: privacy@hivemindai.com</p>
            <p><Link href="/contact" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">Contact Form</Link></p>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <p>© 2026 HiveMind AI™. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-white/60 transition-colors">Disclaimer</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
