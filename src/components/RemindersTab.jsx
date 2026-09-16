import React, { useState } from 'react';
import { BellRing, Plus, Wrench, Shield, CheckCircle2, AlertTriangle, Clock, Calendar, Droplets } from 'lucide-react';
import { formatKm, calculateReminderStatus } from '../services/vehicleService';
import NextServiceEstimatorCard from './NextServiceEstimatorCard';

export default function RemindersTab({ reminders, currentOdo, onAddServiceFromReminder }) {
  const [newReminderName, setNewReminderName] = useState('');
  const [newIntervalKm, setNewIntervalKm] = useState('10000');
  const [newIntervalMonths, setNewIntervalMonths] = useState('12');
  const [isAdding, setIsAdding] = useState(false);

  const evaluatedReminders = reminders.map(r => calculateReminderStatus(r, currentOdo));

  return (
    <div className="space-y-5 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* 1. Next Service Estimator Card (Mốc 70.000 km) */}
      <NextServiceEstimatorCard 
        currentOdo={currentOdo} 
        onAddService={onAddServiceFromReminder} 
      />

      {/* 2. Header & Reminders List */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-cyan-400" />
            Cài đặt Mốc Hạn Bảo Dưỡng Kép (Drivvo Reminders)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tự động cảnh báo trước theo cả Odometer (km) và Thời gian (tháng)
          </p>
        </div>
      </div>

      {/* Reminders List - Responsive 3-col Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evaluatedReminders.map((rem) => {
          const isOverdue = rem.status === 'OVERDUE';
          const isDueSoon = rem.status === 'DUE_SOON';

          return (
            <div
              key={rem.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isOverdue 
                  ? 'bg-rose-500/10 border-rose-500/40 shadow-sm shadow-rose-500/10' 
                  : isDueSoon 
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-sm shadow-amber-500/10' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{rem.item_type}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border shrink-0 ${
                    isOverdue 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                      : isDueSoon 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {isOverdue ? 'Quá hạn' : isDueSoon ? 'Sắp đến hạn' : 'An toàn'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-1 font-mono bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Chu kỳ ODO</span>
                    <span className="text-slate-200">{formatKm(rem.interval_km)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Chu kỳ TG</span>
                    <span className="text-slate-200">{rem.interval_months} Tháng</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Lần BD trước</span>
                    <span className="text-slate-200">{formatKm(rem.last_service_odo)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Hạn tiếp theo</span>
                    <strong className="text-cyan-300">{formatKm(rem.next_due_odo)}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-end">
                <button
                  onClick={() => {
                    const text = rem.item_type.toLowerCase();
                    let cost = 200000;
                    if (text.includes('nhớt') || text.includes('dầu')) cost = 1151000;
                    else if (text.includes('lọc nhớt')) cost = 65000;
                    else if (text.includes('lọc gió động cơ')) cost = 220000;
                    else if (text.includes('máy lạnh') || text.includes('cabin')) cost = 350000;
                    else if (text.includes('nhiên liệu') || text.includes('lọc xăng')) cost = 650000;
                    else if (text.includes('phanh')) cost = 180000;
                    else if (text.includes('bugi')) cost = 640000;
                    else if (text.includes('hộp số')) cost = 1450000;

                    onAddServiceFromReminder({
                      item_name: rem.item_type,
                      cost: cost,
                      garage_name: 'Hyundai Ngọc Phát'
                    });
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold text-center transition-all active:scale-98"
                >
                  Xác nhận làm
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
