import React from 'react';
import { 
  Wrench, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { NEXT_SERVICE_ESTIMATE } from '../data/mockData';
import { formatCurrency, formatKm } from '../services/vehicleService';

export default function NextServiceEstimatorCard({ currentOdo = 65030 }) {
  const kmRemaining = Math.max(0, NEXT_SERVICE_ESTIMATE.milestone_odo - currentOdo);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Dự Toán Bảo Dưỡng Lần Tới (Mốc 70.000 KM)
            </h3>
            <p className="text-xs text-slate-400">
              Chủ động chuẩn bị ngân sách & danh mục phụ tùng cần làm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            Còn {formatKm(kmRemaining)}
          </span>
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Hẹn: 16/01/2027
          </span>
        </div>
      </div>

      {/* Estimate Details */}
      <div className="space-y-3">
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Cấp độ bảo dưỡng:</span>
            <span className="font-bold text-slate-100">{NEXT_SERVICE_ESTIMATE.level}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Đại lý thực hiện:</span>
            <span className="font-semibold text-cyan-300">{NEXT_SERVICE_ESTIMATE.garage_name}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Dự toán tổng chi phí:</span>
            <span className="text-base font-mono font-extrabold text-emerald-400">
              ~ {formatCurrency(NEXT_SERVICE_ESTIMATE.estimated_cost)}
            </span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">
            Các hạng mục chuẩn bị làm:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {NEXT_SERVICE_ESTIMATE.items.map((item, idx) => (
              <div 
                key={idx}
                className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-300">
                  {item.cost > 0 ? formatCurrency(item.cost) : 'Miễn phí'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Advice note */}
        <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{NEXT_SERVICE_ESTIMATE.recommendations}</span>
        </div>
      </div>
    </div>
  );
}
