import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { setLenis } from "@/lib/site";
import { track } from "@/lib/analytics";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import DeliveryStrip from "@/components/site/DeliveryStrip";
import Manifesto from "@/components/site/Manifesto";
import Puppies from "@/components/site/Puppies";
import Gallery from "@/components/site/Gallery";
import Delivery from "@/components/site/Delivery";
import DeliveryTracking from "@/components/site/DeliveryTracking";
import VigoCenter from "@/components/site/VigoCenter";
import Faq from "@/components/site/Faq";
import SeoContent from "@/components/site/SeoContent";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";

export default function Landing() {
  useEffect(() => {
    track("page_view");
    const onClick = (e) => {
      const wa = e.target.closest?.('a[href*="wa.me"]');
      if (wa) {
        track("whatsapp_click", wa.getAttribute("data-testid") || wa.textContent.trim().slice(0, 60));
        return;
      }
      const card = e.target.closest?.('[data-testid^="puppy-card-"]');
      if (card) {
        track("puppy_view", card.dataset.testid.replace("puppy-card-", ""));
      } else if (e.target.closest?.('[data-testid="track-submit-btn"]')) {
        track("tracking_lookup", "formulario");
      } else if (e.target.closest?.('[data-testid^="filter-"]')) {
        track("filter_use", e.target.closest('[data-testid^="filter-"]').dataset.testid);
      }
    };
    document.addEventListener("click", onClick, { passive: true });

    const seen = new Set();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !seen.has(en.target.id)) {
            seen.add(en.target.id);
            track("section_view", en.target.id);
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll("main section[id]").forEach((s) => obs.observe(s));
    return () => {
      document.removeEventListener("click", onClick);
      obs.disconnect();
    };
  }, []);

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
        <DeliveryStrip />
        <Manifesto />
        <Puppies />
        <Gallery />
        <Delivery />
        <DeliveryTracking />
        <VigoCenter />
        <Faq />
        <SeoContent />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster position="bottom-left" />
    </div>
  );
}
