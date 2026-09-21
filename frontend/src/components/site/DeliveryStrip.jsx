import { Truck, Syringe, UserCheck, ArrowRight } from "lucide-react";
import { scrollToId } from "@/lib/site";
import { Reveal } from "@/components/site/Shared";

const ITEMS = [
  {
    icon: Truck,
    title: "Entrega en 24–48 h",
    text: "En toda España, según tu zona.",
  },
  {
    icon: Syringe,
    title: "Microchip + vacunas",
    text: "Incluidos en el momento de la entrega.",
  },
  {
    icon: UserCheck,
    title: "Entrega acompañada",
    text: "Alguien del equipo te lo entrega y te explica todo antes.",
  },
];

export default function DeliveryStrip() {
  return (
    <section className="border-y border-line bg-sand/60">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-8 md:py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={0.06 * i}>
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 rounded-full bg-ink text-bone p-2.5 shrink-0">
                <it.icon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-medium leading-none">
                  {it.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-snug">{it.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.2}>
          <button
            data-testid="delivery-strip-cta"
            onClick={() => scrollToId("#entrega")}
            className="group h-full w-full min-h-[64px] flex items-center justify-between gap-3 rounded-2xl bg-ink text-bone px-6 py-4 text-left hover:bg-wadark transition-colors duration-300"
          >
            <span className="font-semibold text-sm md:text-base leading-snug">
              Cómo funciona la entrega
            </span>
            <ArrowRight className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
