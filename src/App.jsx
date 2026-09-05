import { useState, useEffect } from 'react';
import Home from './pages/ios/Home/Home';
import FloatingSocials from './components/FloatingSocials';
import { getCurrentSession, getInitialSessionSync, onAuthChange } from './services/authService';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(() => getInitialSessionSync());
  const [sessionLoading, setSessionLoading] = useState(() => !getInitialSessionSync());


  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Intercept all global window.alert calls to convert them to custom toasts
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message) => {
      if (!message) return;
      let type = 'success';
      const lower = message.toString().toLowerCase();
      if (lower.includes('error') || lower.includes('denied') || lower.includes('failed') || lower.includes('invalid') || lower.includes('not have') || lower.includes('denies')) {
        type = 'error';
      } else if (lower.includes('warning') || lower.includes('attention') || lower.includes('alert') || lower.includes('limit')) {
        type = 'warning';
      } else if (lower.includes('soon') || lower.includes('development') || lower.includes('redirecting') || lower.includes('composer') || lower.includes('dialing') || lower.includes('starting') || lower.includes('opening')) {
        type = 'info';
      }
      addToast(message.toString(), type);
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  useEffect(() => {
    // Get current session
    getCurrentSession().then(session => {
      setSession(session);
      setSessionLoading(false);
    });

    // Listen for auth state changes
    const subscription = onAuthChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  return (
    <>
      
      {/* Global Toast Notifications Overlay */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col space-y-3 pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-sm w-full">
        {toasts.map(toast => {
          let borderClass = 'border-brandGreen/30 shadow-[0_0_15px_rgba(0,200,83,0.12)] text-emerald-400';
          let icon = <CheckCircle className="w-5 h-5 text-brandGreen flex-shrink-0" />;
          
          if (toast.type === 'error') {
            borderClass = 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.12)] text-red-400';
            icon = <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
          } else if (toast.type === 'warning') {
            borderClass = 'border-[#F3C132]/30 shadow-[0_0_15px_rgba(243,193,50,0.12)] text-[#F3C132]';
            icon = <AlertTriangle className="w-5 h-5 text-[#F3C132] flex-shrink-0" />;
          } else if (toast.type === 'info') {
            borderClass = 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.12)] text-blue-400';
            icon = <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
          }
          
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl border bg-[#011126]/95 backdrop-blur-md animate-toastSlideIn transition-all ${borderClass}`}
            >
              {icon}
              <div className="flex-1 text-xs font-semibold leading-relaxed whitespace-pre-line text-white/95">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-white/5 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Sticky Social Media Widget */}
      <FloatingSocials />

      <Home session={session} sessionLoading={sessionLoading} />
    </>
  );
}
