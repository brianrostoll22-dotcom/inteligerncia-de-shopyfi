export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function formatDetail(d) {
  if (d == null) return "Algo salió mal. Inténtalo de nuevo.";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(". ");
  if (d.msg) return d.msg;
  return String(d);
}

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(formatDetail(data.detail));
  return data;
}
