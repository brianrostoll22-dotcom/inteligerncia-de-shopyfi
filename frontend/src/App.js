import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
    api("/auth/me")
      .then(setUser)
      .catch(() => setUser(false));
  }, []);

  return (
    <AuthCtx.Provider value={{ user: user && user !== false ? user : null, ready: user !== null, setUser }}>
      <BrowserRouter>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </BrowserRouter>
    </AuthCtx.Provider>
  );
}

export default App;
