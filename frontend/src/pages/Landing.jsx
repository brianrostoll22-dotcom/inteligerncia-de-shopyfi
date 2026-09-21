import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { setLenis } from "@/lib/site";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Manifesto from "@/components/site/Manifesto";
import Puppies from "@/components/site/Puppies";
import Gallery from "@/components/site/Gallery";
import Delivery from "@/components/site/Delivery";
import VigoCenter from "@/components/site/VigoCenter";
import Faq from "@/components/site/Faq";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";

export default function Landing() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    setLenis(lenis);
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div className="relative bg-bone text-ink font-sans overflow-x-clip">
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Puppies />
        <Gallery />
        <Delivery />
        <VigoCenter />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster position="bottom-left" />
    </div>
  );
}
