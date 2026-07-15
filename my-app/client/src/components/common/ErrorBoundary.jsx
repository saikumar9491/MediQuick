import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50/50 p-6 font-sans">
          <div className="bg-white border border-rose-100 p-8 rounded-2xl shadow-xl max-w-xl text-center space-y-4">
            <div className="h-14 w-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <h1 className="text-sm font-black text-rose-700 uppercase tracking-widest">Dashboard Render Failure</h1>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              React failed to render this dashboard panel. The stack error detail is shown below.
            </p>
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-[10px] text-left font-mono text-rose-600 overflow-auto max-h-48 whitespace-pre-wrap">
              {this.state.error?.toString()}
              {"\n\n"}
              {this.state.error?.stack}
            </div>
            <div className="flex gap-3.5">
              <button 
                onClick={() => window.location.reload()} 
                className="flex-1 py-2.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] shadow-sm transition-colors"
              >
                Reload Client
              </button>
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }} 
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors"
              >
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
