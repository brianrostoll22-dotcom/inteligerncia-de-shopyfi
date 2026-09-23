import { waLink } from "@/lib/site";
import { SectionHead, Reveal, WhatsAppIcon } from "@/components/site/Shared";

const scrollTo = (e, href) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const BLOCKS = [
  {
    h: "Comprar un cachorro de Pastor Alemán en España",
    p: "Si estás buscando cachorros de Pastor Alemán en venta, lo importante no es solo encontrar un cachorro disponible, sino elegir un criadero especializado en la raza que te garantice salud, documentación y acompañamiento. Nuestro centro de Vigo cría únicamente Pastores Alemanes de pura raza, con selección de temperamento y control veterinario permanente.",
  },
  {
    h: "¿Cuánto cuesta un cachorro de Pastor Alemán?",
    p: "En nuestro criadero el precio es de 450 € por cachorro, con todo incluido: microchip homologado, vacunas obligatorias al día, cartilla veterinaria oficial, desparasitación y contrato de cesión. Sin costes ocultos ni sorpresas de última hora: el precio que ves es el precio final.",
  },
  {
    h: "Adopción responsable de Pastor Alemán",
    p: "Adoptar o comprar un Pastor Alemán es una decisión de años. Por eso, antes de cada entrega hablamos contigo: te explicamos los cuidados, la alimentación, la educación y el ejercicio que necesita la raza, y te acompañamos después de la entrega con seguimiento personalizado. Reservar un cachorro con nosotros es empezar una adopción responsable.",
  },
  {
    h: "Entrega a domicilio en 24-48 h en toda España",
    p: "Puedes venir a conocernos a Vigo o recibir a tu cachorro en casa: nuestras furgonetas disponen de localizador GPS y el cachorro viaja siempre acompañado por un miembro del equipo, de acuerdo con la legislación española de bienestar animal. Según tu zona, la entrega se realiza en 24 o 48 horas.",
  },
  {
    h: "El carácter del Pastor Alemán",
    p: "El Pastor Alemán es una de las razas más inteligentes, versátiles y leales del mundo: protector con la familia, paciente con los niños y extraordinariamente capaz de aprender. Con la crianza y socialización adecuadas, es el compañero ideal tanto para familia activa como para trabajo y deporte canino.",
  },
  {
    h: "Visita nuestro criadero de Vigo",
    p: "Estamos en Vigo, Pontevedra (Galicia), y recibimos visitas con cita previa de lunes a sábado. Ven a conocer a los padres, a las camadas y a nuestro equipo antes de decidir: la mejor forma de comprar un cachorro con confianza es verlo en su propio entorno.",
  },
];

export default function SeoContent() {
  return (
    <section className="py-24 md:py-32 bg-sand" aria-label="Guía para comprar un Pastor Alemán">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="08"
          eyebrow="Guía de la raza"
          title={
            <>
              Todo sobre comprar un cachorro de <em className="italic text-copper">Pastor Alemán</em>
            </>
          }
          desc="Compra, adopción responsable, precios, documentación y entrega: lo que necesitas saber antes de traer un Pastor Alemán a tu vida."
        />
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {BLOCKS.map((b, i) => (
            <Reveal key={b.h} delay={0.05 * i}>
              <article>
                <h3 className="font-serif text-2xl md:text-3xl font-medium leading-snug">{b.h}</h3>
                <p className="mt-3 text-muted-foreground md:text-lg leading-relaxed">{b.p}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-14">
          <div className="rounded-3xl bg-ink text-bone p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl">
                ¿Listo para reservar a tu cachorro de Pastor Alemán?
              </h3>
              <p className="mt-2 text-bone/70 text-sm md:text-base">
                Escríbenos por WhatsApp: te mostramos los cachorros disponibles y resolvemos todas tus dudas.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <a
                href="#cachorros"
                data-testid="seo-section-puppies-link"
                onClick={(e) => scrollTo(e, "#cachorros")}
                className="inline-flex items-center rounded-full border border-bone/30 px-6 py-3.5 text-sm font-semibold hover:bg-bone hover:text-ink transition-all duration-300"
              >
                Ver cachorros
              </a>
              <a
                href={waLink(
                  "¡Hola! Quiero reservar un cachorro de Pastor Alemán (450 €). ¿Me dais más información?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="seo-section-whatsapp-btn"
                className="inline-flex items-center gap-2.5 rounded-full bg-wa px-6 py-3.5 text-sm font-semibold text-white hover:bg-wadark transition-colors duration-300"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
