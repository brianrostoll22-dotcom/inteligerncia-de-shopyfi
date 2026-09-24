import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Stats from "@/pages/Stats";

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
        <div className="min-h-screen flex items-center justify-center bg-bone text-ink font-sans p-8 text-center">
          <p className="font-serif text-3xl">Algo salió mal. Recarga la página, por favor.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/estadisticas" element={<Stats />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
