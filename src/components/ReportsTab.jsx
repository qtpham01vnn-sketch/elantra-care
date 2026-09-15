import React from 'react';
import { BarChart3, PieChart, TrendingUp, DollarSign, Fuel, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatKm } from '../services/vehicleService';

export default function ReportsTab({ vehicle, serviceLogs, fuelLogs, expenses }) {
  // Tính tổng chi phí theo từng danh mục
  const totalFuel = fuelLogs.reduce((sum, f) => sum + (f.total_cost || 0), 0);
  
  // Tách bảo dưỡng hãng vs gara ngoài
  const hangServices = serviceLogs.filter(s => s.garage_type === 'HANG');
  const garaServices = serviceLogs.filter(s => s.garage_type === 'GARA_NGOAI');

  const totalHang = hangServices.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalGara = garaServices.reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const totalService = totalHang + totalGara;

  const totalOther = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const grandTotal = totalFuel + totalService + totalOther;

  // Tính phần trăm
  const fuelPercent = grandTotal > 0 ? Math.round((totalFuel / grandTotal) * 100) : 0;
  const hangPercent = grandTotal > 0 ? Math.round((totalHang / grandTotal) * 100) : 0;
  const garaPercent = grandTotal > 0 ? Math.round((totalGara / grandTotal) * 100) : 0;
  const otherPercent = grandTotal > 0 ? Math.max(0, 100 - fuelPercent - hangPercent - garaPercent) : 0;

  // Chi phí trên km
  const totalOdoTraveled = vehicle.current_odo || 65010;
  const costPerKm = totalOdoTraveled > 0 ? Math.round(grandTotal / totalOdoTraveled) : 0;
  const fuelCostPerKm = totalOdoTraveled > 0 ? Math.round(totalFuel / totalOdoTraveled) : 0;
  const serviceCostPerKm = totalOdoTraveled > 0 ? Math.round(totalService / totalOdoTraveled) : 0;

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          Báo cáo & Phân tích Chi phí (TCO Report)
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Thống kê toàn diện chi phí sở hữu và hiệu suất tiêu thụ nhiên liệu của Elantra {vehicle.license_plate}
        </p>
      </div>

      {/* TCO Big KPI Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Tổng Chi Phí Đã Đầu Tư (Total Cost of Ownership)
        </div>
        <div className="text-3xl font-black text-amber-300 mt-1">
          {formatCurrency(grandTotal)}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Chi phí / km</span>
            <strong className="text-cyan-300 font-mono text-sm">{costPerKm.toLocaleString('vi-VN')} đ</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Tiền xăng / km</span>
            <strong className="text-emerald-400 font-mono text-sm">{fuelCostPerKm.toLocaleString('vi-VN')} đ</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Bảo dưỡng / km</span>
            <strong className="text-blue-400 font-mono text-sm">{serviceCostPerKm.toLocaleString('vi-VN')} đ</strong>
          </div>
        </div>
      </div>

      {/* Visual Expense Breakdown Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-cyan-400" />
          Cơ cấu phân bổ chi phí theo danh mục
        </h3>

        {/* Multi-segmented Progress Bar */}
        <div className="w-full bg-slate-950 rounded-xl h-4 overflow-hidden flex p-0.5 border border-slate-800">
          <div style={{ width: `${fuelPercent}%` }} className="bg-emerald-500 h-full rounded-l transition-all" title={`Nhiên liệu: ${fuelPercent}%`} />
          <div style={{ width: `${hangPercent}%` }} className="bg-blue-500 h-full transition-all" title={`Hãng Hyundai: ${hangPercent}%`} />
          <div style={{ width: `${garaPercent}%` }} className="bg-amber-500 h-full transition-all" title={`Gara ngoài: ${garaPercent}%`} />
          <div style={{ width: `${otherPercent}%` }} className="bg-purple-500 h-full rounded-r transition-all" title={`Chi phí khác: ${otherPercent}%`} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Nhiên liệu</span>
            </div>
            <div className="text-xs font-bold text-white">{formatCurrency(totalFuel)}</div>
            <span className="text-[10px] text-slate-400 font-mono">{fuelPercent}% tổng chi phí</span>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-blue-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>Hãng Hyundai</span>
            </div>
            <div className="text-xs font-bold text-white">{formatCurrency(totalHang)}</div>
            <span className="text-[10px] text-slate-400 font-mono">{hangPercent}% tổng chi phí</span>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Gara ngoài (1Car)</span>
            </div>
            <div className="text-xs font-bold text-white">{formatCurrency(totalGara)}</div>
            <span className="text-[10px] text-slate-400 font-mono">{garaPercent}% tổng chi phí</span>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-purple-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              <span>Phí cố định/Khác</span>
            </div>
            <div className="text-xs font-bold text-white">{formatCurrency(totalOther)}</div>
            <span className="text-[10px] text-slate-400 font-mono">{otherPercent}% tổng chi phí</span>
          </div>
        </div>
      </div>

      {/* Fuelio Fuel Consumption Trend */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Fuel className="w-4 h-4 text-emerald-400" />
            Lịch sử mức tiêu hao nhiên liệu (L/100km)
          </h3>
          <span className="text-xs text-emerald-400 font-mono font-bold">Chuẩn Full-Tank</span>
        </div>

        <div className="space-y-2">
          {fuelLogs.map((log) => {
            const consumption = log.consumption_l_100km || 7.2;
            const barWidth = Math.min(100, (consumption / 10) * 100);
            return (
              <div key={log.id} className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-mono">{formatKm(log.odo)} ({log.fuel_date})</span>
                  <span className="text-emerald-400 font-bold font-mono">{consumption} L/100km</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
