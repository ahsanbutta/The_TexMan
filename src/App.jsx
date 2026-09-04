import { useState, useEffect, useRef } from 'react';
import Home from './pages/ios/Home/Home';
import FloatingSocials from './components/FloatingSocials';
import { getCurrentSession, getInitialSessionSync, onAuthChange } from './services/authService';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(() => getInitialSessionSync());
  const [sessionLoading, setSessionLoading] = useState(() => !getInitialSessionSync());

  // Direct DOM refs for ultra high performance cursor tracker without React re-render churn
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHidden = useRef(true);

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

  // High performance RAF cursor physics without React state updates
  useEffect(() => {
    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (isHidden.current) {
        isHidden.current = false;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseEnter = () => {
      isHidden.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    const onMouseLeave = () => {
      isHidden.current = true;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const onMouseDown = () => {
      if (ringRef.current) {
        ringRef.current.classList.add('scale-75', 'border-solid', 'border-brandGreen-dark', 'bg-brandGreen/10');
      }
    };

    const onMouseUp = () => {
      if (ringRef.current) {
        ringRef.current.classList.remove('scale-75', 'border-solid', 'border-brandGreen-dark', 'bg-brandGreen/10');
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        (target.classList && target.classList.contains('cursor-pointer'));

      if (dotRef.current && ringRef.current) {
        if (isInteractive) {
          dotRef.current.classList.add('scale-150', 'bg-emerald-400');
          ringRef.current.classList.add('scale-150', 'border-solid', 'border-emerald-400', 'bg-brandGreen/5');
        } else {
          dotRef.current.classList.remove('scale-150', 'bg-emerald-400');
          ringRef.current.classList.remove('scale-150', 'border-solid', 'border-emerald-400', 'bg-brandGreen/5');
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    let animationFrameId;
    const updateTrail = () => {
      if (!isHidden.current && ringRef.current) {
        const dx = mousePos.current.x - ringPos.current.x;
        const dy = mousePos.current.y - ringPos.current.y;
        ringPos.current.x += dx * 0.18;
        ringPos.current.y += dy * 0.18;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <>
      {/* Custom Cursor Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-50 w-2 h-2 bg-brandGreen rounded-full shadow-[0_0_8px_rgba(0,200,83,0.8)] transition-transform duration-75 ease-out hidden md:block opacity-0 top-0 left-0"
        style={{ willChange: 'transform' }}
      />

      {/* Custom Cursor Ring Glow Tracker */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-50 w-8 h-8 border border-dashed border-brandGreen/60 rounded-full hidden md:block transition-[transform,opacity,border-color,background-color] duration-150 ease-out opacity-0 top-0 left-0"
        style={{ willChange: 'transform' }}
      />
      
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
