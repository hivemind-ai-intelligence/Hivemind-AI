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

export default function Terms() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-2xl">
            Please read these terms carefully before using HiveMind AI's services. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <p className="text-white/25 text-xs mt-4">Last updated: June 2026 · Effective: June 2026</p>
        </div>

        <Section title="1. Company Overview">
          <p>
            HiveMind AI ("Company", "we", "us", or "our") is an artificial intelligence company operating under the tagline "Humans. AI. One Mind." We provide AI-powered digital infrastructure, automation systems, and intelligent business solutions designed to help organisations operate smarter and grow faster.
          </p>
          <p>
            Our registered business operates globally with clients across multiple industries. These Terms &amp; Conditions govern your access to and use of all HiveMind AI services, products, platforms, software, and associated websites.
          </p>
        </Section>

        <Section title="2. Services">
          <p>HiveMind AI provides a range of services including, but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>AI-powered chat assistants and knowledge base systems</li>
            <li>Business workflow automation and process optimisation</li>
            <li>Custom AI model development and deployment</li>
            <li>Digital infrastructure design and implementation</li>
            <li>Voice AI systems and conversational agents</li>
            <li>Enterprise intelligence platforms and dashboards</li>
            <li>AI integration consulting and technical support</li>
          </ul>
          <p>
            Services are provided on a project basis, subscription model, or retainer arrangement as agreed upon in individual service agreements.
          </p>
        </Section>

        <Section title="3. User Responsibilities">
          <p>By using our services, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide accurate, complete, and current information when registering or engaging with our services</li>
            <li>Maintain the confidentiality of any login credentials or API keys provided</li>
            <li>Promptly notify us of any unauthorised access to your account</li>
            <li>Use our services only for lawful, legitimate business purposes</li>
            <li>Comply with all applicable local, national, and international laws and regulations</li>
            <li>Not engage in any activity that disrupts or impairs our service infrastructure</li>
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree NOT to use HiveMind AI services to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Develop, distribute, or deploy malicious software, spam, or harmful content</li>
            <li>Violate the privacy, intellectual property, or rights of any third party</li>
            <li>Engage in fraudulent, deceptive, or misleading business practices</li>
            <li>Circumvent, disable, or interfere with security features of our platform</li>
            <li>Reverse engineer, decompile, or attempt to extract our proprietary algorithms</li>
            <li>Resell or redistribute our services without prior written authorisation</li>
            <li>Generate content that is illegal, harmful, abusive, or violates human rights</li>
          </ul>
          <p>
            We reserve the right to immediately suspend or terminate access for any violation of these acceptable use provisions.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            All content, technology, software, algorithms, models, branding, and materials created by or belonging to HiveMind AI remain our exclusive intellectual property. This includes all AI models, automation frameworks, and proprietary systems developed as part of our core platform.
          </p>
          <p>
            Custom deliverables created specifically for a client project may be transferred to the client upon full payment, as outlined in individual project agreements. Until full payment is received, HiveMind AI retains all rights to all work produced.
          </p>
          <p>
            The "HiveMind AI" name, logo, and tagline "Humans. AI. One Mind." are registered trademarks and may not be used without explicit written permission.
          </p>
        </Section>

        <Section title="6. Payments">
          <p>
            All pricing is agreed upon in project proposals or subscription agreements prior to commencement of work. Payments are due according to the payment schedule outlined in your individual agreement. HiveMind AI reserves the right to suspend services for overdue payments.
          </p>
          <p>
            Invoices are issued electronically and must be settled within 14 days of issue unless otherwise agreed. Late payments may incur a surcharge of 2% per month on the outstanding balance.
          </p>
        </Section>

        <Section title="7. Refund Policy">
          <p>
            Due to the bespoke, intellectual, and time-intensive nature of AI development and consulting services, all payments made to HiveMind AI are non-refundable once work has commenced unless otherwise agreed in writing.
          </p>
          <p>
            For subscription services, cancellations must be submitted in writing with 30 days notice. No refunds will be issued for the current billing period. If services are found to be significantly deficient, a partial credit towards future services may be offered at HiveMind AI's sole discretion.
          </p>
        </Section>

        <Section title="8. Service Availability">
          <p>
            HiveMind AI strives to maintain high availability for all services. However, we do not guarantee uninterrupted access. Scheduled maintenance, infrastructure updates, or circumstances beyond our control may result in temporary service interruptions.
          </p>
          <p>
            We will endeavour to provide advance notice of planned downtime where possible. HiveMind AI is not liable for any losses arising from service interruptions.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, HiveMind AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business opportunity arising from or related to your use of our services.
          </p>
          <p>
            Our total aggregate liability to you for any claim arising from these terms or our services shall not exceed the total amount paid by you to HiveMind AI in the three months preceding the claim.
          </p>
        </Section>

        <Section title="10. AI Disclaimer">
          <p>
            HiveMind AI's systems incorporate artificial intelligence and machine learning technologies. AI-generated outputs, recommendations, and content may contain inaccuracies, biases, or errors. You acknowledge that AI outputs should be reviewed by qualified professionals before implementation in critical business decisions.
          </p>
          <p>
            HiveMind AI does not guarantee the accuracy, completeness, or fitness for purpose of any AI-generated content. We are not liable for decisions made based on AI outputs without human verification.
          </p>
        </Section>

        <Section title="11. Termination Rights">
          <p>
            Either party may terminate a service agreement with 30 days written notice. HiveMind AI may terminate immediately and without notice in cases of serious breach of these terms, non-payment, or illegal use of services.
          </p>
          <p>
            Upon termination, your access to HiveMind AI services will cease immediately. Any data associated with your account may be retained for up to 90 days before deletion, in compliance with our Privacy Policy.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms &amp; Conditions are governed by and construed in accordance with applicable commercial law. Any disputes arising from these terms shall be resolved through good-faith negotiation, and if unresolved, through binding arbitration.
          </p>
        </Section>

        <Section title="13. Contact Information">
          <p>For questions, disputes, or legal notices regarding these terms, please contact:</p>
          <div className="mt-3 p-4 rounded-xl border border-white/6 bg-white/2">
            <p className="text-white font-medium">HiveMind AI</p>
            <p>"Humans. AI. One Mind."</p>
            <p>Email: legal@hivemindai.com</p>
            <p>Website: <Link href="/contact" className="text-white/70 hover:text-white underline underline-offset-2 transition-colors">Contact Page</Link></p>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <p>© 2026 HiveMind AI™. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-white/60 transition-colors">Disclaimer</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
