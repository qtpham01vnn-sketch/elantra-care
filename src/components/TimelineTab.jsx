import React, { useState } from 'react';
import { 
  Wrench, 
  Fuel, 
  Receipt, 
  Calendar, 
  ChevronRight, 
  Filter, 
  Search, 
  Building, 
  ShieldCheck, 
  Sparkles,
  DollarSign,
  Printer
} from 'lucide-react';
import { formatCurrency, formatKm } from '../services/vehicleService';
import ServiceDetailModal from './ServiceDetailModal';
import { Navigation } from 'lucide-react';

export default function TimelineTab({ 
  serviceLogs, 
  fuelLogs, 
  expenses, 
  currentOdo,
  onOpenQuickAdd,
  onOpenExport,
  onOpenTripCalc
}) {
  const [filterType, setFilterType] = useState('ALL'); // ALL, SERVICE, SERVICE_HANG, SERVICE_GARA, FUEL, EXPENSE
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  // Hợp nhất toàn bộ các dòng nhật ký thành một dòng thời gian duy nhất
  const combinedLogs = [
    ...serviceLogs.map(s => ({ 
      ...s, 
      log_type: 'SERVICE', 
      sub_type: s.garage_type === 'HANG' ? 'SERVICE_HANG' : 'SERVICE_GARA',
      date: s.service_date 
    })),
    ...fuelLogs.map(f => ({ ...f, log_type: 'FUEL', sub_type: 'FUEL', date: f.fuel_date })),
    ...expenses.map(e => ({ ...e, log_type: 'EXPENSE', sub_type: 'EXPENSE', date: e.expense_date })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date) || b.odo - a.odo);

  // Lọc theo danh mục và tìm kiếm
  const filteredLogs = combinedLogs.filter(log => {
    if (filterType !== 'ALL') {
      if (filterType === 'SERVICE' && log.log_type !== 'SERVICE') return false;
      if (filterType === 'SERVICE_HANG' && log.sub_type !== 'SERVICE_HANG') return false;
      if (filterType === 'SERVICE_GARA' && log.sub_type !== 'SERVICE_GARA') return false;
      if (filterType === 'FUEL' && log.log_type !== 'FUEL') return false;
      if (filterType === 'EXPENSE' && log.log_type !== 'EXPENSE') return false;
    }
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (log.log_type === 'SERVICE') {
      return (
        log.garage_name?.toLowerCase().includes(query) ||
        log.notes?.toLowerCase().includes(query) ||
        log.items?.some(it => it.item_name.toLowerCase().includes(query))
      );
    }
    if (log.log_type === 'FUEL') {
      return log.gas_station?.toLowerCase().includes(query) || log.notes?.toLowerCase().includes(query);
    }
    if (log.log_type === 'EXPENSE') {
      return log.title?.toLowerCase().includes(query) || log.category?.toLowerCase().includes(query);
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Search & Filter Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Lịch Sử & Nhật Ký Hoạt Động (Timeline)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hồ sơ bảo dưỡng hãng, sửa chữa gara và nhật ký vận hành
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTripCalc}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Dự toán Tuyến</span>
            </button>

            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Xuất sổ PDF</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo phụ tùng, trạm xăng, garage (vd: Hyundai Ngọc Phát, 1Car, lọc xăng...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'ALL', label: 'Tất cả nhật ký' },
            { id: 'SERVICE_HANG', label: 'Chính Hãng Hyundai' },
            { id: 'SERVICE_GARA', label: 'Gara Ngoài (1Car)' },
            { id: 'FUEL', label: 'Lịch sử đổ xăng' },
            { id: 'EXPENSE', label: 'Chi phí khác' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                filterType === f.id
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 font-semibold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-800/80 before:z-0">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 text-slate-400 text-xs">
            Không tìm thấy nhật ký nào phù hợp với bộ lọc.
          </div>
        ) : (
          filteredLogs.map((log) => {
            // RENDER SERVICE LOG (Bảo Dưỡng / Sửa Chữa)
            if (log.log_type === 'SERVICE') {
              const isHang = log.garage_type === 'HANG';
              const mandatoryCount = log.items?.filter(it => it.is_mandatory !== false).length || 0;
              const optionalCount = log.items?.filter(it => it.is_mandatory === false).length || 0;

              return (
                <div 
                  key={log.id} 
                  onClick={() => setSelectedService(log)}
                  className="relative z-10 ml-8 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 shadow-sm hover:shadow-cyan-500/10 transition-all cursor-pointer group"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-8 top-4 w-5 h-5 rounded-full flex items-center justify-center -translate-x-1/2 ${
                    isHang ? 'bg-blue-500 text-white shadow-md shadow-blue-500/40' : 'bg-amber-500 text-white shadow-md shadow-amber-500/40'
                  }`}>
                    <Wrench className="w-2.5 h-2.5" />
                  </div>

                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          isHang 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isHang ? 'Hãng Hyundai' : 'Gara Ngoài'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{log.service_date}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-cyan-300 font-mono font-semibold">{formatKm(log.odo)}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-100 block font-mono">
                          {formatCurrency(log.total_amount)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {log.garage_name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {log.notes || `${log.items?.length || 0} hạng mục phụ tùng & dịch vụ`}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    {/* Items Preview & Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/60">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {log.items?.slice(0, 3).map((it, idx) => (
                          <span 
                            key={idx} 
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                          >
                            {it.item_name.split('(')[0]}
                          </span>
                        ))}
                        {log.items?.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400">
                            +{log.items.length - 3} mục khác
                          </span>
                        )}
                      </div>

                      {optionalCount > 0 && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                          <Sparkles className="w-2.5 h-2.5" /> Có {optionalCount} gói phụ gia
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // RENDER FUEL LOG (Đổ Xăng - Fuelio Style)
            if (log.log_type === 'FUEL') {
              return (
                <div 
                  key={log.id} 
                  className="relative z-10 ml-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-4 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center -translate-x-1/2 shadow-md shadow-emerald-500/40">
                    <Fuel className="w-2.5 h-2.5" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Đổ Xăng {log.is_full_tank && '• Đầy bình'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{log.fuel_date}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-cyan-300 font-mono font-semibold">{formatKm(log.odo)}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-400 block font-mono">
                          {formatCurrency(log.total_cost)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Lượng xăng</span>
                        <span className="text-slate-200 font-bold">{log.liters} Lít</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Đơn giá</span>
                        <span className="text-slate-300">{log.price_per_liter?.toLocaleString('vi-VN')} đ/L</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Mức tiêu thụ</span>
                        <span className="text-emerald-400 font-bold">
                          {log.consumption_l_100km ? `${log.consumption_l_100km} L/100km` : '--'}
                        </span>
                      </div>
                    </div>

                    {log.gas_station && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        📍 {log.gas_station}
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            // RENDER EXPENSE LOG (Chi Phí Vận Hành Khác)
            return (
              <div 
                key={log.id} 
                className="relative z-10 ml-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-8 top-4 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center -translate-x-1/2 shadow-md shadow-purple-500/40">
                  <DollarSign className="w-2.5 h-2.5" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {log.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{log.expense_date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 mt-1">{log.title}</h4>
                    {log.notes && <p className="text-[11px] text-slate-400 mt-0.5">{log.notes}</p>}
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-purple-300 block font-mono">
                      {formatCurrency(log.amount)}
                    </span>
                    {log.odo && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatKm(log.odo)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </div>
  );
}
