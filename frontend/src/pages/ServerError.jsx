import { Link } from 'react-router-dom';
import { Home, RefreshCw, ServerCrash } from 'lucide-react';

function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 px-4">
      <div className="max-w-md w-full text-center">
        {/* 500 Number */}
        <div className="mb-6">
          <span className="text-8xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
            500
          </span>
        </div>

        {/* Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100">
          <ServerCrash className="w-8 h-8 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">هەڵەی سێرڤەر</h1>
        <p className="text-slate-500 mb-8">
          ببورە، کێشەیەک لە سێرڤەر ڕوویدا. تکایە دواتر دووبارە هەوڵ بدەوە.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#007AFF] hover:bg-[#0066dd] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#007AFF]/25"
          >
            <RefreshCw className="w-5 h-5" />
            نوێکردنەوە
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
          >
            <Home className="w-5 h-5" />
            گەڕانەوە بۆ سەرەتا
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServerError;
