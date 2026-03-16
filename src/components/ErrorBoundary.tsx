import { Component, type ReactNode, type ErrorInfo } from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <RefreshCw size={24} className="text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
            An unexpected error occurred. Please reload the page to continue.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw size={14} />
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
