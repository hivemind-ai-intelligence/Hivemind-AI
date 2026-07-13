import { useAdminData } from "@/hooks/useAdminData";

export default function Logo({ className = "" }: { className?: string }) {
  const { data } = useAdminData();

  if (data.logoDataUrl) {
    return <img src={data.logoDataUrl} alt={data.brandName || "Hivemind AI"} className={`object-contain ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <defs>
          <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8b2c4" />
            <stop offset="100%" stopColor="#e0e8f0" />
          </linearGradient>
        </defs>
        <path d="M16 2L2 10V22L16 30L30 22V10L16 2Z" stroke="url(#metallic)" strokeWidth="2" fill="none" />
        <path d="M10 12V20M22 12V20M10 16H22" stroke="url(#metallic)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-bold text-lg tracking-wide hidden sm:block text-foreground whitespace-nowrap">
        {data.brandName || "Hivemind AI"}
      </span>
    </div>
  );
}