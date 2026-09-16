import React, { useState } from 'react';
import { 
  Disc, 
  Zap, 
  Wind, 
  Sparkles, 
  RotateCw, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle,
  Gauge,
  Check,
  X,
  Info,
  ArrowRight
} from 'lucide-react';
import { INITIAL_PARTS_LIFECYCLE } from '../data/mockData';
import { formatKm } from '../services/vehicleService';

export default function PartsLifecycleCard({ currentOdo = 65030 }) {
  const [parts, setParts] = useState(INITIAL_PARTS_LIFECYCLE);
  const [showRotationModal, setShowRotationModal] = useState(false);
  const [rotationSuccessToast, setRotationSuccessToast] = useState(false);

  const handleConfirmRotation = () => {
    setParts(prev => prev.map(p => {
      if (p.category === 'TIRE') {
        return {
          ...p,
          next_rotation_odo: currentOdo + 10000,
          notes: `Đã đảo lốp chéo và cân mâm tại mốc ${formatKm(currentOdo)}. Đợt kế tiếp: ${formatKm(currentOdo + 10000)}.`
        };
      }
      return p;
    }));
    setShowRotationModal(false);
    setRotationSuccessToast(true);
    setTimeout(() => setRotationSuccessToast(false), 4000);
  };

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

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4 Vỏ mới thay (2 tuần)
          </span>
        </div>
      </div>

      {/* Grid of Parts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {parts.map((part) => {
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
                <div className="space-y-2.5">
                  {/* Tire Spec & Pressure Badge */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                      <span className="text-[10px] text-cyan-300 block">Áp suất chuẩn:</span>
                      <strong className="text-white font-mono">2.2 - 2.3 bar (33 PSI)</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                      <span className="text-[10px] text-cyan-300 block">Cân mâm bấm chì:</span>
                      <strong className="text-emerald-400">Đã cân mâm chuẩn</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-cyan-950/50 border border-cyan-800/50 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center text-cyan-200">
                      <span className="flex items-center gap-1 font-semibold">
                        <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Nhắc Đảo Lốp Chéo:
                      </span>
                      <span className="font-mono font-bold text-cyan-300">
                        Còn {formatKm(kmToNextRotation)} (mốc {formatKm(part.next_rotation_odo)})
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-400 leading-tight">
                        Chu kỳ 10.000 km giúp lốp mòn đều và tăng tuổi thọ 20%.
                      </p>

                      <button
                        onClick={() => setShowRotationModal(true)}
                        className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/50 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95"
                      >
                        <RotateCw className="w-3 h-3" /> Đã đảo lốp
                      </button>
                    </div>
                  </div>
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

      {/* Rotation Toast */}
      {rotationSuccessToast && (
        <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>✅ Đã cập nhật đảo lốp thành công! Mốc đảo lốp kế tiếp được tự động dời thêm 10.000 km.</span>
        </div>
      )}

      {/* Tire Rotation Confirmation & Scheme Modal */}
      {showRotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-cyan-400" />
                Xác Nhận Đảo Lốp Định Kỳ (FWD)
              </h4>
              <button 
                onClick={() => setShowRotationModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Xác nhận anh đã thực hiện đảo 4 vỏ xe <b>KENDA 195/65R15</b> và cân mâm chì tại ODO hiện tại (<strong className="text-cyan-300">{formatKm(currentOdo)}</strong>)?
              </p>

              {/* FWD Cross-rotation diagram representation */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Sơ đồ đảo lốp chéo xe cầu trước (FWD) Hyundai Elantra:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-cyan-400">Trái Trước (FL)</span>
                    <p className="text-[10px] text-slate-400">Chuyển thẳng về Sau Trái (RL)</p>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-cyan-400">Phải Trước (FR)</span>
                    <p className="text-[10px] text-slate-400">Chuyển thẳng về Sau Phải (RR)</p>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-emerald-400">Sau Trái (RL)</span>
                    <p className="text-[10px] text-slate-400">Chuyển chéo lên Phải Trước (FR)</p>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-emerald-400">Sau Phải (RR)</span>
                    <p className="text-[10px] text-slate-400">Chuyển chéo lên Trái Trước (FL)</p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-cyan-950/40 rounded-xl text-cyan-200 text-[11px]">
                💡 Sau khi xác nhận, mốc hẹn đảo lốp kế tiếp sẽ tự động dời lên <b>{formatKm(currentOdo + 10000)}</b>.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowRotationModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRotation}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Check className="w-4 h-4" /> Xác nhận đảo lốp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
