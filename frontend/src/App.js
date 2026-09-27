import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { AuthCtx } from "@/lib/auth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Plans from "@/pages/Plans";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("Render error:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-night text-white p-8 text-center">
          <p className="font-display text-xl">Algo salió mal. Recarga la página.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function Splash() {
  return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-teal border-t-transparent animate-spin" />
    </div>
  );
}

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = React.useContext(AuthCtx);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    const sid = decodeURIComponent((location.hash.split("session_id=")[1] || "").split("&")[0] || "");
    if (!sid) {
      navigate("/login", { replace: true });
      return;
    }
    api("/auth/google", { method: "POST", body: { session_id: sid } })
      .then((u) => {
        setUser(u);
        navigate("/app", { replace: true });
      })
      .catch(() => navigate("/login", { replace: true }));
  }, []);

  return <Splash />;
}

function AppRoutes() {
  const location = useLocation();
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  if (location.hash?.includes("session_id=")) return <AuthCallback />;
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
      <Route path="/login" element={<PublicOnly><Login mode="login" /></PublicOnly>} />
      <Route path="/registro" element={<PublicOnly><Login mode="register" /></PublicOnly>} />
      <Route path="/app" element={<Protected><Dashboard /></Protected>} />
      <Route path="/app/planes" element={<Protected><Plans /></Protected>} />
      <Route path="/app/perfil" element={<Protected><Profile /></Protected>} />
      <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Protected({ admin = false, children }) {
  const { user, ready } = React.useContext(AuthCtx);
  if (!ready) return <Splash />;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/app" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, ready } = React.useContext(AuthCtx);
  if (!ready) return <Splash />;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/app"} replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    if (window.location.hash?.includes("session_id=")) return;
    api("/auth/me")
      .then(setUser)
      .catch(() => setUser(false));
  }, []);

  return (
    <AuthCtx.Provider value={{ user: user && user !== false ? user : null, ready: user !== null, setUser }}>
      <BrowserRouter>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthCtx.Provider>
  );
}

export default App;
