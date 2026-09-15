import React from 'react';
import { ShieldCheck, Database, RefreshCw, Car, AlertTriangle, Printer } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { formatKm } from '../services/vehicleService';

export default function Header({ vehicle, onReset, onOpenExport, activeAlertsCount }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-lg print:hidden">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Vehicle Quick Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-100 text-sm md:text-base tracking-wide">
                {vehicle.make} {vehicle.model}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {vehicle.license_plate}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">ODO: {formatKm(vehicle.current_odo)}</span>
              <span>•</span>
              <span>{vehicle.year} ({vehicle.trim})</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center space-x-2">
          {/* Export PDF Button */}
          <button
            onClick={onOpenExport}
            title="Xuất sổ bảo dưỡng điện tử / In file PDF"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất sổ PDF</span>
          </button>

          {/* Connection Status Badge */}
          <div 
            title={isSupabaseConfigured ? "Đang kết nối Supabase Cloud" : "Đang chạy chế độ Local Demo mượt mà"}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isSupabaseConfigured 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}
          >
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">
              {isSupabaseConfigured ? 'Supabase Live' : 'Demo Mode'}
            </span>
          </div>

          {/* Active Alerts Badge */}
          {activeAlertsCount > 0 && (
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{activeAlertsCount}</span>
            </div>
          )}

          {/* Reset Demo Button */}
          <button
            onClick={onReset}
            title="Khôi phục dữ liệu thực tế mẫu Elantra 65.000km"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
