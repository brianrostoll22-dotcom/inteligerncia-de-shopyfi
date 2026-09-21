import { BadgeCheck, Syringe, UserCheck, Clock } from "lucide-react";
import { WA_DEFAULT_MSG, waLink } from "@/lib/site";
import { SectionHead, Reveal, WaButton } from "@/components/site/Shared";

const ZONES = [
  {
    time: "24 h",
    text: "Para las zonas más cercanas: el cachorro llega al día siguiente de salir del criadero.",
    testid: "zone-24h",
  },
  {
    time: "48 h",
    text: "Para el resto de zonas de la península: el cachorro llega como máximo al segundo día.",
    testid: "zone-48h",
  },
];

const STEPS = [
  {
    icon: BadgeCheck,
    title: "Reserva por WhatsApp",
    text: "Eliges cachorro, confirmamos disponibilidad y resolvemos todas tus dudas.",
    testid: "shipping-step-reserve",
  },
  {
    icon: Syringe,
    title: "Preparación sanitaria",
    text: "Colocamos el microchip y administramos las vacunas obligatorias antes de la entrega.",
    testid: "shipping-step-vaccines",
  },
  {
    icon: UserCheck,
    title: "Entrega acompañada",
    text: "El cachorro viaja con un miembro de nuestro equipo, que te lo entrega en mano y te explica todo personalmente.",
    testid: "shipping-step-hand-delivery",
  },
  {
    icon: Clock,
    title: "24–48 horas",
    text: "El plazo depende de tu zona. Te lo confirmamos al cerrar la reserva.",
    testid: "shipping-step-timeframe",
  },
];

export default function Delivery() {
  return (
    <section id="entrega" className="py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="04"
          eyebrow="Entrega y garantías"
          title={
            <>
              Recíbelo donde estés,
              <br />
              <em className="italic text-copper">con todas las garantías</em>
            </>
          }
          desc="Puedes venir a conocer a los cachorros a nuestro centro de Vigo o, si te queda lejos, recibirlo en casa: de acuerdo con la legislación española de bienestar animal, el cachorro puede viajar acompañado por un miembro de nuestro equipo, que te explicará personalmente todos los cuidados antes de la entrega."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={0.07 * i}>
              <div
                data-testid={s.testid}
                className="h-full rounded-2xl border border-line bg-sand p-7 flex flex-col hover:border-copper/50 transition-colors duration-300"
              >
                <span className="font-mono text-xs text-copper">{String(i + 1).padStart(2, "0")}</span>
                <s.icon className="w-7 h-7 mt-5 text-forest" strokeWidth={1.6} />
                <h3 className="font-serif text-2xl font-medium mt-4">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {ZONES.map((z) => (
              <div
                key={z.time}
                data-testid={z.testid}
                className="rounded-2xl border border-line bg-sand p-6 md:p-7 flex items-center gap-5"
              >
                <span className="font-serif text-4xl md:text-5xl font-semibold text-forest shrink-0">
                  {z.time}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{z.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground/90 text-center sm:text-left">
            Tu plazo exacto (24 h o 48 h) se confirma por WhatsApp antes de cerrar la reserva.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="rounded-3xl bg-ink text-bone p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-copper">
                Normativa española de bienestar animal
              </p>
              <h3 className="font-serif text-3xl md:text-4xl mt-4 max-w-2xl leading-tight">
                Microchip, vacunas obligatorias y cartilla veterinaria incluidos en cada entrega.
              </h3>
              <p className="mt-3 text-bone/70 max-w-2xl leading-relaxed">
                ¿Cuándo llega a tu zona? El plazo es de 24 o 48 horas según la provincia de destino.
                Escríbenos y te confirmamos el plazo exacto para tu ciudad.
              </p>
            </div>
            <WaButton
              href={waLink(
                "¡Hola! Quiero consultar el plazo de entrega (24/48 h) a mi zona para un cachorro de Pastor Alemán."
              )}
              testid="zone-consult-whatsapp-btn"
              dark={false}
              className="shrink-0"
            >
              Consultar mi zona
            </WaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
