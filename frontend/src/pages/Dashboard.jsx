import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, Sparkles, ShoppingCart, Euro, Package, Eye, Percent, Store,
  Loader2, ShieldCheck, CheckCircle2, TrendingUp, Bot,
} from "lucide-react";
import Shell from "@/components/Shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const fmt = (n) => new Intl.NumberFormat("es-ES").format(Math.round(n || 0));
const money = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

function Kpi({ icon: Icon, label, value, testid, accent = "text-teal" }) {
  return (
    <div className="rounded-2xl border border-edge bg-card p-5 hover:border-teal/40 transition-colors" data-testid={testid}>
      <div className="flex items-center gap-2 text-mist">
        <Icon className={`w-4 h-4 ${accent}`} />
        <span className="text-[10px] uppercase tracking-[0.18em] leading-tight">{label}</span>
      </div>
      <p className="font-display text-2xl md:text-[1.7rem] mt-3 leading-none tabular-nums">{value}</p>
    </div>
  );
}

function ConnectWizard({ onDone }) {
  const { user, setUser } = useAuth();
  const [value, setValue] = useState("");
  const [step, setStep] = useState("input");
  const [error, setError] = useState("");

  const connect = async () => {
    setError("");
    setStep("connecting");
    try {
      await api("/shopify/connect", { method: "POST", body: { shop_identifier: value } });
      setStep("done");
      setTimeout(async () => {
        const me = await api("/auth/me").catch(() => null);
        if (me) setUser(me);
        onDone?.();
      }, 1600);
    } catch (e) {
      setError(e.message);
      setStep("input");
    }
  };

  return (
    <div className="max-w-lg mx-auto rounded-3xl border border-edge bg-panel p-8 md:p-10 glow" data-testid="connect-wizard">
      <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-teal/10 text-teal">
        <Store className="w-7 h-7" />
      </span>
      <h1 className="font-display text-2xl mt-6" data-testid="connect-title">Vincula tu cuenta de Shopify</h1>
      <p className="text-mist text-sm mt-3 leading-relaxed" data-testid="connect-subtitle">
        Introduce tu nombre de usuario o correo electrónico de Shopify. La plataforma lo vinculará
        y la IA empezará a trabajar en tu tienda de inmediato.
      </p>

      {step === "input" && (
        <div className="mt-7 space-y-4">
          <input
            data-testid="shopify-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ej: mi-tienda o mi-correo@shopify.com"
            className="w-full rounded-xl bg-card border border-edge px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/60"
          />
          {error && <p className="text-danger text-sm" data-testid="connect-error">{error}</p>}
          <button
            onClick={connect}
            disabled={!value.trim()}
            data-testid="shopify-connect-btn"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal text-night px-6 py-3.5 font-semibold hover:bg-tealdeep hover:text-white transition-colors disabled:opacity-40"
          >
            <Store className="w-4 h-4" />
            Vincular Shopify
          </button>
        </div>
      )}

      {step === "connecting" && (
        <div className="mt-8 text-center py-6" data-testid="shopify-connecting">
          <Loader2 className="w-10 h-10 text-teal animate-spin mx-auto" />
          <p className="mt-5 font-medium">Conectando con Shopify…</p>
          <p className="text-mist text-xs mt-2">Estableciendo enlace seguro con tu tienda</p>
        </div>
      )}

      {step === "done" && (
        <div className="mt-8 text-center py-6" data-testid="shopify-connected-badge">
          <CheckCircle2 className="w-12 h-12 text-teal mx-auto" />
          <p className="mt-4 font-display text-xl">¡Shopify vinculado!</p>
          <p className="text-mist text-sm mt-2">La IA ya está tomando el control de tu tienda.</p>
        </div>
      )}

      <p className="mt-7 text-[11px] text-mist/60 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0 text-teal" />
        Vinculación segura y cifrada. Nunca te pediremos la contraseña de tu Shopify.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [data, setData] = useState(null);
  const [live, setLive] = useState(null);
  const [feed, setFeed] = useState([]);
  const dataRef = useRef(null);
  const counter = useRef(0);

  const load = async () => {
    try {
      const d = await api("/dashboard");
      setData(d);
      dataRef.current = d;
      setLive(d.metrics);
    } catch {}
  };

  useEffect(() => {
    load();
    const p = setInterval(load, 15000);
    return () => clearInterval(p);
  }, []);

  // Tick en vivo: pequeños avances entre sondeos (solo con la IA activada)
  useEffect(() => {
    if (!user?.ai_activated) return;
    const t = setInterval(() => {
      setLive((m) =>
        m
          ? {
              ...m,
              products_analyzed: m.products_analyzed + Math.floor(Math.random() * 3) + 1,
              visits: m.visits + Math.floor(Math.random() * 8) + 2,
              sales: m.sales + (Math.random() < 0.35 ? 1 : 0),
              orders: m.orders + (Math.random() < 0.3 ? 1 : 0),
              revenue: +(m.revenue + Math.random() * 5).toFixed(2),
              conversion: m.visits > 0 ? Math.max(0, +(m.sales / m.visits * 100).toFixed(2)) : 0,
            }
          : m
      );
    }, 2500);
    return () => clearInterval(t);
  }, [user?.ai_activated]);

  // Actividad de la IA en directo
  useEffect(() => {
    if (!data || !user?.ai_activated) return;
    const gen = () => {
      const d = dataRef.current;
      if (!d) return;
      const tpl = d.activity[Math.floor(Math.random() * d.activity.length)];
      const p = d.products[Math.floor(Math.random() * d.products.length)];
      const c = d.categories[Math.floor(Math.random() * d.categories.length)];
      counter.current += 1;
      const text = tpl
        .replace("{p}", p)
        .replace("{c}", c)
        .replace("{m}", Math.floor(Math.random() * 160) + 21)
        .replace("{n}", fmt(d.metrics.orders + counter.current));
      setFeed((f) => [{ id: Date.now() + "-" + counter.current, text, ts: new Date() }, ...f].slice(0, 14));
    };
    gen();
    const t = setInterval(gen, 3800);
    return () => clearInterval(t);
  }, [data, user?.ai_activated]);

  const m = live || data?.metrics;
  const approved = !!user.plan;
  const activated = !!user.ai_activated;
  const planName = data?.plans?.find((p) => p.id === user.plan)?.name;
  const [activating, setActivating] = useState(false);

  const activateAI = async () => {
    setActivating(true);
    try {
      await api("/me/activate-ai", { method: "POST" });
      const me = await api("/auth/me");
      setUser(me);
      await load();
    } catch {}
    setActivating(false);
  };

  return (
    <Shell>
      {!user.store?.connected ? (
        <div className="py-10">
          <ConnectWizard />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal mb-2">Panel principal</p>
              <h1 className="font-display text-2xl md:text-3xl" data-testid="dashboard-title">
                {user.store.name}
              </h1>
              <p className="text-mist text-sm mt-1.5 font-mono" data-testid="dashboard-store-domain">
                {user.store.domain}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 text-teal px-4 py-2 text-xs font-semibold" data-testid="shopify-connected-state">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                Shopify vinculado
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-card px-4 py-2 text-xs font-semibold text-mist" data-testid="store-status">
                <Store className="w-3.5 h-3.5 text-teal" />
                Tienda operativa
              </span>
              {data?.plan && (
                <Link to="/app/planes" data-testid="current-plan-badge" className="rounded-full bg-lav/15 border border-lav/40 text-lav px-4 py-2 text-xs font-semibold">
                  Plan {data.plan.name}
                </Link>
              )}
            </div>
          </div>

          {!approved ? (
            <div className="rounded-2xl border border-edge bg-card p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between" data-testid="ai-waiting-plan">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal/15 text-teal">
                  <Bot className="w-6 h-6" />
                </span>
                <div>
                  <p className="font-display text-lg leading-tight">Añade un plan para que la IA empiece a trabajar</p>
                  <p className="text-mist text-sm mt-1">Elige un plan, canjea tu voucher y la IA gestionará tu tienda.</p>
                </div>
              </div>
              <Link to="/app/planes" data-testid="go-plans-btn" className="rounded-full bg-teal text-night px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity">
                Ver planes
              </Link>
            </div>
          ) : !activated ? (
            <div className="rounded-2xl border border-teal/40 bg-teal/10 p-6 md:p-8 mb-8" data-testid="activate-ai-card">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-teal" />
                <p className="font-display text-lg leading-tight">Tu plan {planName} ha sido aprobado</p>
              </div>
              <p className="text-mist text-sm mt-2.5 max-w-xl">
                Ya puedes activar la inteligencia artificial. Al activarla empezará a trabajar en tu
                tienda y tu dinero aparecerá en el panel.
              </p>
              <button
                onClick={activateAI}
                disabled={activating}
                data-testid="activate-ai-btn"
                className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-teal text-night px-8 py-4 font-semibold hover:bg-tealdeep hover:text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {activating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                {activating ? "Activando…" : "Activar inteligencia artificial en la tienda"}
              </button>
            </div>
          ) : (
          <div className="rounded-2xl border border-teal/30 bg-gradient-to-r from-teal/10 via-card to-card p-5 md:p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between" data-testid="ai-status-card">
            <div className="flex items-center gap-4">
              <span className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-teal/15 text-teal">
                <Bot className="w-6 h-6" />
                <span className="absolute inset-0 rounded-xl border border-teal/40 animate-ping opacity-20" />
              </span>
              <div>
                <p className="font-display text-lg leading-tight">La IA está trabajando en tu tienda</p>
                <p className="text-mist text-sm mt-1">Analizando productos, optimizando visibilidad y gestionando ventas ahora mismo.</p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-teal whitespace-nowrap">● Estado: activo</span>
          </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Kpi icon={Zap} label="Productos analizados" value={m ? fmt(m.products_analyzed) : "—"} testid="kpi-products-analyzed" />
            <Kpi icon={Sparkles} label="Productos seleccionados" value={m ? fmt(m.products_selected) : "—"} testid="kpi-products-selected" />
            <Kpi icon={ShoppingCart} label="Ventas" value={m ? fmt(m.sales) : "—"} testid="kpi-sales" />
            <Kpi icon={Euro} label="Ingresos" value={m ? money(m.revenue) : "—"} testid="kpi-revenue" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Kpi icon={Package} label="Pedidos" value={m ? fmt(m.orders) : "—"} testid="kpi-orders" />
            <Kpi icon={Eye} label="Visitas" value={m ? fmt(m.visits) : "—"} testid="kpi-visits" />
            <Kpi icon={Percent} label="Conversión" value={m ? `${m.conversion}%` : "—"} testid="kpi-conversion" />
          </div>

          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            <div className="lg:col-span-3 rounded-2xl border border-edge bg-card p-6" data-testid="dashboard-chart">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-base">Evolución de ingresos</h2>
                <span className="flex items-center gap-1.5 text-xs text-teal font-mono">
                  <TrendingUp className="w-3.5 h-3.5" /> tendencia positiva
                </span>
              </div>
              <div className="flex items-end gap-1.5 h-40">
                {(data?.series || []).map((s, i) => (
                  <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                    <span className="absolute -top-6 text-[10px] text-teal opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {money(s.v)}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(100, (s.v / Math.max(...(data?.series || [{ v: 1 }]).map((x) => x.v))) * 100)}%` }}
                      transition={{ duration: 0.7, delay: i * 0.04 }}
                      className={`w-full rounded-t-md ${i === (data?.series?.length || 0) - 1 ? "bg-teal" : "bg-teal/25 group-hover:bg-teal/50"}`}
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-[8px] text-mist/60 mt-1.5">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-edge bg-card p-6 flex flex-col" data-testid="ai-activity-feed">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base">Actividad de la IA</h2>
                <span className="flex items-center gap-1.5 text-xs text-teal font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" /> en directo
                </span>
              </div>
              <div className="space-y-2.5 overflow-hidden flex-1">
                {activated ? (
                  feed.map((f) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-start gap-2.5 rounded-lg bg-panel border border-edge/60 px-3.5 py-2.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-white/90 leading-snug">{f.text}</p>
                      <p className="text-[10px] text-mist/60 mt-0.5 font-mono">
                        {f.ts.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-mist text-xs px-4">La actividad de la IA aparecerá cuando actives tu plan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-edge bg-card p-6" data-testid="products-list">
            <h2 className="font-display text-base mb-1.5">Productos seleccionados por la IA</h2>
            <p className="text-mist text-xs mb-5">Los productos con más potencial detectado para tu tienda.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(data?.products || []).map((p, i) => (
                <div key={p} className="rounded-xl border border-edge bg-panel px-4 py-3.5 flex items-center gap-3">
                  <span className="font-mono text-[10px] text-teal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium truncate">{p}</span>
                  <Sparkles className="w-3.5 h-3.5 text-teal ml-auto shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Shell>
  );
}
