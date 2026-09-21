import { PawPrint } from "lucide-react";
import { MARQUEE_ITEMS } from "@/lib/site";

export default function Marquee() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <section className="bg-ink text-bone py-5 md:py-6 overflow-hidden" aria-label="Destacados del criadero">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 whitespace-nowrap">
            <span className="font-serif text-lg md:text-2xl italic">{item}</span>
            <PawPrint className="w-4 h-4 text-copper shrink-0" />
          </span>
        ))}
      </div>
    </section>
  );
}
