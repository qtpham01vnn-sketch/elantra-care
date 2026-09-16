import React, { useState } from 'react';
import { 
  Fuel, 
  Wrench, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Droplets, 
  Filter, 
  Wind, 
  Fan, 
  Disc, 
  Zap, 
  Cog, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  FileText,
  Shield,
  Navigation,
  PhoneCall,
  RotateCw,
  CreditCard,
  QrCode,
  AlertOctagon,
  Calendar,
  Gauge,
  Activity,
  BarChart2,
  PieChart,
  Car,
  Layers
} from 'lucide-react';
import { formatCurrency, formatKm, calculateReminderStatus } from '../services/vehicleService';
import { NEXT_SERVICE_ESTIMATE } from '../data/mockData';
import PartsLifecycleCard from './PartsLifecycleCard';

export default function DashboardTab({ 
  vehicle, 
  serviceLogs, 
  fuelLogs, 
  expenses, 
  reminders, 
  onNavigateTab,
  onOpenQuickAdd,
  onOpenGlovebox,
  onOpenSos,
  onOpenTripCalc,
  onOpenVETC,
  onOpenPhatNguoi,
  onOpenSmartQR,
  onOpenBodyPaintQuote
}) {
  const [activeChartTab, setActiveChartTab] = useState('fuel_trend'); // 'fuel_trend', 'cost_breakdown', 'milestones'

  // Tính toán KPI Tổng hợp
  const totalFuelCost = fuelLogs.reduce((acc, f) => acc + (f.total_cost || 0), 0);
  const totalServiceCost = serviceLogs.reduce((acc, s) => acc + (s.total_amount || 0), 0);
  const totalOtherExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const grandTotal = totalFuelCost + totalServiceCost + totalOtherExpenses;

  // Chi phí trên km (Cost/km)
  const currentOdo = vehicle.current_odo || 65030;
  const costPerKm = currentOdo > 0 ? Math.round(grandTotal / currentOdo) : 0;

  // Mức tiêu thụ TB gần nhất (Fuelio)
  const validFuelEntries = fuelLogs.filter(f => f.consumption_l_100km > 0);
  const avgFuelEconomy = validFuelEntries.length > 0
    ? (validFuelEntries.reduce((acc, f) => acc + f.consumption_l_100km, 0) / validFuelEntries.length).toFixed(2)
    : '7.24';

  // Tính phân bổ chi phí Hãng vs Gara
  const hangCost = serviceLogs.filter(s => s.garage_type === 'HANG').reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const garaCost = serviceLogs.filter(s => s.garage_type === 'GARA_NGOAI').reduce((sum, s) => sum + (s.total_amount || 0), 0);
  const hangPct = totalServiceCost > 0 ? Math.round((hangCost / totalServiceCost) * 100) : 68;
  const garaPct = 100 - hangPct;

  // Tính phân bổ TCO
  const fuelTcoPct = grandTotal > 0 ? Math.round((totalFuelCost / grandTotal) * 100) : 60;
  const serviceTcoPct = grandTotal > 0 ? Math.round((totalServiceCost / grandTotal) * 100) : 40;

  // Tính trạng thái các hạng mục bảo dưỡng kép
  const evaluatedReminders = reminders.map(r => calculateReminderStatus(r, currentOdo));
  const urgentReminders = evaluatedReminders.filter(r => r.status === 'OVERDUE' || r.status === 'DUE_SOON');

  // Mốc tiếp theo
  const nextTargetOdo = 70023;
  const kmToNextService = Math.max(0, nextTargetOdo - currentOdo);
  const progressToNext = Math.min(100, Math.round(((currentOdo - 65000) / (nextTargetOdo - 65000)) * 100));

  // Helper render icon cho hạng mục
  const renderItemIcon = (itemType) => {
    const text = itemType.toLowerCase();
    if (text.includes('nhớt') || text.includes('dầu')) return <Droplets className="w-4 h-4 text-amber-400" />;
    if (text.includes('lọc xăng')) return <Fuel className="w-4 h-4 text-emerald-400" />;
    if (text.includes('lọc nhớt')) return <Filter className="w-4 h-4 text-cyan-400" />;
    if (text.includes('lọc gió động cơ')) return <Wind className="w-4 h-4 text-indigo-400" />;
    if (text.includes('máy lạnh') || text.includes('cabin')) return <Fan className="w-4 h-4 text-blue-400" />;
    if (text.includes('phanh')) return <Disc className="w-4 h-4 text-rose-400" />;
    if (text.includes('bugi')) return <Zap className="w-4 h-4 text-yellow-400" />;
    if (text.includes('hộp số')) return <Cog className="w-4 h-4 text-purple-400" />;
    return <Wrench className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-5 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* ========================================================================= */}
      {/* 1. TOP EXECUTIVE COCKPIT & KPI CARDS (Hàng ODO & 4 Chỉ Số Đa Màu Sắc)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* 1.1 HERO VEHICLE COCKPIT CARD (lg:col-span-5) */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/40 p-5 sm:p-6 shadow-2xl flex flex-col justify-between group">
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Header: License Plate & Vehicle Specs */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 tracking-wider shadow-sm">
                  {vehicle.license_plate}
                </span>
                <span className="text-xs text-slate-300 font-semibold truncate">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Chuẩn vận hành 100%
              </span>
            </div>

            {/* Main ODO & Progress HUD */}
            <div className="space-y-2 pt-1">
              <div className="flex items-baseline justify-between flex-wrap gap-1">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Đồng Hồ Odometer Hiện Tại
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono drop-shadow">
                    {formatKm(currentOdo)}
                  </h1>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Mốc kế tiếp (Cấp 1)</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">70.023 km</span>
                </div>
              </div>

              {/* Glowing ODO Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-700 shadow-sm shadow-cyan-500/50"
                    style={{ width: `${Math.max(15, progressToNext)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Mốc 65.023 km (Đã xong ✅)</span>
                  <span className="text-cyan-300 font-semibold">Còn {kmToNextService.toLocaleString('vi-VN')} km</span>
                </div>
              </div>
            </div>

            {/* 4 Micro Telemetry HUD Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" /> Ắc quy 12V
                </span>
                <span className="text-xs font-bold font-mono text-slate-100">12.6V <span className="text-[9px] text-emerald-400">98%</span></span>
              </div>

              <div className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <Disc className="w-3 h-3 text-cyan-400" /> 4 Lốp Kenda
                </span>
                <span className="text-xs font-bold font-mono text-cyan-300">2.3 bar <span className="text-[9px] text-slate-400">33PSI</span></span>
              </div>

              <div className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-emerald-400" /> Bình Xăng
                </span>
                <span className="text-xs font-bold font-mono text-emerald-300">~35 Lít <span className="text-[9px] text-emerald-400">75%</span></span>
              </div>

              <div className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-400" /> Bảo Hành
                </span>
                <span className="text-xs font-bold font-mono text-blue-300">29/11/27 <span className="text-[9px] text-slate-400">5 Năm</span></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-4 relative z-10 border-t border-slate-800/80 mt-2">
            <button
              onClick={() => onOpenQuickAdd('fuel')}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-200 border border-emerald-500/40 text-xs font-bold shadow-lg shadow-emerald-600/10 transition-all active:scale-95"
            >
              <Fuel className="w-4 h-4 text-emerald-400" />
              <span>Đổ xăng</span>
            </button>
            <button
              onClick={() => onOpenQuickAdd('service')}
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>Ghi bảo dưỡng</span>
            </button>
          </div>
        </div>

        {/* 1.2 4 RICH VISUAL KPI METRIC CARDS (lg:col-span-7) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Card 1: Chi phí / km (Cyan Glow + Sparkline Wave) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-500/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Chi Phí Vận Hành
                </span>
                <div className="text-2xl font-black text-white font-mono mt-1 tracking-tight">
                  {costPerKm.toLocaleString('vi-VN')} <span className="text-xs font-normal text-cyan-300">đ/km</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>

            {/* Mini Sparkline Wave Curve SVG */}
            <div className="py-2">
              <svg className="w-full h-7 overflow-visible" viewBox="0 0 100 28" fill="none">
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 22 Q 25 10, 50 18 T 100 8" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0 22 Q 25 10, 50 18 T 100 8 L 100 28 L 0 28 Z" fill="url(#cyanGrad)" />
                <circle cx="100" cy="8" r="3" fill="#22d3ee" className="animate-ping" />
                <circle cx="100" cy="8" r="2.5" fill="#ffffff" />
              </svg>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Tiết kiệm 18%
              </span>
              <span className="text-slate-400 font-mono">Xăng + Hãng</span>
            </div>
          </div>

          {/* Card 2: Tiêu hao nhiên liệu (Emerald Glow + 5-Bar Chart) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Tiêu Hao TB
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1 tracking-tight">
                  {avgFuelEconomy} <span className="text-xs font-normal text-slate-300">L/100km</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <Fuel className="w-4 h-4" />
              </div>
            </div>

            {/* Mini Multi-Bar Chart (5 lần đổ gần nhất) */}
            <div className="py-2 flex items-end justify-between gap-1.5 h-11 px-1">
              {[
                { odo: '61k', l: 7.4, h: '75%', col: 'bg-emerald-500/70' },
                { odo: '62k', l: 7.1, h: '65%', col: 'bg-emerald-400' },
                { odo: '63k', l: 7.3, h: '72%', col: 'bg-emerald-500/80' },
                { odo: '64k', l: 7.0, h: '60%', col: 'bg-emerald-400' },
                { odo: '65k', l: 7.24, h: '68%', col: 'bg-gradient-to-t from-emerald-500 to-cyan-400' }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar" title={`${bar.odo}: ${bar.l} L/100km`}>
                  <div className="w-full bg-slate-800 rounded-t-sm h-7 flex items-end overflow-hidden">
                    <div 
                      className={`w-full ${bar.col} rounded-t-sm transition-all group-hover/bar:brightness-125`}
                      style={{ height: bar.h }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono leading-none">{bar.odo}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-cyan-300 font-semibold">Chuẩn MPI 1.6</span>
              <span className="text-slate-400 font-mono">Full-Tank</span>
            </div>
          </div>

          {/* Card 3: Tổng Chi Phí Bảo Dưỡng (Blue Glow + Dual Split Bar) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 hover:border-blue-500/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Tổng Bảo Dưỡng
                </span>
                <div className="text-xl font-black text-slate-100 font-mono mt-1 tracking-tight truncate">
                  {formatCurrency(totalServiceCost)}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
                <Wrench className="w-4 h-4" />
              </div>
            </div>

            {/* Dual Segmented Bar: Hãng vs Gara */}
            <div className="py-2 space-y-1.5">
              <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 flex overflow-hidden">
                <div 
                  style={{ width: `${hangPct}%` }} 
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-l-full" 
                  title={`Hãng Hyundai: ${formatCurrency(hangCost)} (${hangPct}%)`}
                />
                <div 
                  style={{ width: `${garaPct}%` }} 
                  className="bg-amber-500 h-full rounded-r-full" 
                  title={`Gara ngoài: ${formatCurrency(garaCost)} (${garaPct}%)`}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="text-blue-300">Hãng ({hangPct}%)</span>
                <span className="text-amber-300">Gara ({garaPct}%)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-blue-300 font-semibold">{serviceLogs.length} Lần vào xưởng</span>
              <span className="text-slate-400">Tiết kiệm ~2.59M</span>
            </div>
          </div>

          {/* Card 4: Tổng Chi Phí TCO (Amber Gold Glow + 3-Segment Bar) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 hover:border-amber-500/60 rounded-3xl p-4 flex flex-col justify-between shadow-lg transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Tổng Chi Phí TCO
                </span>
                <div className="text-xl font-black text-amber-300 font-mono mt-1 tracking-tight truncate">
                  {formatCurrency(grandTotal)}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            {/* 3-Segment TCO Distribution Bar */}
            <div className="py-2 space-y-1.5">
              <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 flex overflow-hidden">
                <div 
                  style={{ width: `${fuelTcoPct}%` }} 
                  className="bg-emerald-500 h-full rounded-l-full" 
                  title={`Xăng: ${fuelTcoPct}%`}
                />
                <div 
                  style={{ width: `${serviceTcoPct}%` }} 
                  className="bg-blue-500 h-full rounded-r-full" 
                  title={`Bảo dưỡng: ${serviceTcoPct}%`}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span className="text-emerald-400">Xăng ({fuelTcoPct}%)</span>
                <span className="text-blue-400">Bảo dưỡng ({serviceTcoPct}%)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-amber-300 font-semibold">Vận hành từ 2022</span>
              <span className="text-slate-400">Chu kỳ tối ưu</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE MULTI-COLORED DASHBOARD ANALYTICS PANEL (Biểu Đồ Trực Quan) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        
        {/* Top Header & Chart Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Trung Tâm Phân Tích Dữ Liệu & Hiệu Suất Vận Hành
              </h3>
              <p className="text-xs text-slate-400">
                Biểu đồ đo lường đa chiều về nhiên liệu, tỷ trọng chi phí và tiến độ bảo dưỡng
              </p>
            </div>
          </div>

          {/* 3 Chart Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveChartTab('fuel_trend')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeChartTab === 'fuel_trend'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>1. Tiêu Thụ Xăng</span>
            </button>

            <button
              onClick={() => setActiveChartTab('cost_breakdown')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeChartTab === 'cost_breakdown'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>2. Cơ Cấu TCO</span>
            </button>

            <button
              onClick={() => setActiveChartTab('milestones')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeChartTab === 'milestones'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>3. Mốc Lịch Sử ODO</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Fuel Consumption Wave Chart & Logs */}
        {activeChartTab === 'fuel_trend' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Left: Wave Chart SVG Visualization */}
              <div className="lg:col-span-8 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Đồ thị mức tiêu thụ nhiên liệu (Lít / 100km qua các mốc ODO)
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    TB: {avgFuelEconomy} L/100km
                  </span>
                </div>

                {/* SVG Line & Area Wave Chart */}
                <div className="relative h-40 w-full pt-2">
                  <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="fuelWaveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="0" y1="55" x2="500" y2="55" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

                    {/* Smooth Area Path */}
                    <path 
                      d="M 0 65 Q 70 45, 140 70 T 280 50 T 420 60 L 500 45 L 500 130 L 0 130 Z" 
                      fill="url(#fuelWaveGrad)" 
                    />

                    {/* Smooth Line Path */}
                    <path 
                      d="M 0 65 Q 70 45, 140 70 T 280 50 T 420 60 L 500 45" 
                      fill="none" 
                      stroke="#34d399" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />

                    {/* Data Points */}
                    <circle cx="70" cy="52" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="210" cy="65" r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="350" cy="55" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="490" cy="45" r="6" fill="#34d399" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Mốc 61.200 km (7.4L)</span>
                  <span>62.500 km (7.1L)</span>
                  <span>63.800 km (7.3L)</span>
                  <span>65.030 km (7.24L)</span>
                </div>
              </div>

              {/* Right: Fuel Economy Gauge Meter HUD */}
              <div className="lg:col-span-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3 h-full">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Đánh Giá Hiệu Suất Động Cơ
                  </span>
                  <div className="text-xl font-black text-emerald-300 font-mono mt-1">
                    Chuẩn Tiết Kiệm Khí Động Học
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Hệ thống phun xăng đa điểm SmartStream 1.6L MPI kết hợp hộp số 6AT duy trì dải tiêu thụ <strong>6.8 - 7.5 L/100km</strong> đường hỗn hợp.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Tiền xăng / km:</span>
                    <strong className="text-emerald-400 font-bold">~1.650 đ / km</strong>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Dung tích bình:</span>
                    <strong className="text-slate-200">47 Lít (RON 95-III)</strong>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Quãng đường / bình:</span>
                    <strong className="text-cyan-300 font-bold">~640 - 680 km</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Cost Breakdown Multi-Bar & Proportions */}
        {activeChartTab === 'cost_breakdown' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-400" />
                  Cơ cấu 4 nhóm chi phí lớn trong toàn bộ vòng đời xe ({formatCurrency(grandTotal)})
                </h4>
                <span className="text-xs text-cyan-300 font-mono font-bold">Đời 2022 - 2026</span>
              </div>

              {/* Multi-segmented Vibrant Bar */}
              <div className="w-full bg-slate-950 rounded-2xl h-5 p-1 border border-slate-800 flex overflow-hidden">
                <div style={{ width: `${fuelTcoPct}%` }} className="bg-emerald-500 h-full rounded-l-xl transition-all" title={`Nhiên liệu: ${fuelTcoPct}%`} />
                <div style={{ width: `${Math.round((hangCost / grandTotal) * 100)}%` }} className="bg-blue-500 h-full transition-all" title="Bảo dưỡng Hãng Hyundai" />
                <div style={{ width: `${Math.round((garaCost / grandTotal) * 100)}%` }} className="bg-amber-500 h-full transition-all" title="Gara ngoài & Phụ tùng" />
                <div style={{ width: `${Math.max(5, 100 - fuelTcoPct - Math.round((totalServiceCost / grandTotal) * 100))}%` }} className="bg-purple-500 h-full rounded-r-xl transition-all" title="Phí cố định & Đăng kiểm" />
              </div>

              {/* 4 Colored Analytics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-slate-900/90 border border-emerald-500/30 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Nhiên liệu (Xăng)</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white">{formatCurrency(totalFuelCost)}</div>
                  <span className="text-[10px] text-slate-400 font-mono">{fuelTcoPct}% tổng chi phí</span>
                </div>

                <div className="p-3 bg-slate-900/90 border border-blue-500/30 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Hãng Hyundai</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white">{formatCurrency(hangCost)}</div>
                  <span className="text-[10px] text-slate-400 font-mono">{Math.round((hangCost / grandTotal) * 100)}% tổng chi phí</span>
                </div>

                <div className="p-3 bg-slate-900/90 border border-amber-500/30 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Gara ngoài (1Car)</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white">{formatCurrency(garaCost)}</div>
                  <span className="text-[10px] text-slate-400 font-mono">{Math.round((garaCost / grandTotal) * 100)}% tổng chi phí</span>
                </div>

                <div className="p-3 bg-slate-900/90 border border-purple-500/30 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Phí cố định / Khác</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white">{formatCurrency(totalOtherExpenses)}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Đăng kiểm, VETC...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Service Milestone History Progress Timeline */}
        {activeChartTab === 'milestones' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-purple-400" />
                  Tiến trình mốc bảo dưỡng định kỳ Elantra 60K-228.98 từ xuất xưởng đến nay
                </h4>
                <span className="text-xs text-purple-300 font-mono font-bold">Mốc hiện tại: {formatKm(currentOdo)}</span>
              </div>

              {/* Milestone Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
                {[
                  { odo: '1.000 km', title: 'Cấp Rà Máy', date: '12/2022', done: true, cost: 'Miễn phí' },
                  { odo: '5.000 km', title: 'Cấp 1 Nhỏ', date: '02/2023', done: true, cost: 'Hãng' },
                  { odo: '10.000 km', title: 'Cấp 1 Nhỏ', date: '07/2023', done: true, cost: 'Hãng' },
                  { odo: '20.000 km', title: 'Cấp 2 Vừa', date: '01/2024', done: true, cost: 'Hãng' },
                  { odo: '40.000 km', title: 'Cấp 3 Lớn', date: '01/2025', done: true, cost: 'Hãng' },
                  { odo: '65.023 km', title: 'Cấp 3 Lớn', date: '09/2026', done: true, cost: '3.322.080 đ' },
                  { odo: '70.023 km', title: 'Cấp 1 Nhỏ', date: '01/2027', done: false, cost: '~1.150.000 đ' },
                ].map((step, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl border transition-all ${
                      step.done 
                        ? 'bg-slate-900/90 border-emerald-500/40 text-slate-100 shadow-sm' 
                        : 'bg-cyan-950/20 border-cyan-500/60 text-cyan-300 animate-pulse'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-black">{step.odo}</span>
                      {step.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-200 truncate">{step.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.date} • <span className="font-mono text-slate-300 font-semibold">{step.cost}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. NEXT SERVICE APPOINTMENT BANNER (Duy Nhất 1 Vị Trí Rõ Ràng)            */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-cyan-950/50 via-slate-900 to-blue-950/50 border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-white uppercase tracking-wide">
                  Hẹn Bảo Dưỡng Lần Sau: 70.023 KM
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  CẤP 1 NHỎ
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  Còn ~4.993 km
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Ngày hẹn: <strong className="text-white">16/01/2027</strong> • Gara: <strong className="text-cyan-300">Hyundai Ngọc Phát</strong> (CVDV Cao Nguyên - 0358455495)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Dự toán chi phí</span>
              <span className="text-base font-mono font-bold text-emerald-400">~1.150.000 đ</span>
            </div>
            <button
              onClick={() => onNavigateTab('reminders')}
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 active:scale-95"
            >
              <span>Chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. 7 QUICK FEATURE SHORTCUTS (Các Tiện Ích Chuyên Sâu)                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {/* Shortcut 1: Digital Glovebox */}
        <button
          onClick={onOpenGlovebox}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-800/60 hover:border-blue-500/80 text-left transition-all group shadow-md active:scale-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
              1-CHẠM
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
            Hộp Giấy Tờ Số
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            GPLX C, Đăng kiểm, VASS
          </p>
        </button>

        {/* Shortcut 2: VETC Wallet */}
        <button
          onClick={onOpenVETC}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/60 hover:border-emerald-500/80 text-left transition-all group shadow-md active:scale-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              624K
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
            Ví VETC Thu Phí
          </h4>
          <p className="text-[11px] text-emerald-400 font-mono mt-0.5 truncate font-semibold">
            624.267 đ
          </p>
        </button>

        {/* Shortcut 3: Traffic Fine Lookup (Phạt Nguội) */}
        <button
          onClick={onOpenPhatNguoi}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-800/60 hover:border-amber-500/80 text-left transition-all group shadow-md active:scale-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              SẠCH LỖI
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
            Phạt Nguội CSGT
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            Biển số 60K-228.98
          </p>
        </button>

        {/* Shortcut 4: Smart Vehicle QR */}
        <button
          onClick={onOpenSmartQR}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-800/60 hover:border-purple-500/80 text-left transition-all group shadow-md active:scale-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
              SMART
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
            Mã QR Sổ Xe
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            Quét cho thợ / gara
          </p>
        </button>

        {/* Shortcut 5: SOS Emergency Toolkit */}
        <button
          onClick={onOpenSos}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-800/60 hover:border-rose-500/80 text-left transition-all group shadow-md active:scale-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-4 h-4 text-rose-400" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 animate-pulse">
              SOS 24/7
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
            Cứu Hộ & Hotline
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            Cao tốc, VASS, Gara
          </p>
        </button>

        {/* Shortcut 6: Trip Cost Calculator */}
        <button
          onClick={onOpenTripCalc}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-950/60 to-slate-900 border border-teal-800/60 hover:border-teal-500/80 text-left transition-all group shadow-md active:scale-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Navigation className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">
              BOT
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 group-hover:text-teal-300 transition-colors">
            Dự Toán Tuyến
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            TP.HCM, VT, Phan Thiết
          </p>
        </button>

        {/* Shortcut 7: Body & Paint Quotation (Ô Tô An Bình) */}
        <button
          onClick={onOpenBodyPaintQuote}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-800/60 hover:border-rose-500/80 text-left transition-all group shadow-md active:scale-95"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4 text-rose-400" />
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              17 TR
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
            Sơn Quây & Mâm Xe
          </h4>
          <p className="text-[11px] text-rose-300 font-medium mt-0.5 truncate">
            Gara An Bình (BH 24T)
          </p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. 2-COLUMN SPLIT: SỨC KHỎE VẬT TƯ & BỘ 4 VỎ KENDA                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Health Status Bars */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visual Health Status Bars (Sức Khỏe Xe Toàn Diện) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm md:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  Thước đo sức khỏe vật tư & phụ tùng (Elantra 2023)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mô phỏng chu kỳ hao mòn kép theo khuyến cáo của Hyundai Motor
                </p>
              </div>
              <span className="text-xs text-cyan-300 font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                ODO: {formatKm(currentOdo)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {evaluatedReminders.map((rem) => {
                const isOverdue = rem.status === 'OVERDUE';
                const isDueSoon = rem.status === 'DUE_SOON';
                
                let barColor = 'bg-emerald-500';
                let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                let statusText = 'Tốt';

                if (isOverdue) {
                  barColor = 'bg-rose-500';
                  badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                  statusText = 'Quá hạn';
                } else if (isDueSoon) {
                  barColor = 'bg-amber-500';
                  badgeBg = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
                  statusText = 'Sắp đến hạn';
                }

                return (
                  <div 
                    key={rem.id} 
                    className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-2.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                          {renderItemIcon(rem.item_type)}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-1">{rem.item_type}</h4>
                          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5 font-mono">
                            <span>Đã dùng: {rem.percentKmUsed}%</span>
                            <span>•</span>
                            <span>Chu kỳ: {formatKm(rem.interval_km)}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${badgeBg}`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${Math.min(100, rem.percentKmUsed)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Mốc kế: <b className="text-slate-200 font-mono">{formatKm(rem.next_due_odo)}</b></span>
                        <span className={isOverdue ? "text-rose-400 font-bold" : "text-slate-300"}>
                          {isOverdue 
                            ? `Trễ ${Math.abs(rem.odoRemaining)} km` 
                            : `Còn ${rem.odoRemaining} km (${rem.daysRemaining} ngày)`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Parts Lifecycle Card & Urgent Reminders */}
        <div className="lg:col-span-5 space-y-5">
          {/* Urgent Reminders Banner (If Any) */}
          {urgentReminders.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>Hạng mục bảo dưỡng cần chú ý ({urgentReminders.length})</span>
                </div>
                <button 
                  onClick={() => onNavigateTab('reminders')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-0.5 font-semibold"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {urgentReminders.map(rem => (
                  <div 
                    key={rem.id} 
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                        {renderItemIcon(rem.item_type)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate">{rem.item_type}</h4>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          Mốc: <span className="font-mono text-cyan-300 font-bold">{formatKm(rem.next_due_odo)}</span> 
                          {rem.odoRemaining <= 0 ? (
                            <span className="text-rose-400 font-bold ml-1.5">(Quá hạn {Math.abs(rem.odoRemaining)} km)</span>
                          ) : (
                            <span className="text-amber-400 font-medium ml-1.5">(Còn {rem.odoRemaining} km)</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenQuickAdd('service')}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors shrink-0"
                    >
                      Bảo dưỡng
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2.6 Parts Lifecycle Card (Bộ 4 Vỏ KENDA & Hao Mòn) */}
          <div id="parts-lifecycle-section">
            <PartsLifecycleCard currentOdo={vehicle?.current_odo || 65030} />
          </div>
        </div>
      </div>
    </div>
  );
}
