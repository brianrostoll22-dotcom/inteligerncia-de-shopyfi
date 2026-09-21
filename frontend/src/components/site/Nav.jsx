import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, WA_DEFAULT_MSG, waLink, scrollToId } from "@/lib/site";
import { WhatsAppIcon, EASE } from "@/components/site/Shared";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-bone/85 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
          <a
            href="#top"
            data-testid="nav-logo"
            onClick={(e) => go(e, "#top")}
            className="flex items-baseline gap-2.5"
          >
            <span className="font-serif text-xl md:text-2xl font-semibold tracking-tight">
              Pastor Alemán
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.3em] text-copper">
              Criadero · Vigo
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-${l.href.slice(1)}-link`}
                onClick={(e) => go(e, l.href)}
                className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={waLink(WA_DEFAULT_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-whatsapp-cta"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink text-bone px-5 py-2.5 text-sm font-semibold hover:bg-wadark transition-colors duration-300"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
            <button
              data-testid="nav-mobile-toggle"
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-ink"
              aria-label="Abrir menú"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-bone lg:hidden"
          >
            <div className="pt-28 px-6 flex flex-col gap-2">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  data-testid={`nav-mobile-${l.href.slice(1)}-link`}
                  onClick={(e) => go(e, l.href)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: EASE }}
                  className="font-serif text-5xl py-3 border-b border-line"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href={waLink(WA_DEFAULT_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="nav-mobile-whatsapp-cta"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
                className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-full bg-ink text-bone px-6 py-4 text-base font-semibold"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Contactar por WhatsApp
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
