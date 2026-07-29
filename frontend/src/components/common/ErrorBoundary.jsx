import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("UI ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#D4AF37]/30 shadow-xl space-y-4">
            <div className="text-4xl">💎</div>
            <h2 className="font-heading text-2xl font-bold text-[#0B132B]">
              LJ Luxury Jewellers
            </h2>
            <p className="text-xs text-neutral-600">
              Something unexpected happened while rendering the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#D4AF37] text-white font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-[#b8960f] transition-all"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
