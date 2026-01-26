import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'چوونەژوورەو سەرکەوتوو نەبوو');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[400px]">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <img
                src="/images/Logo.jpg"
                alt="Wafa Sponsor"
                className="relative w-24 h-24 rounded-full object-cover shadow-xl ring-4 ring-white"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">بەخێربێیتەوە</h1>
            <p className="text-slate-500">بچۆرەوە ژوورەوە بۆ پانێلی بەڕێوەبردن</p>
          </div>

          {/* Login Form - No Container */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">ناوی بەکارهێنەر</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="ناوی بەکارهێنەر بنووسە"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">وشەی نهێنی</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 outline-none transition-all placeholder:text-slate-400"
                  placeholder="وشەی نهێنی بنووسە"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#007AFF] to-[#0055b3] hover:from-[#0066dd] hover:to-[#004499] text-white font-semibold transition-all duration-300 shadow-lg shadow-[#007AFF]/25 hover:shadow-xl hover:shadow-[#007AFF]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  چاوەڕوان بە...
                </>
              ) : (
                <>
                  چوونەژوورەوە
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-10">
            پانێلی بەڕێوەبردنی Wafa Sponsor
          </p>
        </div>
      </div>

      {/* Right Side - Visual Section with Phone Button Color */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#007AFF] to-[#0055b3] justify-center items-center relative overflow-hidden">
        {/* Decorative Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full" />
        </div>

        <div className="text-center relative z-10">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
            <img
              src="/images/Logo.jpg"
              alt="Wafa Sponsor"
              className="relative w-28 h-28 rounded-full object-cover shadow-2xl ring-4 ring-white/20"
            />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Wafa Sponsor</h2>
          <p className="text-white/70 text-lg">بەڕێوەبردنی لینکەکانت بە ئاسانی</p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-xs mx-auto">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">شیکاری</span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">فرە-پلاتفۆرم</span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm">دامەزراندنی ئاسان</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
