import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { WA_DEFAULT_MSG, waLink, scrollToId } from "@/lib/site";
import { MaskLine, WaButton, EASE } from "@/components/site/Shared";

const HERO_IMG =
  "https://images.unsplash.com/photo-1511816882713-c794694b5a5f?q=80&w=1800&auto=format&fit=crop";

const STATS = [
  { value: "24–48 h", label: "Entrega en toda España según zona", testid: "hero-stat-shipping" },
  { value: "Microchip + vacunas", label: "Incluidos en la entrega", testid: "hero-stat-vaccines" },
  { value: "Vigo", label: "Visitas al centro con cita previa", testid: "hero-stat-visit" },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen flex flex-col justify-between pt-28 md:pt-36 pb-0 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <div className="lg:col-span-7 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            data-testid="hero-eyebrow"
            className="font-mono text-[11px] md:text-xs uppercase tracking-[0.35em] text-copper mb-6"
          >
            Criadero especializado · Vigo, España
          </motion.p>

          <h1
            data-testid="hero-title"
            className="font-serif font-medium text-[clamp(3.2rem,9.5vw,8rem)] leading-[0.95] tracking-tight"
          >
            <MaskLine delay={0.25}>La <em className="italic text-copper">nobleza</em></MaskLine>
            <MaskLine delay={0.38}>tiene cuatro</MaskLine>
            <MaskLine delay={0.51}>patas.</MaskLine>
          </h1>

          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.4 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            className="lg:hidden mt-6 relative h-[34vh] rounded-2xl overflow-hidden border border-line"
          >
            <img
              src={HERO_IMG}
              alt="Pastor Alemán adulto entre rocas al atardecer"
              className="absolute inset-0 h-full w-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-bone/90 backdrop-blur px-3.5 py-1.5 text-xs font-semibold text-ink">
              Camada lista para entrega
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
            data-testid="hero-subtitle"
            className="mt-7 max-w-xl text-muted-foreground text-base md:text-lg leading-relaxed"
          >
            Crianza responsable de Pastor Alemán de pura raza. Cachorros disponibles para entrega
            inmediata, con microchip, vacunas obligatorias y toda la documentación sanitaria.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.88, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#entrega"
              data-testid="hero-delivery-chip"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("#entrega");
              }}
              className="inline-flex flex-col rounded-2xl border border-line bg-sand px-5 py-3 hover:border-copper/60 transition-colors"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Entrega en toda España
              </span>
              <span className="font-serif text-2xl md:text-3xl font-semibold leading-none mt-1">
                24–48 h
              </span>
            </a>
            <WaButton
              href={waLink(WA_DEFAULT_MSG)}
              testid="hero-whatsapp-button"
              className="mt-1"
            >
              Reservar por WhatsApp
            </WaButton>
            <a
              href="#criadero"
              data-testid="hero-visit-button"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("#criadero");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-semibold hover:bg-ink hover:text-bone transition-all duration-300"
            >
              Visitar el criadero
            </a>
          </motion.div>
        </div>

        <div className="hidden lg:block lg:col-span-5 relative">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.3, delay: 0.45, ease: EASE }}
            className="relative rounded-t-[10rem] lg:rounded-[10rem] overflow-hidden h-[52vh] lg:h-[68vh]"
          >
            <motion.img
              src={HERO_IMG}
              alt="Pastor Alemán adulto entre rocas al atardecer"
              style={{ y: imgY }}
              className="absolute inset-0 h-[120%] w-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: EASE }}
            className="absolute -bottom-5 left-5 lg:left-auto lg:-right-4 bg-ink text-bone rounded-2xl px-5 py-4 shadow-xl"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
              Disponible ahora
            </p>
            <p className="font-serif text-xl mt-1">Camada lista para entrega</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="mx-auto w-full max-w-7xl px-5 md:px-8 mt-16 lg:mt-24"
      >
        <div className="border-t border-line grid grid-cols-1 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-testid={s.testid}
              className={`py-6 sm:py-8 flex items-center gap-4 ${
                i > 0 ? "border-t sm:border-t-0 sm:border-l border-line sm:pl-8" : "sm:pr-8"
              }`}
            >
              <span className="font-serif text-2xl md:text-3xl font-semibold whitespace-nowrap">
                {s.value}
              </span>
              <span className="text-sm text-muted-foreground leading-snug">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2 pb-8 text-muted-foreground">
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Desliza</span>
        </div>
      </motion.div>
    </section>
  );
}
