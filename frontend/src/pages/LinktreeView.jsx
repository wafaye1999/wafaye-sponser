import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { FaWhatsapp, FaPhone, FaTelegramPlane, FaInstagram, FaFacebook, FaSnapchatGhost, FaTiktok, FaGlobe, FaDiscord } from 'react-icons/fa';
import { SiViber } from 'react-icons/si';
import { Loader2, AlertCircle } from 'lucide-react';

const DEFAULT_AVATAR = '/images/DefaultAvatar.png';

// Generate unique event_id for TikTok events
const generateEventId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format Iraqi phone numbers to international format
const formatIraqiPhone = (phone) => {
  let digits = phone.replace(/\D/g, '');
  // If starts with 0 (Iraqi local format like 07502485829), replace with 964
  if (digits.startsWith('0')) {
    digits = '964' + digits.substring(1);
  }
  // If doesn't start with 964, add it
  else if (!digits.startsWith('964')) {
    digits = '964' + digits;
  }
  return digits;
};

const PLATFORM_CONFIG = {
  whatsapp: { icon: FaWhatsapp, label: 'WhatsApp', color: 'from-[#25D366] to-[#128C7E]', shadow: 'shadow-green-500/25', getUrl: (v, msg) => msg ? `https://wa.me/${formatIraqiPhone(v)}?text=${encodeURIComponent(msg)}` : `https://wa.me/${formatIraqiPhone(v)}` },
  telegram: { icon: FaTelegramPlane, label: 'Telegram', color: 'from-[#0088cc] to-[#0066aa]', shadow: 'shadow-sky-500/25', getUrl: (v, msg) => msg ? `https://t.me/${v.replace('@', '')}?text=${encodeURIComponent(msg)}` : `https://t.me/${v.replace('@', '')}` },
  viber: { icon: SiViber, label: 'Viber', color: 'from-[#7360F2] to-[#59267c]', shadow: 'shadow-purple-500/25', getUrl: (v) => `viber://chat?number=${formatIraqiPhone(v)}` },
  phone: { icon: FaPhone, label: 'Phone', color: 'from-[#007AFF] to-[#0055b3]', shadow: 'shadow-blue-500/25', getUrl: (v) => `tel:+${formatIraqiPhone(v)}`, iconClass: '-scale-x-100' },
  instagram: { icon: FaInstagram, label: 'Instagram', color: 'from-[#E4405F] to-[#C13584]', shadow: 'shadow-pink-500/25', getUrl: (v) => v.includes('http://') || v.includes('https://') ? v : `https://instagram.com/${v.replace('@', '')}` },
  facebook: { icon: FaFacebook, label: 'Facebook', color: 'from-[#1877F2] to-[#0a5dc2]', shadow: 'shadow-blue-500/25', getUrl: (v) => v.includes('http://') || v.includes('https://') ? v : `https://facebook.com/${v}` },
  snapchat: { icon: FaSnapchatGhost, label: 'Snapchat', color: 'from-[#FFFC00] to-[#d4d000]', shadow: 'shadow-yellow-500/25', textColor: 'text-black', getUrl: (v) => v.includes('http://') || v.includes('https://') ? v : `https://snapchat.com/add/${v}` },
  tiktok: { icon: FaTiktok, label: 'TikTok', color: 'from-[#000000] to-[#333333]', shadow: 'shadow-gray-500/25', getUrl: (v) => v.includes('http://') || v.includes('https://') ? v : `https://tiktok.com/@${v.replace('@', '')}` },
  website: { icon: FaGlobe, label: 'Website', color: 'from-[#6366f1] to-[#4f46e5]', shadow: 'shadow-indigo-500/25', getUrl: (v) => v.includes('http') ? v : `https://${v}` },
  discord: { icon: FaDiscord, label: 'Discord', color: 'from-[#5865F2] to-[#4752c4]', shadow: 'shadow-indigo-500/25', getUrl: (v) => v.includes('http') ? v : `https://discord.gg/${v}` },
};

