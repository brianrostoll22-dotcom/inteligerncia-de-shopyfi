import { useEffect, useState } from "react";
import { Check, Clock, CreditCard, Loader2, Sparkles } from "lucide-react";
import Shell from "@/components/Shell";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const fmt = new Intl.NumberFormat("es-ES");

export default function Plans() {
  const { user, setUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [saving, setSaving] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    api("/plans")
      .then((d) => {
        setPlans(d.plans);
        setDisclaimer(d.disclaimer);
      })
      .catch(() => {});
  }, []);

  const choose = async (plan_id) => {
    setSaving(plan_id);
    setOk("");
    try {
      await api("/me/plan", { method: "PUT", body: { plan_id } });
      const me = await api("/auth/me");
      setUser(me);
      setOk(`Plan activado en modo simulación. Ya puedes volver al panel.`);
    } catch (e) {
      setOk(e.message);
    } finally {
      setSaving("");
    }
  };

  return (
    <Shell>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal mb-2">Depósitos y pagos</p>
      <h1 className="font-display text-2xl md:text-3xl" data-testid="plans-title">Elige el plan de gestión con IA</h1>
      <p className="text-mist text-sm mt-3 max-w-2xl leading-relaxed">
        El plan define la potencia con la que la IA crea y gestiona tu tienda. Puedes cambiarlo
        cuando quieras.
      </p>

      <div className="mt-6 rounded-2xl border border-lav/30 bg-lav/10 p-5 flex items-start gap-3" data-testid="payment-methods-notice">
        <Clock className="w-5 h-5 text-lav shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Métodos de pago: próximamente</p>
          <p className="text-mist text-xs mt-1">
            Aquí se activarán los métodos de depósito disponibles. De momento, la selección de plan
            funciona en modo simulación.
          </p>
        </div>
      </div>

      {ok && (
        <p className="mt-5 rounded-xl border border-teal/40 bg-teal/10 text-teal text-sm px-5 py-3.5" data-testid="plan-success">
          {ok}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {plans.map((p) => {
          const active = user?.plan === p.id;
          return (
            <div
              key={p.id}
              data-testid={`plan-card-${p.id}`}
              className={`relative rounded-2xl border p-7 flex flex-col ${active ? "border-teal bg-card glow" : "border-edge bg-panel"}`}
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
              <button
                onClick={() => choose(p.id)}
                disabled={saving === p.id}
                data-testid={`plan-select-${p.id}`}
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "border border-teal/40 text-teal bg-teal/10"
                    : "bg-teal text-night hover:bg-tealdeep hover:text-white"
                }`}
              >
                {saving === p.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : active ? (
                  <>
                    <Sparkles className="w-4 h-4" /> Plan activo
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> Seleccionar plan
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-[11px] text-mist/60">{disclaimer}</p>
    </Shell>
  );
}
