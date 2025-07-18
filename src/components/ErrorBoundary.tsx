import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-light-bg dark:bg-dark-bg-secondary rounded-2xl p-8 shadow-lg border border-light-border dark:border-dark-border">
              <AlertTriangle className="w-16 h-16 text-error-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
                Something went wrong
              </h1>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Page</span>
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-error-600 dark:text-error-400 font-medium">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-4 bg-error-50 dark:bg-error-900/20 rounded-lg text-xs text-error-800 dark:text-error-200 overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;