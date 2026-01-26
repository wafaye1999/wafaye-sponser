import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ExternalLink, Trash2, Check, LogOut, Plus, RefreshCw, Eye, X, Users, MousePointer, TrendingUp, AlertTriangle, BarChart3, Link2, Loader2, Upload, Calendar, ChevronRight, ChevronLeft, User, Lock, KeyRound, Pencil } from 'lucide-react';
import { FaWhatsapp, FaPhone, FaTelegramPlane, FaInstagram, FaFacebook, FaSnapchatGhost, FaTiktok, FaGlobe, FaDiscord } from 'react-icons/fa';
import { SiViber } from 'react-icons/si';

// Custom Date Picker Component
const DatePickerModal = ({ isOpen, onClose, value, onChange, minDate }) => {
  const [view, setView] = useState('days'); // 'days', 'months', 'years'
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const today = new Date();
  const minDateObj = minDate ? new Date(minDate) : null;

  // Get days in month
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate years (current year to +20 years)
  const years = Array.from({ length: 21 }, (_, i) => today.getFullYear() + i);

  const handleDayClick = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (minDateObj && selectedDate < minDateObj) return;
    
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
    onClose();
  };

  const handleMonthClick = (monthIndex) => {
    setViewDate(new Date(currentYear, monthIndex, 1));
    setView('days');
  };

  const handleYearClick = (year) => {
    setViewDate(new Date(year, currentMonth, 1));
    setView('months');
  };

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const isDateDisabled = (day) => {
    if (!minDateObj) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date < minDateObj;
  };

  const isSelectedDate = (day) => {
    if (!value) return false;
    const selected = new Date(value);
    return selected.getFullYear() === currentYear && 
           selected.getMonth() === currentMonth && 
           selected.getDate() === day;
  };

  // Keyboard shortcuts for date picker
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        // Select today's date
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        onChange(formattedDate);
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onChange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-4 z-[60]" dir="ltr">
      <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-[2rem] w-full max-w-sm shadow-2xl shadow-slate-400/20 border border-white/60 overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 flex-shrink-0">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#007AFF]/5 via-transparent to-transparent" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0055b3] flex items-center justify-center shadow-lg shadow-[#007AFF]/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {value ? new Date(value).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Select a date'}
                </h3>
                <p className="text-slate-400 text-sm">بەرواری بەسەرچوون</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center transition-all hover:scale-105"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-3">
          <div className="flex items-center justify-between bg-white/60 rounded-xl p-2">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setView('months')}
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-700 transition-colors text-sm"
              >
                {months[currentMonth]}
              </button>
              <button
                onClick={() => setView('years')}
                className="px-3 py-1.5 rounded-lg hover:bg-slate-100 font-semibold text-slate-700 transition-colors text-sm"
              >
                {currentYear}
              </button>
            </div>

            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          {/* Days View */}
          {view === 'days' && (
            <>
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, i) => (
                  <div key={i} className="h-9 flex items-center justify-center text-xs font-medium text-slate-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before first day of month */}
                {Array.from({ length: firstDay }, (_, i) => (
                  <div key={`empty-${i}`} className="h-9" />
                ))}
                
                {/* Days */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const disabled = isDateDisabled(day);
                  const selected = isSelectedDate(day);
                  
                  return (
                    <button
                      key={day}
                      onClick={() => !disabled && handleDayClick(day)}
                      disabled={disabled}
                      className={`h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        selected
                          ? 'bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/30'
                          : disabled
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-slate-700 hover:bg-white/80'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Months View */}
          {view === 'months' && (
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, i) => (
                <button
                  key={i}
                  onClick={() => handleMonthClick(i)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    currentMonth === i
                      ? 'bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/30'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {/* Years View */}
          {view === 'years' && (
            <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currentYear === year
                      ? 'bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/30'
                      : 'text-slate-700 hover:bg-white/80'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100/80 flex gap-3 bg-white/50">
          <button
            onClick={onClose}
            className="py-3 px-5 text-slate-500 rounded-xl hover:bg-slate-100 transition-all font-medium"
          >
            Cancel
          </button>

          <div className="flex-1" />

          <button
            onClick={() => {
              const today = new Date();
              const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              onChange(formattedDate);
              onClose();
            }}
            className="py-3 px-6 bg-[#007AFF] hover:bg-[#0066dd] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#007AFF]/25 hover:shadow-xl"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
};

const PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp', placeholder: 'ژمارەی مۆبایل', icon: FaWhatsapp, color: 'from-[#25D366] to-[#128C7E]', bg: 'bg-[#25D366]', text: 'text-white' },
  { id: 'telegram', label: 'Telegram', placeholder: 'ناوی بەکارهێنەر', icon: FaTelegramPlane, color: 'from-[#0088cc] to-[#0066aa]', bg: 'bg-[#0088cc]', text: 'text-white' },
  { id: 'viber', label: 'Viber', placeholder: 'ژمارەی مۆبایل', icon: SiViber, color: 'from-[#7360F2] to-[#59267c]', bg: 'bg-[#7360F2]', text: 'text-white' },
  { id: 'phone', label: 'Phone', placeholder: 'ژمارەی مۆبایل', icon: FaPhone, color: 'from-[#007AFF] to-[#0055b3]', bg: 'bg-[#007AFF]', text: 'text-white', iconClass: '-scale-x-100' },
  { id: 'instagram', label: 'Instagram', placeholder: 'لینک', icon: FaInstagram, color: 'from-[#E4405F] to-[#C13584]', bg: 'bg-[#E4405F]', text: 'text-white' },
  { id: 'facebook', label: 'Facebook', placeholder: 'لینک', icon: FaFacebook, color: 'from-[#1877F2] to-[#0a5dc2]', bg: 'bg-[#1877F2]', text: 'text-white' },
  { id: 'snapchat', label: 'Snapchat', placeholder: 'لینک', icon: FaSnapchatGhost, color: 'from-[#FFFC00] to-[#d4d000]', bg: 'bg-[#FFFC00]', text: 'text-black' },
  { id: 'tiktok', label: 'TikTok', placeholder: 'لینک', icon: FaTiktok, color: 'from-[#000000] to-[#333333]', bg: 'bg-[#000000]', text: 'text-white' },
  { id: 'website', label: 'Website', placeholder: 'لینک', icon: FaGlobe, color: 'from-[#6366f1] to-[#4f46e5]', bg: 'bg-[#6366f1]', text: 'text-white' },
  { id: 'discord', label: 'Discord', placeholder: 'لینکی بانگهێشت', icon: FaDiscord, color: 'from-[#5865F2] to-[#4752c4]', bg: 'bg-[#5865F2]', text: 'text-white' },
];

const DEFAULT_AVATAR = '/images/DefaultAvatar.png';

function Dashboard() {
  const navigate = useNavigate();
  const [linktrees, setLinktrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLinktree, setEditingLinktree] = useState(null); // null = create mode, object = edit mode
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: null, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasAnalyticsData, setHasAnalyticsData] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const profileMenuRef = useRef(null);

  // Get admin info from localStorage
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('admin') || '{}'));

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Default expiry date (10 days from now)
  const getDefaultExpiry = () => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date.toISOString().split('T')[0];
  };

  // Form state
  const [form, setForm] = useState({
    title: '',
    subtitle: 'بۆ پەیوەندی کردن, کلیک لەم لینکانەی خوارەوە بکە',
    image: '',
    color: '#007AFF',
    template: 'default',
    footerText: 'سپۆنسەر کراوە لەلایەن',
    sponsorName: 'Wafa Sponsor',
    sponsorPhone: '07506553031',
    expiresAt: getDefaultExpiry(),
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [platformValues, setPlatformValues] = useState({}); // { platformId: ['value1', 'value2', ...] }
  const [platformMessages, setPlatformMessages] = useState({}); // { platformId: { index: 'message' } }
  
  const DEFAULT_MESSAGE = '';

  const token = localStorage.getItem('token');

  const fetchLinktrees = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/linktree', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLinktrees(data);
      }
    } catch (error) {
      console.error('Error fetching linktrees:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  const checkAnalyticsData = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/check', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHasAnalyticsData(data.hasData);
      }
    } catch (error) {
      console.error('Error checking analytics:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchLinktrees();
    checkAnalyticsData();
  }, [token, navigate, fetchLinktrees, checkAnalyticsData]);

  const handleRefresh = () => {
    fetchLinktrees(true);
    checkAnalyticsData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  const openProfileModal = () => {
    setProfileForm({ username: admin.username || '', currentPassword: '', newPassword: '', confirmPassword: '' });
    setProfileError('');
    setProfileSuccess('');
    setShowProfileMenu(false);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileForm({ username: '', currentPassword: '', newPassword: '', confirmPassword: '' });
    setProfileError('');
    setProfileSuccess('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    // Validate
    if (!profileForm.username.trim()) {
      setProfileError('ناوی بەکارهێنەر پێویستە');
      return;
    }

    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileError('وشەی نهێنی نوێ یەکناگرێتەوە');
      return;
    }

    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      setProfileError('وشەی نهێنی نوێ دەبێت لانیکەم ٦ پیت بێت');
      return;
    }

    if (profileForm.newPassword && !profileForm.currentPassword) {
      setProfileError('وشەی نهێنی ئێستا پێویستە بۆ گۆڕینی وشەی نهێنی');
      return;
    }

    setProfileSaving(true);

    try {
      const body = { username: profileForm.username.trim() };
      if (profileForm.newPassword) {
        body.currentPassword = profileForm.currentPassword;
        body.newPassword = profileForm.newPassword;
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'هەڵە ڕوویدا');
      }

      // Update localStorage and state
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      setAdmin(data.admin);

      setProfileSuccess('پڕۆفایل بەسەرکەوتوویی نوێکرایەوە');
      setProfileForm({ ...profileForm, currentPassword: '', newPassword: '', confirmPassword: '' });

      // Close modal after success
      setTimeout(() => {
        closeProfileModal();
      }, 1500);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleViewAnalytics = async (id) => {
    setAnalyticsLoading(true);
    setShowAnalytics(true);
    try {
      const res = await fetch(`/api/analytics/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const closeAnalytics = () => {
    setShowAnalytics(false);
    setAnalyticsData(null);
  };

  const refreshAnalytics = async () => {
    if (!analyticsData) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics/${analyticsData.linktree.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const deleteAnalytics = () => {
    if (!analyticsData) return;
    openDeleteModal('analytics', analyticsData.linktree.id, analyticsData.linktree.title);
  };

  const deleteAllAnalytics = () => {
    openDeleteModal('all-analytics', 'all', 'هەموو لینکەکان');
  };

  const getPlatformConfig = (platformId) => {
    return PLATFORMS.find(p => p.id === platformId);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (1MB max)
    if (file.size > 1 * 1024 * 1024) {
      alert('Image must be less than 1MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, image: data.url });
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handlePlatformToggle = (platformId) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
      const newValues = { ...platformValues };
      delete newValues[platformId];
      setPlatformValues(newValues);
      // Remove messages for this platform
      const newMessages = { ...platformMessages };
      delete newMessages[platformId];
      setPlatformMessages(newMessages);
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
      // Initialize with one empty value
      setPlatformValues({ ...platformValues, [platformId]: [''] });
      // Initialize with default message for WhatsApp and Telegram
      if (platformId === 'whatsapp' || platformId === 'telegram') {
        setPlatformMessages({ 
          ...platformMessages, 
          [platformId]: { 0: DEFAULT_MESSAGE } 
        });
      }
    }
  };

  const handlePlatformValue = (platformId, index, value) => {
    const currentValues = platformValues[platformId] || [''];
    const newValues = [...currentValues];
    newValues[index] = value;
    setPlatformValues({ ...platformValues, [platformId]: newValues });
  };

  const handlePlatformMessage = (platformId, index, message) => {
    const currentMessages = platformMessages[platformId] || {};
    setPlatformMessages({ 
      ...platformMessages, 
      [platformId]: { ...currentMessages, [index]: message } 
    });
  };

  const addPlatformInstance = (platformId) => {
    const currentValues = platformValues[platformId] || [''];
    const newIndex = currentValues.length;
    setPlatformValues({ ...platformValues, [platformId]: [...currentValues, ''] });
    // Add default message for new WhatsApp/Telegram instance
    if (platformId === 'whatsapp' || platformId === 'telegram') {
      const currentMessages = platformMessages[platformId] || {};
      setPlatformMessages({ 
        ...platformMessages, 
        [platformId]: { ...currentMessages, [newIndex]: DEFAULT_MESSAGE } 
      });
    }
  };

  const removePlatformInstance = (platformId, index) => {
    const currentValues = platformValues[platformId] || [''];
    if (currentValues.length === 1) {
      // If only one instance, remove the platform entirely
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
      const newValues = { ...platformValues };
      delete newValues[platformId];
      setPlatformValues(newValues);
      // Remove messages
      const newMessages = { ...platformMessages };
      delete newMessages[platformId];
      setPlatformMessages(newMessages);
    } else {
      // Remove specific instance
      const newValues = currentValues.filter((_, i) => i !== index);
      setPlatformValues({ ...platformValues, [platformId]: newValues });
      // Remove message for this instance
      const currentMessages = platformMessages[platformId] || {};
      const newMessages = { ...currentMessages };
      delete newMessages[index];
      // Reindex remaining messages
      const reindexed = {};
      Object.keys(newMessages).forEach(key => {
        const keyNum = parseInt(key);
        if (keyNum > index) {
          reindexed[keyNum - 1] = newMessages[key];
        } else if (keyNum < index) {
          reindexed[keyNum] = newMessages[key];
        }
      });
      setPlatformMessages({ ...platformMessages, [platformId]: reindexed });
    }
  };

  const handleSubmit = async () => {
    setSaving(true);

    // Flatten platform values - each instance becomes a separate entry
    const platforms = [];
    selectedPlatforms.forEach(pId => {
      const values = platformValues[pId] || [];
      const messages = platformMessages[pId] || {};
      values.forEach((value, index) => {
        if (value && value.trim()) {
          const platformData = { type: pId, value: value.trim() };
          // Add message for WhatsApp and Telegram if it exists
          if ((pId === 'whatsapp' || pId === 'telegram') && messages[index]) {
            platformData.message = messages[index];
          }
          platforms.push(platformData);
        }
      });
    });

    try {
      const isEditing = editingLinktree !== null;
      const url = isEditing ? `/api/linktree/${editingLinktree._id}` : '/api/linktree';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, platforms })
      });

      if (res.ok) {
        setShowModal(false);
        setEditingLinktree(null);
        resetForm();
        fetchLinktrees();
      }
    } catch (error) {
      console.error(`Error ${editingLinktree ? 'updating' : 'creating'} linktree:`, error);
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (type, id, title) => {
    setDeleteModal({ show: true, type, id, title });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, type: null, id: null, title: '' });
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (deleteModal.type === 'linktree') {
        const res = await fetch(`/api/linktree/${deleteModal.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchLinktrees();
        }
      } else if (deleteModal.type === 'analytics') {
        const res = await fetch(`/api/analytics/${deleteModal.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          refreshAnalytics();
          checkAnalyticsData();
        }
      } else if (deleteModal.type === 'all-analytics') {
        const res = await fetch(`/api/analytics/all`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setHasAnalyticsData(false);
        }
      }
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = useCallback(() => {
    setForm({
      title: '',
      subtitle: 'بۆ پەیوەندی کردن, کلیک لەم لینکانەی خوارەوە بکە',
      image: '',
      color: '#007AFF',
      template: 'default',
      footerText: 'سپۆنسەر کراوە لەلایەن',
      sponsorName: 'Wafa Sponsor',
      sponsorPhone: '07506553031',
      expiresAt: getDefaultExpiry(),
    });
    setSelectedPlatforms([]);
    setPlatformValues({});
    setPlatformMessages({});
    setStep(1);
  }, []);

  const copyLink = (id) => {
    const url = id === 'root' ? window.location.origin : `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openModal = () => {
    setEditingLinktree(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (linktree) => {
    setEditingLinktree(linktree);
    
    // Populate form with existing data
    setForm({
      title: linktree.title || '',
      subtitle: linktree.subtitle || '',
      image: linktree.image || '',
      color: linktree.color || '#007AFF',
      template: linktree.template || 'default',
      footerText: linktree.footerText || 'سپۆنسەر کراوە لەلایەن',
      sponsorName: linktree.sponsorName || 'Wafa Sponsor',
      sponsorPhone: linktree.sponsorPhone || '07506553031',
      expiresAt: linktree.expiresAt ? new Date(linktree.expiresAt).toISOString().split('T')[0] : getDefaultExpiry(),
    });

    // Populate platforms
    const platforms = linktree.platforms || [];
    const platformIds = [...new Set(platforms.map(p => p.type))];
    setSelectedPlatforms(platformIds);

    // Group platform values by type
    const values = {};
    const messages = {};
    platformIds.forEach(pId => {
      const platformInstances = platforms.filter(p => p.type === pId);
      values[pId] = platformInstances.map(p => p.value);
      // Extract messages for WhatsApp and Telegram
      if (pId === 'whatsapp' || pId === 'telegram') {
        const messageMap = {};
        platformInstances.forEach((p, idx) => {
          if (p.message) {
            messageMap[idx] = p.message;
          } else {
            messageMap[idx] = DEFAULT_MESSAGE; // Default if missing
          }
        });
        messages[pId] = messageMap;
      }
    });
    setPlatformValues(values);
    setPlatformMessages(messages);

    setStep(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLinktree(null);
    resetForm();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const canProceedStep1 = form.title.trim() !== '';
  const canProceedStep2 = selectedPlatforms.length > 0;
  const canSubmit = selectedPlatforms.length > 0 && selectedPlatforms.some(p => {
    const values = platformValues[p] || [];
    return values.some(v => v && v.trim());
  });

  // Keyboard shortcuts for modals (Escape to close, Enter to submit/next)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      const isTyping = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      
      // Escape key - close modals
      if (e.key === 'Escape') {
        if (showDatePicker) {
          setShowDatePicker(false);
        } else if (deleteModal.show) {
          setDeleteModal({ show: false, type: null, id: null, title: '' });
        } else if (showProfileModal) {
          setShowProfileModal(false);
          setProfileForm({ username: '', currentPassword: '', newPassword: '', confirmPassword: '' });
          setProfileError('');
          setProfileSuccess('');
        } else if (showAnalytics) {
          setShowAnalytics(false);
          setAnalyticsData(null);
        } else if (showModal) {
          setShowModal(false);
          setEditingLinktree(null);
          resetForm();
        }
      }
      
      // Enter key - submit/next (only when not typing in textarea)
      if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
        // Delete modal - confirm delete
        if (deleteModal.show && !deleting) {
          e.preventDefault();
          // Trigger delete button click
          document.querySelector('[data-confirm-delete]')?.click();
        }
        // Create link modal - next step or submit (only when not in input)
        else if (showModal && !saving && !showDatePicker) {
          e.preventDefault();
          if (step === 1 && canProceedStep1) {
            setStep(2);
          } else if (step === 2 && canProceedStep2) {
            setStep(3);
          } else if (step === 3 && canSubmit) {
            document.querySelector('[data-submit-linktree]')?.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, showAnalytics, showProfileModal, showDatePicker, deleteModal.show, step, canProceedStep1, canProceedStep2, canSubmit, saving, deleting, resetForm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Wafa Sponsor</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Delete All Analytics Button */}
            <button
              onClick={deleteAllAnalytics}
              disabled={!hasAnalyticsData}
              className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50"
              title="سڕینەوەی هەموو شیکاری"
            >
              <Trash2 className="w-4.5 h-4.5 text-red-500" />
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all disabled:opacity-50"
              title="نوێکردنەوە"
            >
              <RefreshCw className={`w-4.5 h-4.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Create Button */}
            <button
              onClick={openModal}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25"
              title="دروستکردنی لینک"
            >
              <Plus className="w-4.5 h-4.5 text-white" />
              <span className="text-white font-medium text-sm hidden sm:block">دروستکردن</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative flex items-center justify-center ml-1" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-200 hover:ring-blue-300 transition-all"
              >
                <img src="/images/Logo.jpg" alt="بەڕێوەبەر" className="w-full h-full object-cover" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/50 p-2 z-50 space-y-1">
                  <button
                    onClick={openProfileModal}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4" />
                    پڕۆفایل
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    چوونەدەرەوە
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">لینکەکان</h2>
            <p className="text-slate-500 text-sm mt-1">بەڕێوەبردنی پەڕەکانی لینک</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BarChart3 className="w-4 h-4" />
            <span>{linktrees.length} کۆی گشتی</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/30 overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-slate-500">بارکردنی لینکەکان...</p>
            </div>
          ) : linktrees.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Link2 className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">هیچ لینکێک نیە</p>
              <p className="text-slate-400 text-sm">یەکەم لینکەکەت دروست بکە بۆ دەستپێکردن</p>
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50/50 border-b border-slate-200/50">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">وێنە</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ناو</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ژێرناو</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ئایدی</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">بەسەرچوون</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">دروستکراو</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">نوێکراوە</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">کردارەکان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {linktrees.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <img
                        src={item.image || DEFAULT_AVATAR}
                        alt={item.title}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      {item._id === 'root' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 mt-1">
                          سەرەکی
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-500">{item.subtitle || '—'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <code className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-mono">
                        {item._id}
                      </code>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(item.expiresAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleViewAnalytics(item._id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="بینینی شیکاری"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyLink(item._id)}
                          className={`p-2 rounded-xl transition-all duration-300 ${
                            copiedId === item._id
                              ? 'text-emerald-600 bg-emerald-50 scale-110'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                          title={copiedId === item._id ? 'کۆپی کرا!' : 'کۆپیکردنی لینک'}
                        >
                          {copiedId === item._id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                          title="دەستکاریکردن"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(item._id === 'root' ? '/' : `/${item._id}`, '_blank')}
                          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                          title="کردنەوە لە تابی نوێ"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {item._id !== 'root' && (
                          <button
                            onClick={() => openDeleteModal('linktree', item._id, item.title)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            title="سڕینەوە"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-slate-400/20 border border-white/60 overflow-hidden">
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 flex-shrink-0">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#007AFF]/5 via-transparent to-transparent" />
              
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${editingLinktree ? 'from-amber-500 to-orange-500 shadow-amber-500/30' : 'from-[#007AFF] to-[#0055b3] shadow-[#007AFF]/30'} flex items-center justify-center shadow-lg`}>
                    {editingLinktree ? <Pencil className="w-7 h-7 text-white" /> : <Plus className="w-7 h-7 text-white" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{editingLinktree ? 'دەستکاریکردنی لینک' : 'دروستکردنی لینکی نوێ'}</h3>
                    <p className="text-slate-400 mt-0.5">هەنگاوی {step} لە 3</p>
                  </div>
                </div>
                <button 
                  onClick={closeModal} 
                  className="w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center transition-all hover:scale-105"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Steps indicator */}
              <div className="mt-8 flex items-center justify-between px-4">
                {[
                  { num: 1, label: 'زانیاری سەرەکی' },
                  { num: 2, label: 'پلاتفۆرمەکان' },
                  { num: 3, label: 'وردەکاری' }
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step === s.num
                          ? 'bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/40 scale-110'
                          : step > s.num
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200/80 text-slate-400'
                      }`}>
                        {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                      </div>
                      <span className={`mt-2 text-xs font-medium transition-colors ${
                        step >= s.num ? 'text-slate-700' : 'text-slate-400'
                      }`}>{s.label}</span>
                    </div>
                    {i < 2 && (
                      <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors ${
                        step > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-6 overflow-y-auto flex-1">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-8">
                  {/* Image Upload Card */}
                  <div className="flex flex-col items-center p-6 bg-white/60 rounded-2xl border border-slate-100">
                    <div className="relative group cursor-pointer">
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 ring-4 ring-white shadow-xl group-hover:shadow-2xl transition-all duration-300">
                        <img
                          src={form.image || DEFAULT_AVATAR}
                          alt="پێشبینی"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                        <Upload className="w-8 h-8 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-slate-500">کلیک بکە بۆ بارکردنی وێنە</p>
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="mt-2 text-sm text-red-400 hover:text-red-500 font-medium transition-colors"
                      >
                        سڕینەوەی وێنە
                      </button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">ناونیشان *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                        placeholder="ناونیشان بنووسە"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">ژێرناو</label>
                      <input
                        type="text"
                        value={form.subtitle}
                        onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                        placeholder="ژێرناو بنووسە"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">نووسینی خوارەوە</label>
                      <input
                        type="text"
                        value={form.footerText}
                        onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                        placeholder="سپۆنسەر کراوە لەلایەن"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">ناوی سپۆنسەر</label>
                      <input
                        type="text"
                        value={form.sponsorName}
                        onChange={(e) => setForm({ ...form, sponsorName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                        placeholder="Wafa Sponsor"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">ژمارەی سپۆنسەر</label>
                      <input
                        type="text"
                        value={form.sponsorPhone}
                        onChange={(e) => setForm({ ...form, sponsorPhone: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                        placeholder="07506553031"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-600">بەرواری بەسەرچوون</label>
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(true)}
                        className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl hover:border-[#007AFF] focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all flex items-center gap-3 text-left"
                      >
                        <Calendar className="w-5 h-5 text-[#007AFF]" />
                        <span className={form.expiresAt ? 'text-slate-700' : 'text-slate-400'}>
                          {form.expiresAt 
                            ? new Date(form.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : 'Select a date'
                          }
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Select Platforms */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-center text-slate-500 text-sm">پلاتفۆرمەکان هەڵبژێرە</p>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {PLATFORMS.map(p => {
                      const Icon = p.icon;
                      const isSelected = selectedPlatforms.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlatformToggle(p.id)}
                          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? `bg-gradient-to-br ${p.color} ${p.text} border-transparent shadow-lg`
                              : 'bg-white/60 text-slate-600 border-slate-200/80 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-white/20' : 'bg-slate-100'
                          }`}>
                            <Icon className={`w-4 h-4 ${p.iconClass || ''} ${isSelected ? '' : 'text-slate-500'}`} />
                          </div>
                          <span className="text-xs font-medium">{p.label}</span>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedPlatforms.length > 0 && (
                    <div className="flex items-center justify-center">
                      <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        {selectedPlatforms.length} پلاتفۆرم هەڵبژێردراوە
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Enter Platform Details */}
              {step === 3 && (
                <div className="space-y-5">
                  <p className="text-center text-slate-500 mb-4">وردەکاری پلاتفۆرمەکان بنووسە</p>
                  
                  <div className="space-y-4">
                    {selectedPlatforms.map(pId => {
                      const platform = PLATFORMS.find(p => p.id === pId);
                      const Icon = platform.icon;
                      const values = platformValues[pId] || [''];
                      
                      return (
                        <div key={pId} className="p-4 bg-white/60 rounded-2xl border border-slate-100">
                          {/* Platform Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                              <Icon className={`w-5 h-5 text-white ${platform.iconClass || ''}`} />
                            </div>
                            <span className="font-semibold text-slate-700">{platform.label}</span>
                            <button
                              type="button"
                              onClick={() => addPlatformInstance(pId)}
                              className="ml-auto w-8 h-8 rounded-lg bg-[#007AFF]/10 hover:bg-[#007AFF]/20 text-[#007AFF] flex items-center justify-center transition-colors"
                              title="Add another"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Input instances */}
                          <div className="space-y-2">
                            {values.map((value, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handlePlatformValue(pId, index, e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300 text-sm"
                                    placeholder={platform.placeholder}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePlatformInstance(pId, index)}
                                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors flex-shrink-0"
                                    title="Remove"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                {/* Message input for WhatsApp and Telegram */}
                                {(pId === 'whatsapp' || pId === 'telegram') && (
                                  <input
                                    type="text"
                                    value={platformMessages[pId]?.[index] || DEFAULT_MESSAGE}
                                    onChange={(e) => handlePlatformMessage(pId, index, e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300 text-sm"
                                    placeholder="پەیام (ئارەزوومەندانە)"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-100/80 flex gap-3 flex-shrink-0 bg-white/50">
              <button
                onClick={closeModal}
                className="py-3.5 px-6 text-slate-500 rounded-xl hover:bg-slate-100 transition-all font-medium"
              >
                پاشگەزبوونەوە
              </button>

              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="py-3.5 px-6 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-medium"
                >
                  گەڕانەوە
                </button>
              )}

              <div className="flex-1" />

              {step < 3 && (
                <button
                  onClick={nextStep}
                  disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                  className="py-3.5 px-8 bg-[#007AFF] hover:bg-[#0066dd] text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#007AFF]/25 hover:shadow-xl hover:shadow-[#007AFF]/30 flex items-center gap-2"
                >
                  بەردەوام بە
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={handleSubmit}
                  disabled={saving || !canSubmit}
                  data-submit-linktree
                  className="py-3.5 px-8 bg-[#007AFF] hover:bg-[#0066dd] text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#007AFF]/25 hover:shadow-xl flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingLinktree ? 'پاشەکەوتکردن...' : 'دروستکردن...'}
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {editingLinktree ? 'پاشەکەوتکردن' : 'دروستکردنی لینک'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        value={form.expiresAt}
        onChange={(date) => setForm({ ...form, expiresAt: date })}
        minDate={new Date().toISOString().split('T')[0]}
      />

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">شیکاری</h3>
                  {analyticsData && (
                    <p className="text-sm text-slate-500">{analyticsData.linktree.title}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={refreshAnalytics}
                  disabled={analyticsLoading}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                  title="نوێکردنەوە"
                >
                  <RefreshCw className={`w-4.5 h-4.5 ${analyticsLoading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={deleteAnalytics}
                  className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="سڕینەوەی شیکاری"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
                <button onClick={closeAnalytics} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {analyticsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                  <p className="text-slate-500">بارکردنی شیکاری...</p>
                </div>
              ) : analyticsData ? (
                <div className="space-y-6">
                  {/* Stats Cards - Horizontal Layout */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-slate-800 block">{analyticsData.views.total}</span>
                          <span className="text-xs font-medium text-blue-600">بینین</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
                          <MousePointer className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-slate-800 block">{analyticsData.clicks.total}</span>
                          <span className="text-xs font-medium text-emerald-600">کرتە</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-slate-800 block">
                            {analyticsData.views.total > 0 
                              ? Math.round((analyticsData.clicks.total / analyticsData.views.total) * 100) 
                              : 0}%
                          </span>
                          <span className="text-xs font-medium text-violet-600">ڕێژەی کرتە</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clicks by Platform */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">کرتەکان بەپێی پلاتفۆرم</h4>
                    {analyticsData.clicks.byPlatform.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl">
                        <MousePointer className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">هێشتا هیچ کرتەیەک تۆمار نەکراوە</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {analyticsData.clicks.byPlatform.map((item) => {
                          const platform = getPlatformConfig(item._id);
                          const Icon = platform?.icon;
                          
                          return (
                            <div key={item._id} className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${platform?.bg || 'bg-gray-500'} ${platform?.text || 'text-white'} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                  {Icon && <Icon className={`w-5 h-5 ${platform?.iconClass || ''}`} />}
                                </div>
                                <span className="font-medium text-slate-700">{platform?.label || item._id}</span>
                              </div>
                              <span className="text-lg font-bold text-slate-800 tabular-nums">{item.total}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">بارکردنی شیکاری سەرکەوتوو نەبوو</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              {deleteModal.type === 'linktree' ? 'سڕینەوەی لینک' : deleteModal.type === 'all-analytics' ? 'سڕینەوەی هەموو شیکاری' : 'سڕینەوەی شیکاری'}
            </h3>
            
            <p className="text-slate-500 text-center mb-6 leading-relaxed">
              {deleteModal.type === 'linktree' 
                ? <>دڵنیایت لە سڕینەوەی <span className="font-semibold text-slate-700">"{deleteModal.title}"</span>؟ ئەم کردارە ناگەڕێتەوە.</>
                : deleteModal.type === 'all-analytics'
                ? <>دڵنیایت لە سڕینەوەی <span className="font-semibold text-slate-700">هەموو داتای شیکاری</span> بۆ هەموو لینکەکان؟ ئەم کردارە ناگەڕێتەوە.</>
                : <>دڵنیایت لە سڕینەوەی هەموو داتای شیکاری <span className="font-semibold text-slate-700">"{deleteModal.title}"</span>؟ ئەم کردارە ناگەڕێتەوە.</>
              }
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold disabled:opacity-50"
              >
                پاشگەزبوونەوە
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                data-confirm-delete
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    سڕینەوە...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    سڕینەوە
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-[2rem] w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl shadow-slate-400/20 border border-white/60 overflow-hidden">
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 flex-shrink-0">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#007AFF]/5 via-transparent to-transparent" />
              
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0055b3] flex items-center justify-center shadow-lg shadow-[#007AFF]/30">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">پڕۆفایل</h3>
                    <p className="text-slate-400 mt-0.5">گۆڕینی زانیاری هەژمار</p>
                  </div>
                </div>
                <button 
                  onClick={closeProfileModal} 
                  className="w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center transition-all hover:scale-105"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleProfileSubmit} className="px-8 pb-6 overflow-y-auto flex-1">
              <div className="space-y-5">
                {profileError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    {profileSuccess}
                  </div>
                )}

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">ناوی بەکارهێنەر</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                    placeholder="ناوی بەکارهێنەر"
                  />
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/80"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gradient-to-b from-white to-slate-50/80 px-3 text-sm text-slate-400 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      گۆڕینی وشەی نهێنی (ئارەزوومەندانە)
                    </span>
                  </div>
                </div>

                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">وشەی نهێنی ئێستا</label>
                  <input
                    type="password"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                    placeholder="وشەی نهێنی ئێستا"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">وشەی نهێنی نوێ</label>
                  <input
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                    placeholder="وشەی نهێنی نوێ (لانیکەم ٦ پیت)"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">دووبارەکردنەوەی وشەی نهێنی نوێ</label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-300"
                    placeholder="دووبارەکردنەوەی وشەی نهێنی نوێ"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-100/80 flex gap-3 flex-shrink-0 bg-white/50">
              <button
                type="button"
                onClick={closeProfileModal}
                disabled={profileSaving}
                className="py-3.5 px-6 text-slate-500 rounded-xl hover:bg-slate-100 transition-all font-medium"
              >
                پاشگەزبوونەوە
              </button>

              <div className="flex-1" />

              <button
                onClick={handleProfileSubmit}
                disabled={profileSaving}
                className="py-3.5 px-8 bg-[#007AFF] hover:bg-[#0066dd] text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#007AFF]/25 hover:shadow-xl flex items-center gap-2"
              >
                {profileSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    پاشەکەوتکردن...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    پاشەکەوتکردن
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
