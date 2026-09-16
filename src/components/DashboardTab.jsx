import React from 'react';
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
  Sparkles,
  FileText,
  Shield,
  Navigation,
  PhoneCall,
  RotateCw,
  CreditCard,
  QrCode,
  AlertOctagon,
  Calendar
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
  // Tính toán KPI Tổng hợp
  const totalFuelCost = fuelLogs.reduce((acc, f) => acc + (f.total_cost || 0), 0);
  const totalServiceCost = serviceLogs.reduce((acc, s) => acc + (s.total_amount || 0), 0);
  const totalOtherExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const grandTotal = totalFuelCost + totalServiceCost + totalOtherExpenses;

  // Chi phí trên km (Cost/km)
  const costPerKm = vehicle.current_odo > 0 ? Math.round(grandTotal / vehicle.current_odo) : 0;

  // Mức tiêu thụ TB gần nhất (Fuelio)
  const validFuelEntries = fuelLogs.filter(f => f.consumption_l_100km > 0);
  const avgFuelEconomy = validFuelEntries.length > 0
    ? (validFuelEntries.reduce((acc, f) => acc + f.consumption_l_100km, 0) / validFuelEntries.length).toFixed(2)
    : '7.30';

  // Tính trạng thái các hạng mục bảo dưỡng kép
  const evaluatedReminders = reminders.map(r => calculateReminderStatus(r, vehicle.current_odo));
  const urgentReminders = evaluatedReminders.filter(r => r.status === 'OVERDUE' || r.status === 'DUE_SOON');

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
      {/* 1. Hero Vehicle Status & Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1.1 Hero Vehicle Status Card */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <Wrench className="w-64 h-64 text-cyan-400" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {vehicle.license_plate}
              </span>
              <span className="text-xs text-slate-400">Hyundai Elantra {vehicle.year}</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {formatKm(vehicle.current_odo)}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Tình trạng xe: <strong className={urgentReminders.length > 0 ? "text-amber-400" : "text-emerald-400"}>
                {urgentReminders.length > 0 ? `Cần lưu ý (${urgentReminders.length} mục)` : 'Hoạt động hoàn hảo'}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4 relative z-10">
            <button
              onClick={() => onOpenQuickAdd('fuel')}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all active:scale-95"
            >
              <Fuel className="w-4 h-4" />
              <span>Đổ xăng</span>
            </button>
            <button
              onClick={() => onOpenQuickAdd('service')}
              className="flex-1 flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>Ghi bảo dưỡng</span>
            </button>
          </div>
        </div>

        {/* 1.2 Key Metrics Bar (Fuelio & Drivvo KPIs) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Metric 1: Cost / km */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Chi phí / km</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-white tracking-tight">
                {costPerKm.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-400">đ/km</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Xăng + bảo dưỡng</p>
            </div>
          </div>

          {/* Metric 2: Fuel Economy */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Tiêu hao TB</span>
              <Fuel className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-xl font-bold text-emerald-400 tracking-tight">
                {avgFuelEconomy} <span className="text-xs font-normal text-slate-400">L/100km</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Chuẩn Full-Tank</p>
            </div>
          </div>

          {/* Metric 3: Total Service Spend */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Tổng bảo dưỡng</span>
              <Wrench className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold text-slate-100 tracking-tight">
                {formatCurrency(totalServiceCost)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{serviceLogs.length} lần vào xưởng</p>
            </div>
          </div>

          {/* Metric 4: Total Ownership Spend */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-medium">Tổng chi phí TCO</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold text-amber-300 tracking-tight">
                {formatCurrency(grandTotal)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Toàn bộ chi phí xe</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2.4 Next Service Appointment Mini Banner (Mốc 70.000 km) */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/40 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Hẹn Bảo Dưỡng Lần Sau: 70.023 KM
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  CẤP 1 NHỎ
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ngày hẹn: <strong className="text-slate-200">16/01/2027</strong> • Gara: <strong className="text-cyan-300">Hyundai Ngọc Phát</strong> (CVDV Cao Nguyên - 0358455495)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Dự toán chi phí</span>
              <span className="text-sm font-mono font-bold text-emerald-400">~1.150.000 đ</span>
            </div>
            <button
              onClick={() => onNavigateTab('reminders')}
              className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
            >
              <span>Chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2.5 Quick Feature Shortcuts Grid (7 tiện ích chuyên sâu) */}
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

      {/* 2.6 Responsive 2-Column Split for Desktop Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Next Service & Health Bars */}
        <div className="lg:col-span-7 space-y-5">
          {/* 2.4 Next Service Appointment Mini Banner (Mốc 70.000 km) */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/40 rounded-3xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      Hẹn Bảo Dưỡng Lần Sau: 70.023 KM
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      CẤP 1 NHỎ
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Ngày hẹn: <strong className="text-white">16/01/2027</strong> • Gara: <strong className="text-cyan-300">Hyundai Ngọc Phát</strong> (CVDV Cao Nguyên - 0358455495)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Dự toán chi phí</span>
                  <span className="text-base font-mono font-bold text-emerald-400">~1.150.000 đ</span>
                </div>
                <button
                  onClick={() => onNavigateTab('reminders')}
                  className="px-3.5 py-2 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Visual Health Status Bars (Sức Khỏe Xe Toàn Diện) */}
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
                ODO: {formatKm(vehicle.current_odo)}
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
