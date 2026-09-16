import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  Check, 
  AlertCircle,
  HelpCircle,
  Plus,
  Minus,
  ArrowRight,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, formatKm } from '../services/vehicleService';

export const DEFAULT_SERVICE_ITEMS = [
  { id: 'oil-5w30', name: 'Dầu nhớt động cơ Hyundai Shell Helix 5W-30 (4.5L)', cost: 936000, isSelected: true, isMandatory: true, category: 'STANDARD' },
  { id: 'gasket', name: 'Gioăng ốc xả nhớt đáy các-te', cost: 15000, isSelected: true, isMandatory: true, category: 'STANDARD' },
  { id: 'labor', name: 'Công thợ bảo dưỡng Cấp 1 + Rửa xe hút bụi', cost: 200000, isSelected: true, isMandatory: true, category: 'STANDARD' },
  { id: 'inspection', name: 'Kiểm tra & xịt bụi lọc gió động cơ / cabin (Miễn phí)', cost: 0, isSelected: true, isMandatory: true, category: 'STANDARD' },
  { id: 'oil-filter', name: 'Lọc nhớt động cơ Mobis chính hãng (2630035505)', cost: 65000, isSelected: false, isMandatory: false, category: 'RECOMMENDED' },
  { id: 'brake-service', name: 'Bảo dưỡng phanh 4 bánh & tra mỡ ắc thắng SR500', cost: 180000, isSelected: false, isMandatory: false, category: 'RECOMMENDED' },
  { id: 'engine-flush', name: 'Phụ gia súc rửa cặn động cơ (Engine Flush)', cost: 220000, isSelected: false, isMandatory: false, category: 'ADDITIVE' },
  { id: 'fuel-additive', name: 'Phụ gia vệ sinh kim phun xăng đổ bình', cost: 165000, isSelected: false, isMandatory: false, category: 'ADDITIVE' },
];

export default function NextServiceEstimatorCard({ currentOdo = 65030, onAddService }) {
  const [items, setItems] = useState(DEFAULT_SERVICE_ITEMS);
  const milestoneOdo = 70023;
  const kmRemaining = Math.max(0, milestoneOdo - currentOdo);

  const handleToggleItem = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    }));
  };

  const handleSelectPackage = (type) => {
    if (type === 'ESSENTIAL') {
      // Gói tiêu chuẩn tối thiểu
      setItems(prev => prev.map(item => ({
        ...item,
        isSelected: item.category === 'STANDARD'
      })));
    } else if (type === 'STANDARD_PLUS') {
      // Gói kèm lọc nhớt & phanh
      setItems(prev => prev.map(item => ({
        ...item,
        isSelected: item.category === 'STANDARD' || item.category === 'RECOMMENDED'
      })));
    } else if (type === 'FULL') {
      // Toàn bộ gồm cả phụ gia
      setItems(prev => prev.map(item => ({
        ...item,
        isSelected: true
      })));
    }
  };

  const selectedItems = items.filter(it => it.isSelected);
  const totalCost = selectedItems.reduce((acc, it) => acc + (it.cost || 0), 0);
  const savedComparedToFull = items.reduce((acc, it) => acc + it.cost, 0) - totalCost;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Dự Toán Bảo Dưỡng Lần Tới (Mốc 70.000 KM)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                TÍNH TIỀN TỰ ĐỘNG
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Chọn / bỏ chọn từng phụ tùng để app tự động tính chính xác số tiền theo giá hãng niêm yết
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

      {/* Package Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] whitespace-nowrap">Chọn nhanh gói:</span>
        <button
          onClick={() => handleSelectPackage('ESSENTIAL')}
          className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-semibold whitespace-nowrap transition-all"
        >
          🟢 Tiết Kiệm Chuẩn Hãng (~1.15tr)
        </button>
        <button
          onClick={() => handleSelectPackage('STANDARD_PLUS')}
          className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl font-semibold whitespace-nowrap transition-all"
        >
          🔵 Thêm Lọc Nhớt & Phanh (~1.39tr)
        </button>
        <button
          onClick={() => handleSelectPackage('FULL')}
          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl font-semibold whitespace-nowrap transition-all"
        >
          🟣 Full Phụ Gia (~1.78tr)
        </button>
      </div>

      {/* Main Breakdown & Interactive Checkboxes */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            Danh mục phụ tùng & dịch vụ ({selectedItems.length}/{items.length} mục đã chọn):
          </span>
          <span className="text-slate-400 text-[11px]">Bấm vào ô để chọn/bỏ chọn</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                item.isSelected 
                  ? 'bg-gradient-to-r from-slate-900 to-indigo-950/60 border-indigo-500/50 shadow-md' 
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <input
                  type="checkbox"
                  checked={item.isSelected}
                  onChange={() => handleToggleItem(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer shrink-0"
                />
                <div className="truncate">
                  <h5 className={`text-xs font-semibold truncate ${item.isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {item.name}
                  </h5>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {item.category === 'STANDARD' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        Bắt buộc
                      </span>
                    )}
                    {item.category === 'RECOMMENDED' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                        Khuyến nghị
                      </span>
                    )}
                    {item.category === 'ADDITIVE' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                        Phụ gia thêm
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-mono font-bold ${item.isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {item.cost > 0 ? formatCurrency(item.cost) : '0 đ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Summary Card */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-400 block">Tổng số tiền dự kiến theo lựa chọn:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-black text-emerald-400">
              {formatCurrency(totalCost)}
            </span>
            <span className="text-xs text-slate-400 font-sans">
              (Gồm VAT 8% tại Hyundai Ngọc Phát)
            </span>
          </div>
          {savedComparedToFull > 0 && (
            <p className="text-[11px] text-cyan-300 mt-0.5">
              💡 Đã tối ưu tiết kiệm: <b>{formatCurrency(savedComparedToFull)}</b> so với việc làm full toàn bộ phụ gia.
            </p>
          )}
        </div>

        <button
          onClick={() => {
            if (onAddService) {
              onAddService({
                item_type: 'Bảo dưỡng Cấp 1 (70.000 KM)',
                estimated_cost: totalCost,
                selected_items: selectedItems
              });
            }
          }}
          className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95 whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Lưu gói này vào kế hoạch</span>
        </button>
      </div>
    </div>
  );
}
