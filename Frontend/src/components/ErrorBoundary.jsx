import React, { Component } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Customize fallback UI
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
          <div className="text-red-500 mb-4">
            <AlertOctagon size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Something went wrong</h2>
          <p className="text-text-light mb-6 text-center max-w-md">
            We've encountered an unexpected error. This has been logged and we're working on it.
          </p>
          
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg w-full max-w-xl overflow-auto text-sm">
              <p className="font-semibold mb-2">{this.state.error.toString()}</p>
              <pre className="text-xs overflow-auto max-h-32">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          )}
          
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Reload Page
            </button>
            <Link to="/" className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary-50">
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 