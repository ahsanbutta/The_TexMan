import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#021B3A', color: '#ff6b6b', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#fff', marginBottom: 16 }}>Application Notice</h2>
          <p style={{ color: '#ccc' }}>An unexpected error occurred during rendering:</p>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12, background: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 8 }}>
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/';
            }}
            style={{ marginTop: 24, padding: '12px 24px', background: '#00C853', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reset & Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
