import { useEffect, useState } from "react";
import { Loader2, Save, ShieldCheck } from "lucide-react";
import Shell from "@/components/Shell";
import { api, formatDetail } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const inputCls = "w-full rounded-lg bg-card border border-edge px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/60";

const METRIC_LABELS = {
  products_analyzed: "Productos analizados",
  products_selected: "Productos seleccionados",
  sales: "Ventas simuladas",
  revenue: "Ingresos simulados (€)",
  orders: "Pedidos",
  visits: "Visitas",
};

export default function Admin() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [live, setLive] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const d = await api("/admin/data");
    setData(d.data);
    setLive(d.live_metrics);
  };

  useEffect(() => {
    load().catch((e) => setMsg(formatDetail(e.message)));
  }, []);

  if (!data) return <Shell><p className="text-mist">Cargando…</p></Shell>;

  const setMetric = (k) => (e) => setData({ ...data, metrics: { ...data.metrics, [k]: Number(e.target.value) || 0 } });
  const setRate = (k) => (e) => setData({ ...data, rates: { ...data.rates, [k]: Number(e.target.value) || 0 } });
  const setPlan = (i, k) => (e) => {
    const plans = data.plans.map((p, j) => (j === i ? { ...p, [k]: Number(e.target.value) || 0 } : p));
    setData({ ...data, plans });
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...data,
        products: (data.products || []).map((s) => s.trim()).filter(Boolean),
        activity: (data.activity || []).map((s) => s.trim()).filter(Boolean),
        categories: (data.categories || []).map((s) => s.trim()).filter(Boolean),
        plans: data.plans.map((p) => ({ ...p, price: Number(p.price), profit_min: Number(p.profit_min), profit_max: Number(p.profit_max) })),
      };
      await api("/admin/data", { method: "PUT", body: { data: payload } });
      await load();
      setMsg("Valores guardados. Ya son visibles para los usuarios.");
    } catch (e) {
      setMsg(formatDetail(e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-lav mb-2">Panel de administrador</p>
          <h1 className="font-display text-2xl md:text-3xl" data-testid="admin-title">Control de valores de la plataforma</h1>
          <p className="text-mist text-sm mt-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lav" />
            Conectado como {user.email} · los cambios se aplican al instante a todos los usuarios.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          data-testid="admin-save"
          className="inline-flex items-center gap-2 rounded-xl bg-lav text-night px-7 py-3.5 font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar todo
        </button>
      </div>

      {msg && (
        <p className="mb-6 rounded-xl border border-teal/40 bg-teal/10 text-teal text-sm px-5 py-3.5" data-testid="admin-msg">
          {msg}
        </p>
      )}

      <div className="rounded-2xl border border-edge bg-panel p-6 md:p-8 mb-6" data-testid="admin-metrics">
        <h2 className="font-display text-base mb-2">Estadísticas base</h2>
        <p className="text-mist text-xs mb-6">
          Valores base que ve el usuario. La IA añade crecimiento automático por hora (editable abajo).
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(METRIC_LABELS).map((k) => (
            <div key={k}>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{METRIC_LABELS[k]}</label>
              <input value={data.metrics[k] ?? ""} onChange={setMetric(k)} data-testid={`admin-metric-${k}`} className={`${inputCls} mt-2`} />
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-edge grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(METRIC_LABELS).map((k) => (
            <div key={k}>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                Crecimiento/hora · {METRIC_LABELS[k]}
              </label>
              <input value={data.rates[k] ?? ""} onChange={setRate(k)} data-testid={`admin-rate-${k}`} className={`${inputCls} mt-2`} />
            </div>
          ))}
        </div>
        {live && (
          <p className="mt-5 text-xs text-mist font-mono" data-testid="admin-live">
            En vivo ahora → analizados: {live.products_analyzed} · ventas: {live.sales} · ingresos: {live.revenue} € · visitas: {live.visits}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-edge bg-panel p-6 md:p-8 mb-6" data-testid="admin-plans">
        <h2 className="font-display text-base mb-6">Planes y precios</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {data.plans.map((p, i) => (
            <div key={p.id} className="rounded-xl border border-edge bg-card p-5">
              <p className="font-display text-sm mb-4">{p.name}</p>
              {[
                ["price", "Precio (€)"],
                ["profit_min", "Ganancia mín. (€/mes)"],
                ["profit_max", "Ganancia máx. (€/mes)"],
              ].map(([k, label]) => (
                <div key={k} className="mb-3">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{label}</label>
                  <input value={p[k]} onChange={setPlan(i, k)} data-testid={`admin-plan-${p.id}-${k}`} className={`${inputCls} mt-1.5`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {[
          ["products", "Productos", "Uno por línea"],
          ["activity", "Plantillas de actividad de la IA", "Una por línea. Variables: {p} producto, {c} categoría, {m} dinero, {n} pedido"],
          ["categories", "Categorías", "Separadas por comas"],
        ].map(([key, title, hint]) => (
          <div key={key} className="rounded-2xl border border-edge bg-panel p-6 md:p-8" data-testid={`admin-${key}`}>
            <h2 className="font-display text-base">{title}</h2>
            <p className="text-mist text-xs mt-1.5 mb-4">{hint}</p>
            <textarea
              value={(data[key] || []).join("\n")}
              onChange={(e) =>
                setData({
                  ...data,
                  [key]: key === "categories" ? e.target.value.split(",").map((s) => s.trim()) : e.target.value.split("\n"),
                })
              }
              rows={key === "activity" ? 8 : 6}
              data-testid={`admin-${key}-input`}
              className={`${inputCls} leading-relaxed`}
            />
          </div>
        ))}
      </div>
    </Shell>
  );
}
