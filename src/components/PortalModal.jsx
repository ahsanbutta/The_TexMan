import { createPortal } from 'react-dom';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

/**
 * Reusable Portal Modal Component.
 * Renders modal overlays directly into `document.body` via React Portals to escape
 * any parent CSS `transform` / `will-change` ancestor containers, ensuring the modal
 * appears centered in the active screen viewport instantly upon click without requiring scrolling.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback function triggered on backdrop click
 * @param {React.ReactNode} props.children - Modal content nodes
 * @param {string} [props.maxWidth='max-w-2xl'] - Tailwind max-width class for modal card
 * @param {string} [props.className=''] - Additional custom classes for modal card
 * @param {string} [props.backdropClassName='bg-black/60 backdrop-blur-sm'] - Backdrop overlay classes
 */
export default function PortalModal({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-2xl',
  className = '',
  backdropClassName = 'bg-black/60 backdrop-blur-sm'
}) {
  useBodyScrollLock(isOpen);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 ${backdropClassName} animate-fadeIn`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl overflow-hidden ${maxWidth} w-full max-h-[85vh] flex flex-col shadow-2xl relative z-10 border border-gray-100 animate-scaleIn ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
