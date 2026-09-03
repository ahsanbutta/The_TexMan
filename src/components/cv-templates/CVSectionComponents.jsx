import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

/**
 * Reusable Profile Photo Component
 */
export function CVProfilePhoto({
  src,
  alt = 'Profile Photo',
  size = 'w-28 h-28',
  shape = 'rounded-full',
  border = 'border-4 border-white/90 shadow-lg',
  fallbackBg = 'bg-white/10'
}) {
  return (
    <div className={`overflow-hidden ${size} ${shape} ${border} ${fallbackBg} flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
}

/**
 * Reusable Section Heading
 */
export function CVSectionHeading({
  title,
  subtitle,
  icon: Icon,
  variant = 'underline', // 'underline' | 'pill' | 'bar' | 'minimal' | 'boxed' | 'clean'
  textColor = 'text-black',
  borderColor = 'border-gray-200',
  accentBg = 'bg-emerald-600',
  className = ''
}) {
  if (variant === 'pill') {
    return (
      <div className={`flex items-center space-x-2 my-2 ${className}`}>
        <span className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md text-white ${accentBg} flex items-center space-x-1.5`}>
          {Icon && <Icon className="w-3 h-3" />}
          <span>{title}</span>
        </span>
        {subtitle && <span className="text-[10px] text-gray-500 font-medium">{subtitle}</span>}
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div className={`flex items-center space-x-2 border-l-4 pl-2.5 my-2 border-emerald-600 ${className}`}>
        {Icon && <Icon className="w-3.5 h-3.5 text-emerald-600" />}
        <h2 className={`text-xs sm:text-[13px] font-black uppercase tracking-wider ${textColor}`}>
          {title}
        </h2>
      </div>
    );
  }

  if (variant === 'boxed') {
    return (
      <div className={`p-1.5 px-3 bg-gray-100 rounded text-xs font-black uppercase tracking-wider ${textColor} flex items-center space-x-2 my-2 ${className}`}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{title}</span>
      </div>
    );
  }

  if (variant === 'clean') {
    return (
      <div className={`my-2 ${className}`}>
        <h2 className={`text-xs sm:text-[12.5px] font-extrabold uppercase tracking-widest ${textColor} flex items-center space-x-1.5`}>
          {Icon && <Icon className="w-3 h-3" />}
          <span>{title}</span>
        </h2>
      </div>
    );
  }

  // Default 'underline'
  return (
    <div className={`border-b pb-1 my-2 ${borderColor} ${className}`}>
      <h2 className={`text-xs sm:text-[13px] font-black uppercase tracking-wider ${textColor} flex items-center space-x-1.5`}>
        {Icon && <Icon className="w-3 h-3" />}
        <span>{title}</span>
      </h2>
    </div>
  );
}

/**
 * Reusable Contact Chips Bar
 */
export function CVContactBar({
  phone,
  email,
  address,
  linkedin,
  website,
  layout = 'horizontal', // 'horizontal' | 'vertical' | 'grid'
  textColor = 'text-gray-700',
  linkColor = 'text-blue-600',
  className = ''
}) {
  const items = [
    phone && { icon: Phone, text: phone },
    email && { icon: Mail, text: email },
    address && { icon: MapPin, text: address },
    linkedin && { icon: Globe, text: linkedin, isLink: true },
    website && { icon: Globe, text: website, isLink: true }
  ].filter(Boolean);

  if (items.length === 0) return null;

  if (layout === 'vertical') {
    return (
      <div className={`space-y-1.5 text-[10px] ${textColor} ${className}`}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start space-x-2 break-all">
              <Icon className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-80" />
              {item.isLink ? (
                <a href={item.text.startsWith('http') ? item.text : `https://${item.text}`} target="_blank" rel="noreferrer" className={`hover:underline ${linkColor}`}>
                  {item.text}
                </a>
              ) : (
                <span>{item.text}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-2 text-[10px] ${textColor} ${className}`}>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-1.5 truncate">
              <Icon className="w-3 h-3 flex-shrink-0 opacity-80" />
              <span className="truncate">{item.text}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Default horizontal wrap
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] ${textColor} ${className}`}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-center space-x-1.5">
            <Icon className="w-3 h-3 flex-shrink-0 opacity-80" />
            {item.isLink ? (
              <a href={item.text.startsWith('http') ? item.text : `https://${item.text}`} target="_blank" rel="noreferrer" className={`hover:underline ${linkColor} break-all`}>
                {item.text.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}
              </a>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
