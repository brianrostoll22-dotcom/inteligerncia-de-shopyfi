import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { PUPPIES, PRICE, waLink } from "@/lib/site";
import { SectionHead, Reveal, WhatsAppIcon, EASE } from "@/components/site/Shared";

const FILTERS = [
  { id: "todos", label: "Todos", testid: "filter-gender-all" },
  { id: "Macho", label: "Machos", testid: "filter-gender-males" },
  { id: "Hembra", label: "Hembras", testid: "filter-gender-females" },
];

export default function Puppies() {
  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState(null);
  const list = PUPPIES.filter((p) => filter === "todos" || p.gender === filter);

  return (
    <section id="cachorros" className="py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="02"
          eyebrow="Disponibilidad"
          title={
            <>
              Cachorros listos para
              <br />
              su <em className="italic text-copper">nuevo hogar</em>
            </>
          }
          desc="Cada cachorro se entrega con microchip, vacunas obligatorias y cartilla veterinaria. Precio único: 450 €."
          right={
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  data-testid={f.testid}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    filter === f.id
                      ? "bg-ink text-bone"
                      : "border border-line bg-sand text-ink/70 hover:border-ink/40"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          }
        />

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: EASE }}
                data-testid={`puppy-card-${p.id}`}
                className="group"
              >
                <button
                  onClick={() => setSelected(p)}
                  className="block w-full text-left"
                  aria-label={`Ver ficha de ${p.name}`}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-sand aspect-[4/5]">
                    <img
                      src={p.img}
                      alt={`Cachorro de Pastor Alemán ${p.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-bone/90 backdrop-blur px-3.5 py-1.5 text-xs font-semibold text-ink">
                      {p.gender}
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-full bg-ink text-bone font-serif text-lg font-semibold px-4 py-1.5">
                      {PRICE}
                    </span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-3xl font-medium leading-none">{p.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {p.age} · {p.line}
                      </p>
                    </div>
                    <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-copper">
                      Disponible
                    </span>
                  </div>
                </button>
                <a
                  href={waLink(
                    `¡Hola! Estoy interesado en ${p.name}, el cachorro de Pastor Alemán de 450 €. ¿Sigue disponible?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`puppy-whatsapp-reserve-btn-${p.id}`}
                  className="mt-4 flex items-center justify-center gap-2 rounded-full border border-ink/15 py-3 text-sm font-semibold hover:bg-wa hover:border-wa hover:text-white transition-all duration-300"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Reservar por WhatsApp
                </a>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent
          data-testid="puppy-details-modal"
          className="max-w-3xl p-0 overflow-hidden gap-0 bg-bone"
        >
          {selected && (
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/5] sm:aspect-auto sm:h-full min-h-[280px]">
                <img
                  src={selected.img}
                  alt={`Cachorro de Pastor Alemán ${selected.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-7 md:p-9 flex flex-col">
                <DialogTitle className="font-serif text-4xl font-medium">{selected.name}</DialogTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selected.gender} · {selected.age} · {selected.line}
                </p>
                <dl className="mt-6 space-y-3 text-sm">
                  {[
                    ["Manto", selected.coat],
                    ["Carácter", selected.temper],
                    ["Precio", PRICE],
                    ["Entrega", "24–48 h según zona"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-line pb-3">
                      <dt className="text-muted-foreground shrink-0">{k}</dt>
                      <dd className="font-medium text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-5 space-y-1.5 text-sm text-muted-foreground">
                  {["Microchip homologado", "Vacunas obligatorias", "Cartilla veterinaria oficial", "Contrato de cesión"].map(
                    (x) => (
                      <li key={x} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-copper" />
                        {x}
                      </li>
                    )
                  )}
                </ul>
                <a
                  href={waLink(
                    `¡Hola! Estoy interesado en ${selected.name}, el cachorro de Pastor Alemán de 450 €. ¿Sigue disponible?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="puppy-whatsapp-reserve-btn"
                  className="mt-auto pt-7 inline-flex items-center justify-center gap-2.5 rounded-full bg-ink text-bone px-6 py-4 text-sm font-semibold hover:bg-wadark transition-colors duration-300"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Reservar a {selected.name} por WhatsApp
                </a>
              </div>
            </div>
          )}
          <button
            onClick={() => setSelected(null)}
            aria-label="Cerrar ficha"
            className="absolute top-4 right-4 rounded-full bg-bone/90 p-2 text-ink hover:bg-bone transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
