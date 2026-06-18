import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIChat from "@/components/AIChat";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Owner from "@/components/Owner";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import EnquiryForm from "@/components/EnquiryForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import AdminPanel from "@/components/AdminPanel";

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
        <main className="bg-black text-white min-h-screen relative overflow-x-hidden font-sans selection:bg-white/30">
          {/* Scroll Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neutral-400 via-white to-neutral-400 z-50 origin-left"
            style={{ scaleX }}
          />

          <CustomCursor />
          <Navbar />
          
          <Hero />
          
          <div className="relative z-10 bg-black">
            <AIChat />
            <Services />
            <Projects />
            <Owner />
            <Testimonials />
            <Pricing />
            <EnquiryForm />
            <Contact />
          </div>
          
          <Footer />
          <AdminPanel />
        </main>
      )}
    </>
  );
}
