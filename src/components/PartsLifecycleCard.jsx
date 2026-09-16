import React from 'react';
import { 
  Disc, 
  Zap, 
  Wind, 
  Sparkles, 
  RotateCw, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { INITIAL_PARTS_LIFECYCLE } from '../data/mockData';
import { formatKm } from '../services/vehicleService';

export default function PartsLifecycleCard({ currentOdo = 65030 }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Disc className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Tuổi Thọ Phụ Tùng & Bộ 4 Vỏ Xe Kenda
            </h3>
            <p className="text-xs text-slate-400">
              Theo dõi chu kỳ hao mòn lốp, ắc quy, gạt mưa & điều hòa
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 self-start sm:self-auto flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 4 Vỏ mới thay (2 tuần)
        </span>
      </div>

      {/* Grid of Parts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {INITIAL_PARTS_LIFECYCLE.map((part) => {
          let Icon = Disc;
          if (part.category === 'BATTERY') Icon = Zap;
          if (part.category === 'WIPER') Icon = Wind;
          if (part.category === 'AC') Icon = Sparkles;

          const isTire = part.category === 'TIRE';
          const kmSinceInstalled = currentOdo - (part.installed_odo || 0);
          const kmToNextRotation = isTire ? Math.max(0, (part.next_rotation_odo || 74800) - currentOdo) : 0;

          return (
            <div 
              key={part.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isTire 
                  ? 'bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 border-cyan-500/40 shadow-lg' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isTire ? 'bg-cyan-500/20 text-cyan-400' :
                    part.category === 'BATTERY' ? 'bg-amber-500/20 text-amber-400' :
                    part.category === 'WIPER' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      {part.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Lắp đặt: {part.installed_date} {part.installed_odo && `(${formatKm(part.installed_odo)})`}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {part.health_percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${part.health_percentage}%` }}
                  />
                </div>
              </div>

              {/* Specific info for Tire vs Others */}
              {isTire ? (
                <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/40 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-cyan-200">
                    <span className="flex items-center gap-1 font-semibold">
                      <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Nhắc Đảo Lốp Chéo:
                    </span>
                    <span className="font-mono font-bold text-cyan-300">
                      Còn {formatKm(kmToNextRotation)} (mốc {formatKm(part.next_rotation_odo)})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {part.notes}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                  {part.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
