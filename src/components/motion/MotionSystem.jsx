import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, FileQuestion, Inbox } from 'lucide-react';

/**
 * AnimatedSection
 * Reveals children smoothly when scrolling into viewport with staggered delay.
 */
export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
  direction = 'up' // 'up' | 'down' | 'left' | 'right' | 'fade'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return 'none';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

/**
 * AnimatedCard
 * Provides subtle hover elevation (translateY -4px), soft multi-layer shadow, and border transitions.
 */
export function AnimatedCard({
  children,
  className = '',
  onClick,
  hoverable = true,
  glow = false
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-md transition-all duration-300 ${
        hoverable
          ? 'hover:-translate-y-1.5 hover:border-brandGreen/40 hover:shadow-2xl hover:shadow-brandGreen/10 cursor-pointer'
          : ''
      } ${
        glow
          ? 'border-brandGreen/30 shadow-lg shadow-brandGreen/10'
          : 'shadow-xl shadow-black/20'
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * AnimatedCounter
 * Animates a numerical statistic from 0 to target value when entering viewport.
 */
export function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  duration = 1800,
  className = ''
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.unobserve(entry.target);

          const startTime = performance.now();
          const numericTarget = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.]/g, '')) || 0 : target;

          const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOutProgress * numericTarget);

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(numericTarget);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref} className={`font-black font-['Outfit',sans-serif] ${className}`}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * PageTransition
 * Wraps top-level page views with a smooth, fast fade & lift animation (~250ms).
 */
export function PageTransition({ children, className = '' }) {
  return (
    <div className={`animate-fadeIn space-y-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * SkeletonLoader
 * Shimmering loading placeholder for cards, lists, and metrics.
 */
export function SkeletonLoader({
  count = 1,
  type = 'card', // 'card' | 'line' | 'avatar' | 'metric'
  className = ''
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        if (type === 'metric') {
          return (
            <div key={i} className="p-5 rounded-3xl bg-white/5 border border-white/10 animate-pulse space-y-3">
              <div className="w-20 h-3 bg-white/10 rounded-full" />
              <div className="w-32 h-8 bg-white/15 rounded-xl" />
              <div className="w-24 h-2.5 bg-white/10 rounded-full" />
            </div>
          );
        }
        if (type === 'line') {
          return (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="w-full h-3 bg-white/10 rounded-full" />
              <div className="w-4/5 h-3 bg-white/10 rounded-full" />
            </div>
          );
        }
        if (type === 'avatar') {
          return (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="w-32 h-3 bg-white/10 rounded-full" />
                <div className="w-20 h-2.5 bg-white/5 rounded-full" />
              </div>
            </div>
          );
        }
        return (
          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-32 h-4 bg-white/15 rounded-lg" />
              <div className="w-16 h-4 bg-white/10 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-white/10 rounded-full" />
              <div className="w-5/6 h-3 bg-white/10 rounded-full" />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <div className="w-20 h-6 bg-white/10 rounded-lg" />
              <div className="w-20 h-6 bg-white/10 rounded-lg" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * EmptyState
 * Modern, branded empty state for lists, bookmarks, or filtered results.
 */
export function EmptyState({
  title = 'No Records Found',
  description = 'There are currently no items matching your criteria.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className = ''
}) {
  return (
    <div className={`p-8 sm:p-12 rounded-3xl bg-[#021B3A]/80 border border-white/10 text-center space-y-4 shadow-xl ${className}`}>
      <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brandGreen shadow-md">
        <Icon className="w-7 h-7 text-brandGreen" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-base sm:text-lg font-black text-white font-['Outfit',sans-serif]">
          {title}
        </h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          type="button"
          className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-black shadow-md shadow-brandGreen/20 hover:scale-105 transition-all cursor-pointer inline-flex items-center space-x-1.5"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export { default as AntigravityCanvas } from './AntigravityCanvas';

