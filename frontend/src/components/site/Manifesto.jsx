import { Reveal } from "@/components/site/Shared";

const CHAPTERS = [
  {
    n: "01",
    title: "La crianza",
    text: "Cada camada nace y crece en nuestro centro de Vigo, con control veterinario permanente, socialización diaria y la atención de un equipo que vive para esta raza.",
  },
  {
    n: "02",
    title: "La raza",
    text: "Seleccionamos líneas equilibradas de belleza y trabajo: temple estable, inteligencia y esa fidelidad que solo un Pastor Alemán sabe dar.",
  },
  {
    n: "03",
    title: "La garantía",
    text: "Todos nuestros cachorros se entregan con microchip homologado, vacunas obligatorias, cartilla veterinaria y contrato de cesión. Sin letra pequeña.",
  },
];

export default function Manifesto() {
  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.35em] text-copper mb-5">
            Manifiesto
          </p>
        </Reveal>
        <div className="mt-4">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.n} delay={0.05 * i}>
              <div className="group grid md:grid-cols-12 gap-4 md:gap-8 border-t border-line py-10 md:py-14 items-start">
                <span className="md:col-span-2 font-mono text-sm text-copper">{c.n}</span>
                <h3 className="md:col-span-4 font-serif text-4xl md:text-6xl font-medium leading-none group-hover:italic transition-all duration-300">
                  {c.title}
                </h3>
                <p className="md:col-span-6 text-muted-foreground md:text-lg leading-relaxed md:pt-2">
                  {c.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
