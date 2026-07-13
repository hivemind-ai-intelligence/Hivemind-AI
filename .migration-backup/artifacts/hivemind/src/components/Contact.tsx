import { Mail, MessageSquare, Phone, MapPin, Linkedin } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { toast } from "sonner";

export default function Contact() {
  const { data } = useAdminData();

  const handleCopyDiscord = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(data.contactDiscord);
    toast.success("Discord tag copied to clipboard!");
  };

  const contactMethods = [
    { icon: Mail, title: "Email", value: data.contactEmail, link: `mailto:${data.contactEmail}` },
    { icon: Phone, title: "WhatsApp", value: data.contactWhatsApp, link: `https://wa.me/${data.contactWhatsApp.replace(/\D/g,'')}` },
    { icon: MessageSquare, title: "Discord", value: data.contactDiscord, link: "#", onClick: handleCopyDiscord },
    { icon: MapPin, title: "Location", value: data.contactLocation, link: "#" },
  ];

  return (
    <section className="py-24 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a 
                key={method.title}
                href={method.link}
                onClick={method.onClick}
                className="glass-panel rounded-2xl p-6 border border-border hover:border-foreground/20 transition-colors group flex flex-col items-center text-center bg-card/50"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground group-hover:text-foreground group-hover:bg-foreground/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{method.title}</h4>
                <p className="text-foreground font-medium">{method.value}</p>
              </a>
            );
          })}
        </div>

        {(data.founderLinkedIn && data.founderLinkedIn !== "#") && (
          <div className="flex justify-center gap-6">
            <SocialLink icon={Linkedin} href={data.founderLinkedIn} />
          </div>
        )}
      </div>
    </section>
  );
}

function SocialLink({ icon: Icon, href }: { icon: any, href: string }) {
  const ref = useMagneticEffect(0.5);
  return (
    <a 
      href={href}
      ref={ref as any}
      target="_blank"
      rel="noopener noreferrer"
      className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors glass-panel"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}