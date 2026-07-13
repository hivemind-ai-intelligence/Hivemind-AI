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

export default function Disclaimer() {
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
            Disclaimer
          </h1>
          <p className="text-white/40 text-base leading-relaxed max-w-2xl">
            The following disclaimer outlines the limitations, boundaries, and nature of information and services provided by HiveMind AI.
          </p>
          <p className="text-white/25 text-xs mt-4">Last updated: June 2026 · Effective: June 2026</p>
        </div>

        <Section title="1. General Information Disclaimer">
          <p>
            The information contained on the HiveMind AI website and platform is provided for general informational and business purposes only. While we make every effort to ensure accuracy and completeness, HiveMind AI makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of information, products, services, or related content.
          </p>
          <p>
            Any reliance you place on information from HiveMind AI is strictly at your own risk. We recommend independently verifying critical information before making business decisions.
          </p>
        </Section>

        <Section title="2. AI Content Disclaimer">
          <p>
            HiveMind AI's products and services incorporate artificial intelligence technologies, including large language models, machine learning systems, and generative AI. Content, recommendations, analyses, and outputs produced by our AI systems:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Are generated algorithmically and may contain errors, inaccuracies, or outdated information</li>
            <li>Should not be considered infallible or a substitute for human expertise</li>
            <li>May reflect biases present in training data</li>
            <li>Are not guaranteed to be complete, current, or suitable for any specific purpose</li>
            <li>Should be reviewed and verified by qualified professionals before implementation</li>
          </ul>
          <p>
            HiveMind AI continuously works to improve the quality and reliability of our AI systems, but cannot guarantee the accuracy of any AI-generated output.
          </p>
        </Section>

        <Section title="3. Accuracy Disclaimer">
          <p>
            While HiveMind AI strives to provide accurate information about our services, capabilities, pricing, and roadmap, all information is subject to change without notice. Product features, timelines, and pricing stated on our website represent our current plans and may be modified as our business evolves.
          </p>
          <p>
            Case studies, performance metrics, and results mentioned on our platform are representative of specific client engagements and are not guarantees of results for any new client. Individual outcomes will vary based on numerous factors including industry, implementation quality, and business context.
          </p>
        </Section>

        <Section title="4. Professional Advice Disclaimer">
          <p>
            The information provided by HiveMind AI does not constitute legal, financial, medical, or other professional advice. Our AI systems, consulting content, and recommendations are intended to support business decision-making, not replace qualified professional counsel.
          </p>
          <p>
            For matters involving legal compliance, financial strategy, medical decisions, or other regulated domains, you should consult with appropriately qualified and licensed professionals. HiveMind AI is not responsible for any consequences arising from reliance on our content in lieu of professional advice.
          </p>
        </Section>

        <Section title="5. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, HiveMind AI, its directors, employees, partners, agents, suppliers, or affiliates shall not be liable for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Any indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, goodwill, or business opportunities</li>
            <li>Business interruption or system failures</li>
            <li>Errors or inaccuracies in AI-generated content</li>
            <li>Decisions made based on information provided by HiveMind AI</li>
            <li>Third-party actions or services connected to our platform</li>
          </ul>
          <p>
            This limitation applies regardless of the legal theory under which the claim arises, even if HiveMind AI has been advised of the possibility of such damages.
          </p>
        </Section>

        <Section title="6. External Links">
          <p>
            Our website may contain links to third-party websites or services. These links are provided for convenience only. HiveMind AI has no control over the content, privacy practices, or accuracy of third-party sites and accepts no responsibility for them.
          </p>
        </Section>

        <Section title="7. Changes to This Disclaimer">
          <p>
            HiveMind AI reserves the right to update this disclaimer at any time. Material changes will be communicated through our website. Continued use of our services following any changes constitutes your acceptance of the updated disclaimer.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>For questions regarding this disclaimer:</p>
          <div className="mt-3 p-4 rounded-xl border border-white/6 bg-white/2">
            <p className="text-white font-medium">HiveMind AI</p>
            <p>Email: legal@hivemindai.com</p>
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
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
