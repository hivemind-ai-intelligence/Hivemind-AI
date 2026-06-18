import { Mail, MessageSquare, Phone, MapPin, Twitter, Github, Linkedin } from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function Contact() {
  const { data } = useAdminData();

  const contactMethods = [
    { icon: Mail, title: "Email", value: data.contact.email, link: `mailto:${data.contact.email}` },
    { icon: Phone, title: "WhatsApp", value: data.contact.whatsapp, link: `https://wa.me/${data.contact.whatsapp.replace(/\D/g,'')}` },
    { icon: MessageSquare, title: "Discord", value: data.contact.discord, link: `https://discord.com/users/${data.contact.discord}` },
    { icon: MapPin, title: "Location", value: "Remote — Worldwide", link: "#" },
  ];

  return (
    <section className="py-24 border-t border-white/5">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a 
                key={method.title}
                href={method.link}
                className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-colors group flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-2">{method.title}</h4>
                <p className="text-white font-medium">{method.value}</p>
              </a>
            );
          })}
        </div>

        <div className="flex justify-center gap-6">
          <SocialLink icon={Twitter} href="#" />
          <SocialLink icon={Github} href="#" />
          <SocialLink icon={MessageSquare} href="#" />
          <SocialLink icon={Linkedin} href="#" />
        </div>
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
      className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/50 transition-colors"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}
