import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Radar, MapPin, Flag, Check, Truck } from "lucide-react";
import { toast } from "sonner";
import { waLink } from "@/lib/site";
import { SectionHead, Reveal, WhatsAppIcon, EASE } from "@/components/site/Shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STEPS = ["Pedido confirmado", "En preparación", "En camino", "Entregado"];

function stepIndex(progress) {
  if (progress >= 100) return 3;
  if (progress >= 50) return 2;
  if (progress >= 25) return 1;
  return 0;
}

export default function DeliveryTracking() {
  const [code, setCode] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const latest = useRef(null);

  const lookup = async (raw) => {
    const c = (raw || "").trim().toUpperCase();
    if (!c) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/track/${encodeURIComponent(c)}`);
      if (!res.ok) throw new Error("not found");
      const data = await res.json();
      latest.current = data.code;
      setInfo(data);
    } catch {
      toast.error("No encontramos ese código. Compruébalo o pídenoslo por WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!info) return;
    const t = setInterval(() => lookup(latest.current), 20000);
    return () => clearInterval(t);
  }, [info]);

  const active = info ? stepIndex(info.progress) : 0;

  return (
    <section id="seguimiento" className="py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="05"
          eyebrow="Seguimiento"
          title={
            <>
              Ver el estado de
              <br />
              <em className="italic text-copper">mi entrega</em>
            </>
          }
        />

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Reveal>
            <div className="h-full rounded-3xl border border-line bg-sand p-8 md:p-10 flex flex-col">
              <div className="flex items-center gap-3">
                <Radar className="w-5 h-5 text-copper" />
                <span className="font-mono text-xs uppercase tracking-[0.25em]">
                  Localizador GPS en la furgoneta
                </span>
              </div>
              <p className="mt-6 text-muted-foreground md:text-lg leading-relaxed">
                Nuestras furgonetas disponen de su respectivo localizador: puedes ver{" "}
                <strong className="text-ink font-semibold">en tiempo real</strong> cómo se dirige
                hacia tu destino desde que sale del criadero.
              </p>
              <p className="mt-4 text-muted-foreground md:text-lg leading-relaxed">
                Para comprobarlo, introduce el{" "}
                <strong className="text-ink font-semibold">
                  número de seguimiento que te daremos por WhatsApp
                </strong>{" "}
                en el momento de realizar el pedido.
              </p>

              <div className="mt-8">
                <label
                  htmlFor="track-input"
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                >
                  Número de seguimiento
                </label>
                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <input
                    id="track-input"
                    data-testid="track-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && lookup(code)}
                    placeholder="PA-VIGO-7F3K"
                    className="flex-1 rounded-full border border-line bg-bone px-5 py-3.5 text-sm font-mono uppercase tracking-wider placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-copper/60"
                  />
                  <button
                    data-testid="track-submit-btn"
                    onClick={() => lookup(code)}
                    disabled={loading}
                    className="rounded-full bg-ink text-bone px-7 py-3.5 text-sm font-semibold hover:bg-wadark transition-colors duration-300 disabled:opacity-60"
                  >
                    {loading ? "Buscando…" : "Ver estado"}
                  </button>
                </div>
                <a
                  href={waLink(
                    "¡Hola! Acabo de realizar un pedido y quiero que me facilitéis mi número de seguimiento."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="tracking-whatsapp-btn"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-wadark transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  ¿No tienes tu código? Pídenoslo por WhatsApp
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              data-testid="track-panel"
              className="h-full min-h-[380px] rounded-3xl bg-ink text-bone p-8 md:p-10 flex flex-col"
            >
              {!info ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
                  <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-bone/5">
                    <span className="absolute inset-0 rounded-full bg-wa/20 animate-ping" />
                    <Radar className="w-9 h-9 text-wa" />
                  </span>
                  <div>
                    <p className="font-serif text-2xl">Esperando tu código</p>
                    <p className="mt-2 text-sm text-bone/60 max-w-xs mx-auto leading-relaxed">
                      Introduce el número de seguimiento que te entregamos por WhatsApp y aquí
                      verás la posición de la furgoneta en directo.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">
                        Furgoneta · {info.code}
                      </p>
                      <h3 className="font-serif text-3xl mt-2">
                        Cachorro de {info.puppy} rumbo a {info.destination}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-wa/15 text-wa px-4 py-2 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-wa animate-pulse" />
                      GPS en directo
                    </span>
                  </div>

                  <div className="mt-9" data-testid="track-route">
                    <div className="flex items-center justify-between text-xs text-bone/60 font-mono uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Vigo
                      </span>
                      <span className="flex items-center gap-1.5">
                        {info.destination} <Flag className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <div className="relative mt-3 h-1 rounded-full bg-bone/15">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${info.progress}%` }}
                        transition={{ duration: 1.4, ease: EASE }}
                        className="absolute inset-y-0 left-0 rounded-full bg-wa"
                      />
                      <motion.span
                        initial={{ left: "0%" }}
                        animate={{ left: `${info.progress}%` }}
                        transition={{ duration: 1.4, ease: EASE }}
                        data-testid="track-van"
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      >
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-wa text-ink shadow-lg shadow-wa/30">
                          <Truck className="w-5 h-5" />
                        </span>
                      </motion.span>
                    </div>
                    <p className="mt-3 text-xs text-bone/50">
                      {info.progress}% del recorrido · posición actualizada en tiempo real
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="track-steps">
                    {STEPS.map((s, i) => (
                      <div
                        key={s}
                        data-testid={`track-step-${i + 1}`}
                        className={`rounded-xl border p-3 text-xs leading-snug ${
                          i < active
                            ? "border-wa/40 bg-wa/10 text-bone"
                            : i === active
                            ? "border-wa bg-wa/15 text-bone font-semibold"
                            : "border-bone/10 bg-bone/5 text-bone/40"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {i < active ? <Check className="w-3.5 h-3.5 text-wa" /> : <span className={`w-1.5 h-1.5 rounded-full ${i === active ? "bg-wa" : "bg-bone/30"}`} />}
                          {i + 1}
                        </span>
                        <span className="block mt-1.5">{s}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div data-testid="track-eta">
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/50">
                        Entrega estimada
                      </p>
                      <p className="font-serif text-xl mt-1">{info.eta}</p>
                    </div>
                    <p className="text-xs text-bone/40">
                      Actualización automática cada 20 s · {info.destination}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
