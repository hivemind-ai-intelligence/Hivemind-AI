import type { ElementType } from "react";
import { motion } from "framer-motion";
import { Shield, Building2, Lock, Brain, Globe2, Rocket, CheckCircle } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

const ICON_MAP: Record<string, ElementType> = {
  Shield, Building2, Lock, Brain, Globe2, Rocket, CheckCircle,
};

export default function TrustBadgesBar() {
  const { data } = useAdminData();
  const enabled = (data.trustBadges || []).filter(b => b.enabled);
  if (!enabled.length) return null;

  return (
    <div className="border-t border-white/5 bg-black/60 backdrop-blur-sm py-5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {enabled.map((badge, i) => {
            const Icon = ICON_MAP[badge.icon] || CheckCircle;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
                <span className="text-[11px] font-medium tracking-widest uppercase whitespace-nowrap">
                  {badge.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
