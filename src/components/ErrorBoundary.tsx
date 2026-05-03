import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              An unexpected error occurred. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium">
                  Error Details (Development)
                </summary>
                <pre className="text-xs mt-2 p-2 bg-secondary rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;