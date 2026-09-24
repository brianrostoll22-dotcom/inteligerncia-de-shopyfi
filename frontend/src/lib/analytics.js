const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const sid = () => {
  let s = sessionStorage.getItem("pa_sid");
  if (!s) {
    s = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now();
    sessionStorage.setItem("pa_sid", s);
  }
  return s;
};

export const track = (event, label = "") => {
  try {
    const payload = JSON.stringify({
      event,
      label,
      path: window.location.pathname,
      session: sid(),
      referrer: document.referrer || "",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API}/analytics/collect`, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(`${API}/analytics/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {}
};
