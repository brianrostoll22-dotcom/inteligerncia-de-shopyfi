import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Store, Sparkles, BarChart3, Eye, ShoppingCart, Wand2, ShieldCheck, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

const fmt = new Intl.NumberFormat("es-ES");

const AI_FEATURES = [
  { icon: Wand2, title: "Analiza productos", text: "La IA revisa miles de productos y detecta tendencias del mercado sin que hagas nada." },
  { icon: Sparkles, title: "Encuentra ganadores", text: "Selecciona automáticamente los productos con más potencial de venta para tu tienda." },
  { icon: BarChart3, title: "Analiza oportunidades", text: "Estudia precios, demanda y competencia para tomar las mejores decisiones." },
  { icon: ShoppingCart, title: "Gestiona las ventas", text: "Procesa pedidos, ajusta stock y gestiona el día a día de tu tienda por ti." },
  { icon: Eye, title: "Mejora la visibilidad", text: "Optimiza tu tienda para que más personas te encuentren cada día." },
  { icon: Zap, title: "Aumenta las ventas", text: "Ejecuta acciones constantes pensadas para hacer crecer tus resultados." },
];

const STEPS = [
  { n: "01", title: "Crea tu cuenta", text: "Regístrate con tu email en un minuto. No necesitas saber nada de tecnología." },
  { n: "02", title: "Vincula tu Shopify", text: "Introduce tu usuario o correo de Shopify y la plataforma lo conecta al instante." },
  { n: "03", title: "La IA trabaja por ti", text: "Mira en directo cómo la IA analiza, decide y gestiona tu tienda mientras tú te relajas." },
];

export default function Landing() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api("/plans").then((d) => setPlans(d.plans)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-night grid-bg overflow-x-clip">
      <header className="mx-auto max-w-7xl px-5 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal text-night">
            <Zap strokeWidth={2.5} className="w-5 h-5" />
          </span>
          <span className="font-display text-lg tracking-wide">NovaIA</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" data-testid="landing-login-link" className="text-sm font-medium text-mist hover:text-white transition-colors px-3 py-2">
            Iniciar sesión
          </Link>
          <Link to="/registro" data-testid="landing-register-link" className="rounded-full bg-teal text-night px-5 py-2.5 text-sm font-semibold hover:bg-tealdeep hover:text-white transition-colors">
            Empezar ahora
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-20 pb-16 md:pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-teal mb-6" data-testid="landing-eyebrow">
            Plataforma de IA para e-commerce
          </p>
          <h1 className="font-display text-4xl sm:text-5xl xl:text-[3.6rem] leading-[1.08] font-bold" data-testid="landing-title">
            Tu tienda Shopify,
            <br />
            en <span className="text-teal">piloto automático</span> con IA
          </h1>
          <p className="mt-6 text-mist text-lg leading-relaxed max-w-xl" data-testid="landing-subtitle">
            NovaIA se vincula a tu cuenta de Shopify y una inteligencia artificial se encarga de
            analizar productos, encontrar los ganadores, gestionar las ventas y hacer crecer tu
            tienda. Tú solo miras los resultados.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/registro" data-testid="landing-cta-register" className="inline-flex items-center gap-2 rounded-full bg-teal text-night px-7 py-4 font-semibold hover:bg-tealdeep hover:text-white transition-all hover:-translate-y-0.5">
              Conectar mi Shopify
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" data-testid="landing-cta-login" className="inline-flex items-center rounded-full border border-edge px-7 py-4 font-semibold text-mist hover:text-white hover:border-mist transition-all">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-teal/10 blur-3xl rounded-full" />
          <div className="relative rounded-2xl border border-edge bg-panel p-6 glow" data-testid="landing-visual">
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <span className="font-mono text-xs text-mist">panel_ia en vivo</span>
              <span className="flex items-center gap-2 text-xs text-teal font-mono">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                IA ACTIVA
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                ["Productos analizados", "12.480"],
                ["Ganadores", "86"],
                ["Ventas hoy", "312"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-card border border-edge p-3.5">
                  <p className="text-[10px] text-mist leading-tight">{k}</p>
                  <p className="font-display text-lg mt-2">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                "Analizando producto: Mochila antirrobo",
                "Producto ganador detectado: Lámpara LED Luna",
                "Venta completada: +74 €",
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg bg-card/70 border border-edge/60 px-3.5 py-2.5 text-xs text-mist">
                  <Sparkles className="w-3.5 h-3.5 text-teal shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24 border-t border-edge/60">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-teal mb-4">Cómo funciona</p>
        <h2 className="font-display text-3xl md:text-4xl mb-12">Empezar es así de simple</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-edge bg-panel p-7">
              <span className="font-mono text-teal text-sm">{s.n}</span>
              <h3 className="font-display text-lg mt-4">{s.title}</h3>
              <p className="mt-3 text-mist text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24 border-t border-edge/60">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-teal mb-4">Inteligencia artificial</p>
        <h2 className="font-display text-3xl md:text-4xl mb-12">Qué hace la IA por tu tienda</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-edge bg-panel p-7 hover:border-teal/50 transition-colors">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal/10 text-teal">
                <f.icon className="w-5 h-5" />
              </span>
              <h3 className="font-display text-base mt-5">{f.title}</h3>
              <p className="mt-2.5 text-mist text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planes" className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24 border-t border-edge/60">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-teal mb-4">Planes</p>
        <h2 className="font-display text-3xl md:text-4xl mb-4">Elige tu plan y deja que la IA trabaje</h2>
        <p className="text-mist mb-12 max-w-2xl">
          Cada plan activa la gestión automática de tu tienda con distintos niveles de potencia.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              data-testid={`landing-plan-${p.id}`}
              className={`relative rounded-2xl border p-7 flex flex-col ${p.popular ? "border-teal bg-card glow" : "border-edge bg-panel"}`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-teal text-night text-[11px] font-semibold px-3 py-1">
                  Más elegido
                </span>
              )}
              <h3 className="font-display text-xl">{p.name}</h3>
              <p className="mt-4">
                <span className="font-display text-4xl">{p.price} €</span>
              </p>
              <p className="text-sm text-mist mt-2">
                Ganancias estimadas: <span className="text-teal font-semibold">{fmt.format(p.profit_min)}–{fmt.format(p.profit_max)} €/mes</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-mist flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/registro" data-testid={`landing-plan-cta-${p.id}`} className="mt-7 inline-flex justify-center rounded-full bg-teal/10 border border-teal/40 text-teal px-6 py-3 text-sm font-semibold hover:bg-teal hover:text-night transition-colors">
                Empezar con {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-edge/60 py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-mist/60">
          <span>© {new Date().getFullYear()} NovaIA — Gestión automática de tiendas con IA</span>
          <span className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            Vigo, España
          </span>
        </div>
      </footer>
    </div>
  );
}
