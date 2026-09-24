import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MousePointerClick, Users, MessageCircle, Activity, ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/site/Shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SECTION_NAMES = {
  top: "Inicio",
  cachorros: "Cachorros",
  camadas: "Camadas",
  entrega: "Entrega",
  seguimiento: "Seguimiento",
  criadero: "El criadero",
  faq: "FAQ",
};

function Kpi({ icon: Icon, label, value, testid }) {
  return (
    <div className="rounded-2xl border border-line bg-sand p-6" data-testid={testid}>
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <Icon className="w-4 h-4 text-copper" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">{label}</span>
      </div>
      <p className="font-serif text-4xl md:text-5xl font-semibold mt-3 leading-none">{value}</p>
    </div>
  );
}

function Bar({ item, max }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-muted-foreground truncate">{item.label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-line/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-copper"
          style={{ width: `${max ? Math.max(6, (item.count / max) * 100) : 0}%` }}
        />
      </div>
      <span className="w-10 text-right text-sm font-semibold tabular-nums">{item.count}</span>
    </div>
  );
}

export default function Stats() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(14);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const res = await fetch(`${API}/analytics/summary?days=${days}`);
        if (res.ok && !stop) setData(await res.json());
      } catch {}
    };
    load();
    const t = setInterval(load, 20000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [days]);

  const maxDaily = data ? Math.max(...data.daily.map((d) => d.views), 1) : 1;
  const maxWa = data && data.wa_by_label.length ? data.wa_by_label[0].count : 0;

  return (
    <div className="min-h-screen bg-bone text-ink font-sans" data-testid="stats-page">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-copper mb-4">
              Panel interno · visitas e interacciones
            </p>
            <h1 className="font-serif text-4xl md:text-6xl leading-none">Estadísticas</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Datos anónimos y agregados, sin cookies ni datos personales. Se actualizan automáticamente.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  data-testid={`stats-range-${d}d`}
                  onClick={() => setDays(d)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    days === d ? "bg-ink text-bone" : "border border-line text-ink/60 hover:border-ink/40"
                  }`}
                >
                  {d} días
                </button>
              ))}
            </div>
            <Link
              to="/"
              data-testid="stats-back-home"
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-copper transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Web
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          <Kpi icon={Eye} label="Visitas a la web" value={data ? data.page_views : "—"} testid="stat-total-views" />
          <Kpi icon={Users} label="Sesiones únicas" value={data ? data.unique_sessions : "—"} testid="stat-unique-sessions" />
          <Kpi icon={MessageCircle} label="Clics a WhatsApp" value={data ? data.whatsapp_clicks : "—"} testid="stat-wa-clicks" />
          <Kpi icon={Activity} label="Rastreos de entrega" value={data ? data.tracking_lookups : "—"} testid="stat-tracking" />
        </div>

        <div className="rounded-3xl border border-line bg-sand p-6 md:p-8 mb-10">
          <h2 className="font-serif text-2xl mb-6">Visitas por día</h2>
          <div className="flex items-end gap-1.5 md:gap-2 h-40" data-testid="stats-chart">
            {(data?.daily || []).map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.views}
                </span>
                <div
                  className="w-full rounded-t-md bg-forest/80 min-h-[4px]"
                  style={{ height: `${(d.views / maxDaily) * 120}px` }}
                />
                <span className="text-[9px] text-muted-foreground rotate-45 origin-top-left whitespace-nowrap">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
            {!data?.daily?.length && (
              <p className="text-sm text-muted-foreground" data-testid="stats-empty">
                Aún no hay datos registrados.
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-line bg-sand p-6 md:p-8" data-testid="top-puppies">
            <h2 className="font-serif text-2xl mb-5">Cachorros más vistos</h2>
            <div className="space-y-3">
              {data?.top_puppies?.length ? (
                data.top_puppies.map((p) => (
                  <Bar key={p.label} item={{ ...p, label: p.label.toUpperCase() }} max={data.top_puppies[0].count} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos aún.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-sand p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-5">Botones de WhatsApp más pulsados</h2>
            <div className="space-y-3">
              {data?.wa_by_label?.length ? (
                data.wa_by_label.map((p) => <Bar key={p.label} item={p} max={maxWa || 1} />)
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos aún.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-sand p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-5">Secciones más leídas</h2>
            <div className="space-y-3">
              {data?.top_sections?.length ? (
                data.top_sections.map((s) => (
                  <Bar key={s.label} item={{ ...s, label: SECTION_NAMES[s.label] || s.label }} max={data.top_sections[0].count} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos aún.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-sand p-6 md:p-8">
            <h2 className="font-serif text-2xl mb-5">¿De dónde llegan?</h2>
            <div className="space-y-3">
              {data?.referrers?.length ? (
                data.referrers.map((r) => (
                  <Bar key={r.label} item={{ ...r, label: r.label.replace(/^https?:\/\//, "").slice(0, 24) }} max={data.referrers[0].count} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
