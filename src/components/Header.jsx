import React from 'react';
import { ShieldCheck, Database, RefreshCw, Car, AlertTriangle, Printer } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { formatKm } from '../services/vehicleService';

export default function Header({ vehicle, onReset, onOpenExport, activeAlertsCount, onNavigateToProfile }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Vehicle & Owner Info (Click to open Profile) */}
        <div 
          onClick={onNavigateToProfile}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group p-1 -ml-1 rounded-xl hover:bg-slate-800/60 transition-all min-w-0 flex-1"
          title="Bấm để xem Hồ sơ xe & Lộ trình vào xưởng chi tiết"
        >
          {/* Avatar Container with strict shrink-0 and square aspect */}
          <div className="relative shrink-0 w-11 h-11 sm:w-12 sm:h-12">
            <img 
              src={vehicle.owner_avatar || "/avatar_tuan.jpg"} 
              alt={vehicle.owner_name || "Phạm Quốc Tuấn"}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover ring-2 ring-cyan-500/50 shadow-md shadow-cyan-500/20 group-hover:scale-105 group-hover:ring-cyan-400 transition-all shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }
              }}
            />
            <div className="hidden w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm" title="Chủ xe online"></span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap sm:flex-nowrap">
              <span className="font-bold text-slate-100 text-sm sm:text-base tracking-wide group-hover:text-cyan-300 transition-colors truncate">
                {vehicle.make} {vehicle.model}
              </span>
              <span className="text-[11px] sm:text-xs px-1.5 py-0.5 rounded-md font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                {vehicle.license_plate}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              <span className="text-cyan-300 font-semibold shrink-0">Tuấn Phạm</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-200 font-medium font-mono shrink-0">ODO: {formatKm(vehicle.current_odo)}</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline truncate">{vehicle.year} ({vehicle.trim})</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Export PDF Button */}
          <button
            onClick={onOpenExport}
            title="Xuất sổ bảo dưỡng điện tử / In file PDF"
            className="flex items-center space-x-1 p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all active:scale-95 shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Xuất sổ PDF</span>
          </button>

          {/* Connection Status Badge */}
          <div 
            title={isSupabaseConfigured ? "Đang kết nối Supabase Cloud" : "Đang chạy chế độ Local Demo mượt mà"}
            className={`flex items-center space-x-1.5 p-2 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border shrink-0 ${
              isSupabaseConfigured 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <Database className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            <span className="hidden lg:inline">
              {isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}
            </span>
          </div>

          {/* Active Alerts Badge */}
          {activeAlertsCount > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeAlertsCount}</span>
            </div>
          )}

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            title="Khôi phục dữ liệu thực tế mẫu Elantra 65.000km"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 active:scale-95 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
