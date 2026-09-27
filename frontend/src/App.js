function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF9F5",
        color: "#1C1D1A",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div>
        <div
          style={{
            width: 56,
            height: 56,
            margin: "0 auto 24px",
            borderRadius: 16,
            background: "#1C1D1A",
            color: "#C87D20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia, serif",
            fontSize: 22,
          }}
        >
          ✳
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Nuevo proyecto en camino</h1>
        <p style={{ color: "#6B6D66", marginTop: 12 }}>
          Cuéntame qué web quieres crear y empezamos.
        </p>
      </div>
    </div>
  );
}

export default App;
