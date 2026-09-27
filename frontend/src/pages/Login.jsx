import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Loader2 } from "lucide-react";
import { api, formatDetail } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Login({ mode = "login" }) {
  const isRegister = mode === "register";
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const googleLogin = () => {
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(window.location.origin + "/app")}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? { email: form.email, password: form.password, first_name: form.first_name, last_name: form.last_name }
        : { email: form.email, password: form.password };
      const user = await api(path, { method: "POST", body });
      setUser(user);
      navigate(user.role === "admin" ? "/admin" : "/app");
    } catch (err) {
      setError(formatDetail(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-night grid-bg flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal text-night">
            <Zap strokeWidth={2.5} className="w-5 h-5" />
          </span>
          <span className="font-display text-lg">NovaIA</span>
        </Link>

        <div className="rounded-2xl border border-edge bg-panel p-8 glow">
          <h1 className="font-display text-2xl" data-testid="auth-title">
            {isRegister ? "Crea tu cuenta" : "Bienvenido de nuevo"}
          </h1>
          <p className="text-mist text-sm mt-2">
            {isRegister
              ? "En un minuto tendrás tu panel con la IA trabajando en tu tienda."
              : "Entra para ver qué está haciendo la IA con tu tienda ahora mismo."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Nombre"
                  data-testid="register-first-name"
                  value={form.first_name}
                  onChange={set("first_name")}
                  className="rounded-xl bg-card border border-edge px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/60"
                />
                <input
                  required
                  placeholder="Apellidos"
                  data-testid="register-last-name"
                  value={form.last_name}
                  onChange={set("last_name")}
                  className="rounded-xl bg-card border border-edge px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/60"
                />
              </div>
            )}
            <input
              required
              type="email"
              placeholder="Tu email"
              data-testid={isRegister ? "register-email" : "login-email"}
              value={form.email}
              onChange={set("email")}
              className="w-full rounded-xl bg-card border border-edge px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/60"
            />
            <input
              required
              type="password"
              placeholder={isRegister ? "Crea una contraseña (mín. 6)" : "Tu contraseña"}
              data-testid={isRegister ? "register-password" : "login-password"}
              value={form.password}
              onChange={set("password")}
              className="w-full rounded-xl bg-card border border-edge px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/60"
            />
            {error && (
              <p className="text-danger text-sm" data-testid="auth-error">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              data-testid={isRegister ? "register-submit" : "login-submit"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal text-night px-6 py-3.5 font-semibold hover:bg-tealdeep hover:text-white transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isRegister ? "Crear cuenta y entrar" : "Entrar"}
            </button>

            <div className="flex items-center gap-3 pt-1">
              <span className="h-px flex-1 bg-edge" />
              <span className="text-[10px] text-mist uppercase tracking-[0.25em]">o</span>
              <span className="h-px flex-1 bg-edge" />
            </div>

            <button
              type="button"
              onClick={googleLogin}
              data-testid="google-auth-btn"
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-edge bg-card px-6 py-3 text-sm font-semibold hover:border-mist transition-colors"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#4285F4] font-bold text-xs">G</span>
              {isRegister ? "Registrarse con Google" : "Continuar con Google"}
            </button>
          </form>

          <p className="mt-6 text-sm text-mist text-center">
            {isRegister ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-teal font-medium hover:underline" data-testid="auth-to-login">
                  Inicia sesión
                </Link>
              </>
            ) : (
              <>
                ¿Primera vez?{" "}
                <Link to="/registro" className="text-teal font-medium hover:underline" data-testid="auth-to-register">
                  Crea tu cuenta gratis
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
