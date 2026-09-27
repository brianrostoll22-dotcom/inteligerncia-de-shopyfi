import { useEffect, useState } from "react";
import { Users, Loader2, Save, ShieldCheck, TicketCheck, Check, X, Trash2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Shell from "@/components/Shell";
import { api, formatDetail } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const inputCls = "w-full rounded-lg bg-card border border-edge px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal/60";

const METRIC_LABELS = {
  products_analyzed: "Productos analizados",
  products_selected: "Productos seleccionados",
  sales: "Ventas",
  revenue: "Ingresos (€)",
  orders: "Pedidos",
  visits: "Visitas",
};

function UserRow({ u, plans, onSaved }) {
  const [open, setOpen] = useState(false);
  const [metrics, setMetrics] = useState(u.metrics);
  const [plan, setPlan] = useState(u.plan || "none");
  const [busy, setBusy] = useState(false);
  const isNew = Date.now() - new Date(u.created_at).getTime() < 48 * 3600 * 1000;
  const planName = plans.find((p) => p.id === u.plan)?.name;

  const save = async () => {
    setBusy(true);
    try {
      await api(`/admin/users/${u.id}`, { method: "PUT", body: { metrics, plan: plan === "none" ? null : plan } });
      await onSaved();
    } catch (e) {
      alert(formatDetail(e.message));
    } finally {
      setBusy(false);
    }
  };

  const resetMetrics = async () => {
    setBusy(true);
    try {
      await api(`/admin/users/${u.id}`, {
        method: "PUT",
        body: { metrics: { products_analyzed: 0, products_selected: 0, sales: 0, revenue: 0, orders: 0, visits: 0 } },
      });
      setMetrics({ products_analyzed: 0, products_selected: 0, sales: 0, revenue: 0, orders: 0, visits: 0 });
      await onSaved();
    } catch (e) {
      alert(formatDetail(e.message));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`¿Eliminar la cuenta de ${u.email}? Esta acción no se puede deshacer.`)) return;
    setBusy(true);
    try {
      await api(`/admin/users/${u.id}`, { method: "DELETE" });
      await onSaved();
    } catch (e) {
      alert(formatDetail(e.message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-edge bg-card overflow-hidden" data-testid={`admin-user-${u.email}`}>
      <div className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{u.first_name || u.email}</span>
            {u.role === "admin" && <span className="rounded-full bg-lav/15 border border-lav/40 text-lav text-[10px] font-semibold px-2.5 py-0.5">ADMIN</span>}
            {isNew && u.role !== "admin" && <span className="rounded-full bg-teal/15 border border-teal/40 text-teal text-[10px] font-semibold px-2.5 py-0.5" data-testid={`user-new-${u.id}`}>NUEVO</span>}
            {!u.store?.connected && u.role !== "admin" && <span className="rounded-full border border-edge text-mist text-[10px] font-semibold px-2.5 py-0.5">Sin vincular</span>}
          </div>
          <p className="text-xs text-mist font-mono mt-1 truncate">
            {u.email} · {new Date(u.created_at).toLocaleDateString("es-ES")}
            {u.store?.connected ? ` · ${u.store.domain}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-mist font-mono tabular-nums">
            {u.live.products_analyzed} anal. · {u.live.sales} ventas · {u.live.revenue} €
          </span>
          <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${u.plan ? "border-teal/40 bg-teal/10 text-teal" : "border-edge text-mist"}`}>
            {planName || "Sin plan"}
          </span>
          <button onClick={() => setOpen(!open)} data-testid={`user-toggle-${u.id}`} aria-label="Gestionar usuario" className="text-mist hover:text-white transition-colors p-1">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-edge bg-panel px-5 py-5 space-y-5" data-testid={`user-editor-${u.id}`}>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Plan del usuario</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} data-testid={`user-plan-${u.id}`} className={`${inputCls} mt-2`}>
              <option value="none">Sin plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(METRIC_LABELS).map((k) => (
              <div key={k}>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{METRIC_LABELS[k]}</label>
                <input
                  value={metrics[k]}
                  onChange={(e) => setMetrics({ ...metrics, [k]: Number(e.target.value) || 0 })}
                  data-testid={`user-metric-${k}-${u.id}`}
                  className={`${inputCls} mt-1.5`}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={save} disabled={busy} data-testid={`user-save-${u.id}`} className="inline-flex items-center gap-2 rounded-lg bg-teal text-night px-5 py-2.5 text-xs font-semibold hover:opacity-90 disabled:opacity-60">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Guardar cambios
            </button>
            <button onClick={resetMetrics} disabled={busy} data-testid={`user-reset-${u.id}`} className="inline-flex items-center gap-2 rounded-lg border border-edge text-mist px-5 py-2.5 text-xs font-semibold hover:text-white hover:border-mist disabled:opacity-60">
              <Sparkles className="w-3.5 h-3.5" />
              Reiniciar a 0
            </button>
            {u.role !== "admin" && (
              <button onClick={remove} disabled={busy} data-testid={`user-delete-${u.id}`} className="inline-flex items-center gap-2 rounded-lg border border-danger/40 text-danger px-5 py-2.5 text-xs font-semibold hover:bg-danger/10 disabled:opacity-60">
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar cuenta
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [stats, setStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [d, u] = await Promise.all([api("/admin/data"), api("/admin/users")]);
    setData(d.data);
    setStats(d.stats);
    setUsers(u.users);
    setVouchers(u.vouchers);
  };

  useEffect(() => {
    load().catch((e) => setMsg(formatDetail(e.message)));
  }, []);

  if (!data) return <Shell><p className="text-mist">Cargando…</p></Shell>;

  const setRate = (k) => (e) => setData({ ...data, rates: { ...data.rates, [k]: Number(e.target.value) || 0 } });
  const setPlan = (i, k) => (e) => {
    const plans = data.plans.map((p, j) => (j === i ? { ...p, [k]: k === "vouchers_needed" ? Number(e.target.value) || 1 : e.target.value } : p));
    setData({ ...data, plans });
  };
  const setPlanNum = (i, k) => (e) => {
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
        plans: data.plans.map((p) => ({ ...p, price: Number(p.price), profit_min: Number(p.profit_min), profit_max: Number(p.profit_max), vouchers_needed: Number(p.vouchers_needed) || 1 })),
      };
      await api("/admin/data", { method: "PUT", body: { data: payload } });
      await load();
      setMsg("Configuración guardada. Ya es visible para los usuarios.");
    } catch (e) {
      setMsg(formatDetail(e.message));
    } finally {
      setSaving(false);
    }
  };

  const voucherAction = async (id, status) => {
    await api(`/admin/vouchers/${id}/status`, { method: "POST", body: { status } });
    await load();
  };

  return (
    <Shell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-lav mb-2">Panel de administrador</p>
          <h1 className="font-display text-2xl md:text-3xl" data-testid="admin-title">Gestión de la plataforma</h1>
          <p className="text-mist text-sm mt-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lav" />
            Conectado como {user.email}
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          data-testid="admin-save"
          className="inline-flex items-center gap-2 rounded-xl bg-lav text-night px-7 py-3.5 font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar configuración
        </button>
      </div>

      {msg && (
        <p className="mb-6 rounded-xl border border-teal/40 bg-teal/10 text-teal text-sm px-5 py-3.5" data-testid="admin-msg">
          {msg}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          ["Usuarios totales", stats?.users ?? "—", "admin-stat-users"],
          ["Nuevos (48 h)", stats?.new_users ?? "—", "admin-stat-new"],
          ["Vouchers pendientes", stats?.pending_vouchers ?? "—", "admin-stat-vouchers"],
        ].map(([label, v, tid]) => (
          <div key={tid} className="rounded-2xl border border-edge bg-panel p-5" data-testid={tid}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-mist">{label}</p>
            <p className="font-display text-3xl mt-2">{v}</p>
          </div>
        ))}
      </div>

      {vouchers.filter((v) => v.status === "pendiente").length > 0 && (
        <div className="rounded-2xl border border-lav/40 bg-lav/5 p-6 md:p-8 mb-6" data-testid="admin-vouchers-pending">
          <h2 className="font-display text-base mb-5 flex items-center gap-2">
            <TicketCheck className="w-5 h-5 text-lav" />
            Vouchers pendientes de validar
          </h2>
          <div className="space-y-3">
            {vouchers.filter((v) => v.status === "pendiente").map((v) => (
              <div key={v._id} className="rounded-xl border border-edge bg-card px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 justify-between" data-testid={`admin-voucher-${v._id}`}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {v.email} <span className="text-mist font-normal">· Plan {data.plans.find((p) => p.id === v.plan_id)?.name || v.plan_id}</span>
                  </p>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal font-mono break-all hover:underline">
                    {v.url}
                  </a>
                  <p className="text-[10px] text-mist/50 font-mono mt-1">{new Date(v.created_at).toLocaleString("es-ES")}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => voucherAction(v._id, "validado")} data-testid={`voucher-validate-${v._id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-teal text-night px-4 py-2 text-xs font-semibold hover:opacity-90">
                    <Check className="w-3.5 h-3.5" />
                    Validar y activar plan
                  </button>
                  <button onClick={() => voucherAction(v._id, "rechazado")} data-testid={`voucher-reject-${v._id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 text-danger px-4 py-2 text-xs font-semibold hover:bg-danger/10">
                    <X className="w-3.5 h-3.5" />
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-edge bg-panel p-6 md:p-8 mb-6" data-testid="admin-users">
        <h2 className="font-display text-base mb-5 flex items-center gap-2">
          <Users className="w-5 h-5 text-teal" />
          Usuarios ({users.length})
        </h2>
        <div className="space-y-3">
          {users.map((u) => (
            <UserRow key={u.id} u={u} plans={data.plans} onSaved={load} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-edge bg-panel p-6 md:p-8 mb-6" data-testid="admin-config">
        <h2 className="font-display text-base mb-6">Crecimiento horario de la IA</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(METRIC_LABELS).map((k) => (
            <div key={k}>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{METRIC_LABELS[k]} / hora</label>
              <input value={data.rates[k] ?? ""} onChange={setRate(k)} data-testid={`admin-rate-${k}`} className={`${inputCls} mt-2`} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-edge bg-panel p-6 md:p-8 mb-6" data-testid="admin-plans">
        <h2 className="font-display text-base mb-6">Planes, precios y vouchers</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {data.plans.map((p, i) => (
            <div key={p.id} className="rounded-xl border border-edge bg-card p-5">
              <p className="font-display text-sm mb-4">{p.name}</p>
              {[
                ["price", "Precio (€)"],
                ["profit_min", "Ganancia mín. (€/mes)"],
                ["profit_max", "Ganancia máx. (€/mes)"],
                ["vouchers_needed", "Vouchers necesarios"],
              ].map(([k, label]) => (
                <div key={k} className="mb-3">
                  <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{label}</label>
                  <input value={p[k]} onChange={k === "vouchers_needed" ? setPlan(i, k) : setPlanNum(i, k)} data-testid={`admin-plan-${p.id}-${k}`} className={`${inputCls} mt-1.5`} />
                </div>
              ))}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Enlace del voucher (G2A)</label>
                <input value={p.voucher_url} onChange={setPlan(i, "voucher_url")} data-testid={`admin-plan-${p.id}-voucher_url`} className={`${inputCls} mt-1.5 text-xs`} />
              </div>
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
              value={(data[key] || []).join(key === "categories" ? ", " : "\n")}
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
