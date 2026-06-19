import { useState, useEffect, lazy, Suspense } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Owner from "@/components/Owner";
import WorldMap from "../components/WorldMap";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import EnquiryForm from "@/components/EnquiryForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { Loader2 } from "lucide-react";

// Lazy load heavy components
const AIChat = lazy(() => import("@/components/AIChat"));

const FallbackSpinner = () => (
  <div className="w-full h-[500px] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
  </div>
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const isLoaded = sessionStorage.getItem("hivemind_loaded");
    if (isLoaded) {
      setLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("hivemind_loaded", "true");
    setLoading(false);
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      {!loading && (
        <main className="bg-background text-foreground min-h-screen relative overflow-x-hidden font-sans selection:bg-foreground/30">
          {/* Scroll Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neutral-400 via-foreground to-neutral-400 z-50 origin-left"
            style={{ scaleX }}
          />

          <CustomCursor />
          <Navbar />
          
          <Hero />
          <Marquee />
          
          <div className="relative z-10 bg-background">
            <Suspense fallback={<FallbackSpinner />}>
              <AIChat />
            </Suspense>
            <Services />
            <Projects />
            <WorldMap />
            <Owner />
            <Testimonials />
            <Pricing />
            <EnquiryForm />
            <Contact />
          </div>
          
          <Footer />
        </main>
      )}
    </>
  );
}