function LinktreeView() {
  const { uid } = useParams();
  const [linktree, setLinktree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't fetch if it's root - will be redirected
    if (uid === 'root') return;
    
    const fetchLinktree = async () => {
      try {
        const res = await fetch(`/api/linktree/public/${uid}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setLinktree(data);
      } catch {
        setError('Linktree not found');
      } finally {
        setLoading(false);
      }
    };

    fetchLinktree();
  }, [uid]);

  // Track page view when linktree is loaded
  useEffect(() => {
    if (!linktree || uid === 'root') return;
    
    const trackView = async () => {
      try {
        const eventId = generateEventId();
        const url = window.location.href;
        
        // Track via Pixel SDK (if available)
        if (window.ttq) {
          window.ttq.track('ViewContent', {
            event_id: eventId,
            content_id: uid,
            content_name: linktree.title,
            content_type: 'product',
            value: 0,
            currency: 'USD'
          });
        }
        
        // Track via Event API
        await fetch(`/api/analytics/view/${uid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: eventId, url })
        });
      } catch {
        // Silent fail for analytics
      }
    };

    trackView();
  }, [linktree, uid]);

  const trackClick = async (platformType) => {
    try {
      const eventId = generateEventId();
      const url = window.location.href;
      
      // Track via Pixel SDK (if available)
      if (window.ttq) {
        window.ttq.track('ClickButton', {
          event_id: eventId,
          content_id: uid,
          content_name: `${platformType} button`,
          content_type: 'product',
          value: 0,
          currency: 'USD'
        });
      }
      
      // Track via Event API
      await fetch(`/api/analytics/click/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platformType, event_id: eventId, url })
      });
    } catch {
      // Silent fail for analytics
    }
  };

  // Redirect /root to /
  if (uid === 'root') {
    return <Navigate to="/" replace />;
  }

  const handleClick = (platform) => {
    const config = PLATFORM_CONFIG[platform.type];
    if (config) {
      // Track the click
      trackClick(platform.type);
      
      const url = config.getUrl(platform.value, platform.message);
      if (platform.type === 'phone') {
        window.location.href = url;
      } else {
        window.open(url, '_blank');
      }
    }
  };

  const handleSponsorClick = () => {
    if (linktree?.sponsorPhone) {
      window.open(`https://wa.me/${formatIraqiPhone(linktree.sponsorPhone)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">بارکردن...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <p className="text-slate-600 font-semibold text-lg mb-1">نەدۆزرایەوە</p>
        <p className="text-slate-400">لینک نەدۆزرایەوە</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex flex-col items-center px-5 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:py-16 overflow-y-auto relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full blur-2xl opacity-30 scale-110" />
            <div className="relative p-1.5 bg-white/80 backdrop-blur-xl rounded-full shadow-xl shadow-slate-200/50">
              <img
                src={linktree.image || DEFAULT_AVATAR}
                alt={linktree.title}
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2 sm:mb-3 tracking-tight text-center flex-shrink-0">
          {linktree.title}
        </h1>

        {/* Subtitle */}
        {linktree.subtitle && (
          <p className="text-slate-500 text-lg sm:text-lg md:text-xl lg:text-2xl mb-10 sm:mb-12 text-center px-4 font-medium flex-shrink-0 max-w-md">
            {linktree.subtitle}
          </p>
        )}

        {/* Buttons */}
        <div className="w-full max-w-[92%] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 md:gap-5 flex-shrink-0">
          {linktree.platforms.map((platform, index) => {
            const config = PLATFORM_CONFIG[platform.type];
            if (!config) return null;
            const Icon = config.icon;

            return (
              <button
                key={index}
                className={`w-full flex items-center justify-center gap-4 py-5 sm:py-5 md:py-6 px-8 rounded-full bg-gradient-to-r ${config.color} ${config.textColor || 'text-white'} text-xl sm:text-xl md:text-2xl font-semibold transition-all duration-300 shadow-xl ${config.shadow} hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]`}
                onClick={() => handleClick(platform)}
              >
                <Icon className={`w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 ${config.iconClass || ''}`} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-14 sm:mt-16 flex flex-col items-center gap-4 flex-shrink-0">
          <p className="text-slate-400 text-lg sm:text-lg md:text-xl font-medium">{linktree.footerText}</p>
          <button
            onClick={handleSponsorClick}
            className="px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 rounded-full bg-[#007AFF]/10 backdrop-blur-xl border-2 border-[#007AFF] text-[#007AFF] font-semibold text-lg sm:text-lg md:text-xl hover:bg-[#007AFF]/20 transition-all duration-300 active:scale-[0.98]"
          >
            {linktree.sponsorName}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinktreeView;
