import { Component } from "react";

// Without this, any uncaught error anywhere in the tree (a bad prop, a
// third-party library throwing, a WebGL context failing) unmounts the
// entire app and leaves a blank white page with nothing telling the
// visitor what happened. This is the last line of defense, not the fix
// for any specific bug — individual components should still handle their
// own known failure modes (see PortraitLiquid/HeroDotWave's WebGL fallback).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error, showing fallback UI instead of a blank page:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "24px",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <p style={{ fontSize: "18px" }}>Something went wrong loading this page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid currentColor",
              background: "transparent",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
