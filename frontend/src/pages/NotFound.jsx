import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <span className="text-8xl font-bold bg-gradient-to-r from-[#007AFF] to-[#0055b3] bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100">
          <Search className="w-8 h-8 text-[#007AFF]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-800 mb-2">پەڕە نەدۆزرایەوە</h1>
        <p className="text-slate-500 mb-8">
          ببورە، ئەو پەڕەیەی بەدوایدا دەگەڕێیت بوونی نیە یان گواستراوەتەوە.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#007AFF] hover:bg-[#0066dd] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#007AFF]/25"
          >
            <Home className="w-5 h-5" />
            گەڕانەوە بۆ سەرەتا
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            گەڕانەوە
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
