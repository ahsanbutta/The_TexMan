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
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNavigateTab
}) {
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      // If click target is inside ANY notification panel or trigger, do NOT close
      if (e.target.closest('[data-notification-panel]')) {
        return;
      }
      if (e.target.closest('[data-notification-trigger]')) {
        return;
      }
      onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'induction':
      case 'job':
        return <Briefcase className="w-3.5 h-3.5 text-brandGreen" />;
      case 'event':
      case 'webinar':
        return <Calendar className="w-3.5 h-3.5 text-purple-600" />;
      case 'resource':
        return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Info className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'induction':
      case 'job':
        return 'bg-emerald-50 border-emerald-100';
      case 'event':
      case 'webinar':
        return 'bg-purple-50 border-purple-100';
      case 'resource':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-amber-50 border-amber-100';
    }
  };

  const resolveTab = (notif) => {
    const link = String(notif?.link || '').toLowerCase();
    const type = String(notif?.type || '').toLowerCase();
    const title = String(notif?.title || '').toLowerCase();

    if (link.includes('job') || link.includes('induction') || type.includes('job') || type.includes('induction') || title.includes('induction') || title.includes('job')) {
      return 'Jobs';
    }
    if (link.includes('resource') || type.includes('resource') || title.includes('guide') || title.includes('resource') || title.includes('notes') || title.includes('past paper')) {
      return 'Resources';
    }
    if (link.includes('event') || link.includes('webinar') || type.includes('event') || type.includes('webinar') || title.includes('webinar') || title.includes('event')) {
      return 'Events';
    }
    if (link.includes('blog') || type.includes('blog') || title.includes('article') || title.includes('masterclass')) {
      return 'Blog';
    }
    if (link.includes('counsel') || link.includes('guidance') || type.includes('counsel')) {
      return 'Counseling';
    }
    if (link.includes('announcement') || type.includes('announcement')) {
      return 'Announcements';
    }
    if (link.includes('communit') || type.includes('communit')) {
      return 'Community';
    }
    if (link.includes('podcast') || type.includes('podcast')) {
      return 'Podcasts';
    }
    if (link.includes('dashboard')) {
      return 'UserDashboard';
    }
    return null;
  };

  const handleNotificationClick = (notif) => {
    if (!notif) return;
    if (onMarkAsRead) onMarkAsRead(notif.id);

    const targetTab = resolveTab(notif);
    if (targetTab && onNavigateTab) {
      onNavigateTab(targetTab);
    } else if (notif.link && notif.link.startsWith('/') && notif.link !== '#') {
      window.history.pushState(null, '', notif.link);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

  return (
    <>
      {/* Mobile background overlay for easy tap-outside */}
      <div
        className="fixed inset-0 z-[9990] bg-black/20 sm:hidden backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        data-notification-panel
        onMouseDown={(e) => e.stopPropagation()}
        className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 z-[9999] w-auto sm:w-[340px] max-w-[calc(100vw-24px)] bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn text-xs"
        style={{ boxShadow: '0 15px 35px -10px rgba(2, 27, 58, 0.18)' }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-brandGreen flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-navy leading-none">Notifications</h3>
              <span className="text-[10px] text-gray-400 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMarkAllAsRead) onMarkAllAsRead();
                }}
                title="Mark all as read"
                className="px-2 py-1 text-[11px] font-bold text-brandGreen hover:text-brandGreen-dark hover:bg-emerald-50 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Read all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-navy hover:bg-gray-200/50 rounded-lg transition-colors cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[290px] overflow-y-auto divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="py-8 px-4 text-center text-gray-400 space-y-1.5">
              <Bell className="w-7 h-7 text-gray-300 mx-auto stroke-1" />
              <p className="text-xs font-bold text-navy">No new notifications</p>
              <p className="text-[10px] text-gray-400">You're up to date with all inductions & materials.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 transition-colors duration-150 cursor-pointer flex items-start space-x-2.5 group relative hover:bg-gray-50 ${
                  !notif.read ? 'bg-emerald-50/35' : ''
                }`}
              >
                {/* Type Icon */}
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${getIconBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-2 text-left">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className={`text-xs truncate ${!notif.read ? 'font-bold text-navy' : 'font-semibold text-gray-700'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brandGreen shadow-xs shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-400 font-medium">
                    <span>{notif.timestamp}</span>
                    <span className="text-brandGreen hover:text-brandGreen-dark font-bold flex items-center gap-0.5 cursor-pointer">
                      <span>View page</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all rounded shrink-0 cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
