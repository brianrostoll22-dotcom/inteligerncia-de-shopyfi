import { useEffect, useState } from "react";
import { Loader2, Save, Store, UserRound, SlidersHorizontal } from "lucide-react";
import Shell from "@/components/Shell";
import { api, formatDetail } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const inputCls = "w-full rounded-xl bg-card border border-edge px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/60";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        avatar_url: user.avatar_url || "",
        store_name: user.store?.name || "",
        store_email: user.store?.email || "",
        prefs: {
          notify_email: user.prefs?.notify_email ?? true,
          notify_sales: user.prefs?.notify_sales ?? true,
          language: user.prefs?.language || "es",
        },
      });
    }
  }, [user]);

  if (!form) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setPref = (k, v) => setForm({ ...form, prefs: { ...form.prefs, [k]: v } });

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const updated = await api("/me/profile", { method: "PUT", body: form });
      setUser(updated);
      setMsg("Perfil guardado correctamente.");
    } catch (e) {
      setMsg(formatDetail(e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal mb-2">Perfil de usuario</p>
      <h1 className="font-display text-2xl md:text-3xl" data-testid="profile-title">Tu cuenta y tu tienda</h1>
      <p className="text-mist text-sm mt-3">Configura tus datos personales, los de tu tienda y tus preferencias.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-9">
        <div className="rounded-2xl border border-edge bg-panel p-7" data-testid="profile-personal-card">
          <div className="flex items-center gap-3 mb-6">
            <UserRound className="w-5 h-5 text-teal" />
            <h2 className="font-display text-base">Datos personales</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Foto de perfil" data-testid="profile-avatar-preview" className="w-16 h-16 rounded-full object-cover border-2 border-teal/50" />
            ) : (
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-card border-2 border-edge text-teal text-xl font-semibold" data-testid="profile-avatar-preview">
                {(form.first_name || user.email)[0].toUpperCase()}
              </span>
            )}
            <div className="flex-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Foto de perfil (URL)</label>
              <input value={form.avatar_url} onChange={set("avatar_url")} placeholder="https://…/tu-foto.jpg" data-testid="profile-avatar-url" className={`${inputCls} mt-2`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Nombre</label>
              <input value={form.first_name} onChange={set("first_name")} data-testid="profile-first-name" className={`${inputCls} mt-2`} />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Apellidos</label>
              <input value={form.last_name} onChange={set("last_name")} data-testid="profile-last-name" className={`${inputCls} mt-2`} />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Email de la cuenta</label>
            <input value={user.email} disabled data-testid="profile-email" className={`${inputCls} mt-2 opacity-50 cursor-not-allowed`} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-edge bg-panel p-7" data-testid="profile-store-card">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-5 h-5 text-teal" />
              <h2 className="font-display text-base">Datos de tu tienda</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Nombre de la tienda</label>
                <input value={form.store_name} onChange={set("store_name")} data-testid="profile-store-name" className={`${inputCls} mt-2`} />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">Email de la tienda</label>
                <input value={form.store_email} onChange={set("store_email")} data-testid="profile-store-email" className={`${inputCls} mt-2`} />
              </div>
            </div>
            {user.store?.connected && (
              <p className="mt-4 text-xs text-teal flex items-center gap-2" data-testid="profile-store-connected">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                Shopify vinculado ({user.store.identifier})
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-edge bg-panel p-7" data-testid="profile-prefs-card">
            <div className="flex items-center gap-3 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-teal" />
              <h2 className="font-display text-base">Preferencias</h2>
            </div>
            <div className="space-y-4">
              {[
                ["notify_email", "Recibir novedades por email"],
                ["notify_sales", "Avisos de ventas de la IA"],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center justify-between gap-4 cursor-pointer" data-testid={`profile-pref-${k}`}>
                  <span className="text-sm text-mist">{label}</span>
                  <button
                    type="button"
                    onClick={() => setPref(k, !form.prefs[k])}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.prefs[k] ? "bg-teal" : "bg-edge"}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.prefs[k] ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={save}
              disabled={saving}
              data-testid="profile-save"
              className="inline-flex items-center gap-2 rounded-xl bg-teal text-night px-7 py-3.5 font-semibold hover:bg-tealdeep hover:text-white transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar cambios
            </button>
            {msg && (
              <p className="text-sm text-teal" data-testid="profile-msg">
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
