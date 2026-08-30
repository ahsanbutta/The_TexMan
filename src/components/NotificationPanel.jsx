import { useEffect, useRef } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Briefcase,
  Calendar,
  BookOpen,
  Info,
  ChevronRight
} from 'lucide-react';

export default function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNavigateTab
}) {
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        // Only close if not clicking the bell trigger
        const trigger = e.target.closest('[data-notification-trigger]');
        if (!trigger) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'induction':
      case 'job':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'event':
      case 'webinar':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'resource':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleNotificationClick = (notif) => {
    onMarkAsRead(notif.id);
    if (notif.link && onNavigateTab) {
      if (notif.link.includes('job') || notif.type === 'induction') {
        onNavigateTab('Jobs');
      } else if (notif.link.includes('event') || notif.type === 'event') {
        onNavigateTab('Events');
      } else if (notif.link.includes('resource') || notif.type === 'resource') {
        onNavigateTab('Resources');
      }
    }
    onClose();
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-16 right-4 sm:right-12 z-[999] w-[92vw] sm:w-96 max-w-md bg-[#02152c]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn"
      style={{ boxShadow: '0 20px 40px -15px rgba(0, 200, 83, 0.2)' }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-brandGreen/10 border border-brandGreen/20 text-brandGreen">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">Notifications</h3>
            <span className="text-[11px] text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              title="Mark all as read"
              className="p-1.5 text-xs text-gray-300 hover:text-brandGreen hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-1"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline font-medium">Read all</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5">
        {notifications.length === 0 ? (
          <div className="py-12 px-6 text-center text-gray-400 space-y-2">
            <Bell className="w-8 h-8 text-gray-600 mx-auto stroke-1" />
            <p className="text-xs font-medium">No new notifications</p>
            <p className="text-[11px] text-gray-500">You're up to date with all inductions & materials.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 transition-all duration-200 cursor-pointer flex items-start space-x-3.5 group relative hover:bg-white/5 ${
                !notif.read ? 'bg-brandGreen/[0.04]' : ''
              }`}
            >
              {/* Type Icon */}
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5 group-hover:border-brandGreen/40 transition-colors">
                {getIcon(notif.type)}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className={`text-xs font-bold truncate ${!notif.read ? 'text-white' : 'text-gray-300'}`}>
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-brandGreen shadow-[0_0_8px_rgba(0,200,83,0.8)] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                  {notif.message}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-gray-500 font-medium">
                  <span>{notif.timestamp}</span>
                  <span className="text-brandGreen/80 group-hover:text-brandGreen flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notif.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all rounded"
                title="Delete notification"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-white/[0.02] border-t border-white/10 text-center">
        <span className="text-[10px] text-gray-400 font-medium">
          Official The TaxMan's Capital Notification Center
        </span>
      </div>
    </div>
  );
}
