import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 px-4">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-800 mb-2">هەڵەیەک ڕوویدا</h1>
            <p className="text-slate-500 mb-8">
              ببورە، هەڵەیەکی چاوەڕوان نەکراو ڕوویدا. تکایە دووبارە هەوڵ بدەوە.
            </p>

            {/* Error details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-sm text-red-600 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRefresh}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#007AFF] hover:bg-[#0066dd] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#007AFF]/25"
              >
                <RefreshCw className="w-5 h-5" />
                نوێکردنەوە
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                <Home className="w-5 h-5" />
                گەڕانەوە بۆ سەرەتا
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
