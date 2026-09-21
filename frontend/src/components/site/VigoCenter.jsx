import { MapPin, CalendarDays } from "lucide-react";
import { waLink } from "@/lib/site";
import { SectionHead, Reveal, WaButton } from "@/components/site/Shared";

export default function VigoCenter() {
  return (
    <section id="criadero" className="py-24 md:py-32 bg-sand scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="06"
          eyebrow="El criadero"
          title={
            <>
              Visítanos en
              <br />
              <em className="italic text-copper">Vigo</em>
            </>
          }
          desc="Ven a conocer a los cachorros y a sus padres en nuestro centro especializado. Las visitas se hacen con cita previa para no alterar los ritmos de las camadas."
        />

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Reveal>
            <div className="h-full rounded-3xl bg-bone border border-line p-8 md:p-10 flex flex-col">
              <div className="flex items-center gap-3" data-testid="vigo-address-badge">
                <MapPin className="w-5 h-5 text-copper" />
                <span className="font-mono text-xs uppercase tracking-[0.25em]">
                  Vigo, Pontevedra — Galicia
                </span>
              </div>
              <ul className="mt-8 space-y-5 text-sm md:text-base">
                <li className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 mt-0.5 text-forest shrink-0" />
                  <span data-testid="vigo-schedule-info">
                    <strong className="font-semibold">Horario de visitas:</strong> lunes a sábado,
                    de 10:00 a 19:00 h, siempre con cita previa.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-copper shrink-0" />
                  <span>
                    Conocerás a los padres, verás las instalaciones y podrás elegir a tu cachorro
                    en persona.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 w-2 h-2 rounded-full bg-copper shrink-0" />
                  <span>
                    Si eliges el envío a domicilio, un miembro del equipo te entregará el cachorro
                    y te explicará todo antes de la entrega.
                  </span>
                </li>
              </ul>
              <div className="mt-auto pt-9">
                <WaButton
                  href={waLink(
                    "¡Hola! Quiero agendar una visita al criadero de Vigo para conocer a los cachorros."
                  )}
                  testid="vigo-appointment-whatsapp-btn"
                >
                  Agendar visita por WhatsApp
                </WaButton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full min-h-[380px] rounded-3xl overflow-hidden border border-line">
              <iframe
                title="Mapa — Centro especializado en Vigo"
                src="https://www.google.com/maps?q=Vigo,+Pontevedra,+Espa%C3%B1a&output=embed"
                loading="lazy"
                className="absolute inset-0 h-full w-full grayscale-[30%]"
              />
              <div className="absolute bottom-5 left-5 rounded-2xl bg-ink text-bone px-5 py-4 shadow-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/60">
                  Centro especializado
                </p>
                <p className="font-serif text-xl mt-1">Criadero del Pastor Alemán · Vigo</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
