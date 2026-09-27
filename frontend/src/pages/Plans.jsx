import { useEffect, useState } from "react";
import { Check, CreditCard, ExternalLink, Loader2, Mail, Copy, TicketCheck, Clock } from "lucide-react";
import Shell from "@/components/Shell";
import { api, formatDetail } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const fmt = new Intl.NumberFormat("es-ES");

const STEPS = [
  { icon: CreditCard, title: "1. Compra el voucher", text: "Pulsa el botón de tu plan, compra el voucher Azteco en G2A y completa el pago." },
  { icon: Mail, title: "2. Revisa tu correo", text: "Nada más pagar, G2A te enviará un email de confirmación de la compra." },
  { icon: Copy, title: "3. Copia el enlace de canje", text: "Abre el correo, pulsa en «Obtener producto» y copia el enlace de canje que aparece." },
  { icon: TicketCheck, title: "4. Canjea aquí", text: "Pega ese enlace en el campo de canje de tu plan y pulsa Canjear. Tu cuenta se activa al validarlo." },
];

export default function Plans() {
  const { user, setUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [inputs, setInputs] = useState({});
  const [saving, setSaving] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [d, v] = await Promise.all([api("/plans"), api("/me/vouchers")]);
    setPlans(d.plans);
    setVouchers(v.vouchers);
  };

  useEffect(() => {
    load().catch((e) => setError(formatDetail(e.message)));
  }, []);

  const redeem = async (plan_id) => {
    const url = (inputs[plan_id] || "").trim();
    setSaving(plan_id);
    setMsg("");
    setError("");
    try {
      await api("/me/voucher", { method: "POST", body: { plan_id, url } });
      setInputs({ ...inputs, [plan_id]: "" });
      setMsg("Voucher enviado correctamente. Lo estamos verificando.");
      await load();
    } catch (e) {
      setError(formatDetail(e.message));
    } finally {
      setSaving("");
    }
  };

  const statusChip = (s) =>
    s === "validado"
      ? "border-teal/40 bg-teal/10 text-teal"
      : s === "rechazado"
      ? "border-danger/40 bg-danger/10 text-danger"
      : "border-lav/40 bg-lav/10 text-lav";

  return (
    <Shell>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal mb-2">Depósitos y pagos</p>
      <h1 className="font-display text-2xl md:text-3xl" data-testid="plans-title">Elige tu plan y canjea tu voucher</h1>
      <p className="text-mist text-sm mt-3 max-w-2xl leading-relaxed">
        El plan define la potencia con la que la IA gestiona tu tienda. Se activa con un voucher
        Azteco que compras en G2A. Puedes cambiar de plan cuando quieras.
      </p>

      <div className="mt-8 rounded-2xl border border-edge bg-panel p-6 md:p-8" data-testid="howto-redeem">
        <h2 className="font-display text-base mb-6">Cómo canjear tu voucher, paso a paso</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-xl border border-edge bg-card p-5">
              <s.icon className="w-5 h-5 text-teal" />
              <h3 className="font-semibold text-sm mt-3">{s.title}</h3>
              <p className="text-mist text-xs mt-2 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {msg && (
        <p className="mt-6 rounded-xl border border-teal/40 bg-teal/10 text-teal text-sm px-5 py-3.5" data-testid="redeem-success">
          {msg}
        </p>
      )}
      {error && (
        <p className="mt-6 rounded-xl border border-danger/40 bg-danger/10 text-danger text-sm px-5 py-3.5" data-testid="redeem-error">
          {error}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {plans.map((p) => {
          const active = user?.plan === p.id;
          return (
            <div
              key={p.id}
              data-testid={`plan-card-${p.id}`}
              className={`relative rounded-2xl border p-7 flex flex-col ${active ? "border-teal bg-card" : "border-edge bg-panel"}`}
            >
              {active && (
                <span className="absolute -top-3 left-6 rounded-full bg-teal text-night text-[11px] font-semibold px-3 py-1">
                  Tu plan actual
                </span>
              )}
              {p.popular && !active && (
                <span className="absolute -top-3 left-6 rounded-full bg-lav text-night text-[11px] font-semibold px-3 py-1">
                  Más elegido
                </span>
              )}
              <h2 className="font-display text-xl">{p.name}</h2>
              <p className="mt-4 font-display text-4xl">
                {fmt.format(p.price)} <span className="text-base text-mist font-sans">€</span>
              </p>
              <p className="text-sm text-mist mt-2">
                Ganancias estimadas:{" "}
                <span className="text-teal font-semibold">
                  {fmt.format(p.profit_min)}–{fmt.format(p.profit_max)} €/mes
                </span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-mist flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {p.vouchers_needed > 1 && (
                <p className="mt-5 rounded-lg border border-lav/30 bg-lav/10 text-lav text-xs px-4 py-2.5" data-testid={`plan-needs-2-${p.id}`}>
                  Este plan se activa adquiriendo <strong>2 vouchers de 200 €</strong> (puedes canjearlos juntos o de uno en uno).
                </p>
              )}

              <a
                href={p.voucher_url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`plan-buy-${p.id}`}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-teal text-night px-6 py-3 text-sm font-semibold hover:bg-tealdeep hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Comprar voucher {p.vouchers_needed > 1 ? `de 200 € (×${p.vouchers_needed})` : `de ${p.price} €`}
              </a>

              <label className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
                ¿Ya tienes el voucher? Canjéalo aquí
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  value={inputs[p.id] || ""}
                  onChange={(e) => setInputs({ ...inputs, [p.id]: e.target.value })}
                  placeholder="Pega el enlace de canje de Azteco"
                  data-testid={`plan-voucher-input-${p.id}`}
                  className="flex-1 min-w-0 rounded-xl bg-card border border-edge px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal/60"
                />
                <button
                  onClick={() => redeem(p.id)}
                  disabled={saving === p.id}
                  data-testid={`plan-redeem-${p.id}`}
                  className="shrink-0 rounded-xl bg-lav text-night px-4 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Canjear"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {vouchers.length > 0 && (
        <div className="mt-10 rounded-2xl border border-edge bg-panel p-6 md:p-8" data-testid="my-vouchers">
          <h2 className="font-display text-base mb-5">Tus vouchers enviados</h2>
          <div className="space-y-3">
            {vouchers.map((v) => (
              <div key={v._id} className="rounded-xl border border-edge bg-card px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 justify-between" data-testid={`my-voucher-${v._id}`}>
                <div className="min-w-0">
                  <p className="text-xs text-mist font-semibold">Plan {plans.find((p) => p.id === v.plan_id)?.name || v.plan_id}</p>
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-xs text-mist/70 font-mono truncate block max-w-md hover:text-teal">
                    {v.url.slice(0, 70)}{v.url.length > 70 ? "…" : ""}
                  </a>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-mist/50 font-mono flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(v.created_at).toLocaleDateString("es-ES")}
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusChip(v.status)}`} data-testid={`voucher-status-${v.status}`}>
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Shell>
  );
}
