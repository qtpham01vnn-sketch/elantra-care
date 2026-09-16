import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, Phone, MapPin, Calendar, Clock, 
  ShieldCheck, Wrench, DollarSign, ExternalLink, Image as ImageIcon,
  ChevronRight, AlertCircle, FileText, ArrowUpDown, Plus, Edit2, Info
} from 'lucide-react';
import { formatCurrency } from '../services/vehicleService';

export default function BodyPaintQuoteModal({ isOpen, onClose, vehicle }) {
  const [activeTab, setActiveTab] = useState('quote_anbinh'); // quote_anbinh, comparison, original_doc
  const [selectedItems, setSelectedItems] = useState({
    son_quay: true,
    son_mam: true,
    long_ve: true,
    don_noi_that: true,
  });

  // State for editable comparison garages
  const [garages, setGarages] = useState([
    {
      id: 'an_binh',
      name: 'Ô Tô An Bình (Biên Hòa)',
      location: 'Tam Hiệp, Biên Hòa, Đồng Nai',
      sourceType: 'OFFICIAL_RECEIPT', // Phiếu thực tế có giấy tờ
      sourceLabel: 'Phiếu báo giá gốc thực tế (16/09/2026)',
      paintQuote: 12000000,
      rimQuote: 2000000,
      fenderQuote: 3000000,
      cleaning: 0, // Free
      total: 17000000,
      time: '7 - 10 ngày',
      warranty: '24 tháng (2 năm)',
      highlight: 'Giá trọn gói tốt nhất, bảo hành sơn 2 năm rất dài, tặng dọn nội thất.',
      isRecommended: true,
    },
    {
      id: '1car_gara',
      name: '1Car Gara Chuyên Nghiệp',
      location: 'Biên Hòa, Đồng Nai',
      sourceType: 'ESTIMATED_MARKET', // Ước tính thị trường
      sourceLabel: 'Ước tính theo giá thị trường gara tư nhân',
      paintQuote: 14500000,
      rimQuote: 2400000,
      fenderQuote: 3200000,
      cleaning: 800000,
      total: 20900000,
      time: '6 - 8 ngày',
      warranty: '12 tháng (1 năm)',
      highlight: 'Xưởng sơn phòng kín tiêu chuẩn tư nhân.',
      isRecommended: false,
    },
    {
      id: 'hyundai_ngoc_phat',
      name: 'Hyundai Ngọc Phát (Đại Lý Hãng)',
      location: 'Amata / Long Bình, Biên Hòa',
      sourceType: 'ESTIMATED_MARKET', // Ước tính định mức hãng
      sourceLabel: 'Ước tính theo định mức công & sơn chính hãng',
      paintQuote: 18500000,
      rimQuote: 3200000,
      fenderQuote: 3800000,
      cleaning: 1200000,
      total: 26700000,
      time: '10 - 14 ngày',
      warranty: '12 tháng (1 năm)',
      highlight: 'Chuẩn màu sơn mã gốc Hãng, phòng sấy tiêu chuẩn Hyundai.',
      isRecommended: false,
    }
  ]);

  const [editingGarageId, setEditingGarageId] = useState(null);
  const [editTotalInput, setEditTotalInput] = useState('');

  if (!isOpen) return null;

  const quoteAnBinh = {
    garage_name: 'CÔNG TY TNHH TM DV Ô TÔ AN BÌNH',
    address: 'Số 9/2 KP.4, P. Tam Hiệp, TP. Biên Hòa, Đồng Nai',
    mst: '360 374 6788',
    hotline: '0985 074 112',
    customer: 'Mr. Tuan Pham',
    vehicle_plate: '60K-228.98',
    vehicle_model: 'Hyundai Elantra',
    date: '16/09/2026',
    validity_days: 15,
    delivery_time: '07 - 10 ngày làm việc',
    warranty_paint: '24 tháng (2 năm)',
    warranty_parts: '3 tháng hoặc 5.000 km',
    deposit_req: 'Cọc trước 50% khi duyệt thi công',
    items: [
      {
        id: 'son_quay',
        stt: 1,
        name: 'Đồng - Sơn quây nguyên xe (màu đỏ camay)',
        unit: 'Xe',
        qty: 1,
        price: 12000000,
        note: 'Sơn quây toàn diện thân vỏ, xử lý đồng móp méo, phủ bóng đỏ camay sâu bóng.',
        isFree: false,
      },
      {
        id: 'son_mam',
        stt: 2,
        name: 'Sơn 4 mâm xe',
        unit: 'Bộ',
        qty: 4,
        price: 2000000,
        unitPrice: 500000,
        note: 'Sơn làm mới 4 mâm xe thể thao (500.000 đ / cái).',
        isFree: false,
      },
      {
        id: 'long_ve',
        stt: 3,
        name: 'Hóa nhựa lòng vè sau (chai phủ gốc nước, ONZCA)',
        unit: 'Bộ',
        qty: 2,
        price: 3000000,
        unitPrice: 1500000,
        note: 'Phủ hợp chất ONZCA gốc nước chống ồn hốc bánh, chống đá văng rỉ sét (1.500.000 đ / cái).',
        isFree: false,
      },
      {
        id: 'don_noi_that',
        stt: 4,
        name: 'Dọn vệ sinh nội thất chuyên sâu (Khuyến mãi tặng kèm)',
        unit: 'Gói',
        qty: 1,
        price: 0,
        note: 'Hút bụi, khử mùi diệt khuẩn ozon, dưỡng bề mặt taplo da ghế cao cấp.',
        isFree: true,
      }
    ]
  };

  const toggleItem = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const calculatedTotal = quoteAnBinh.items.reduce((sum, item) => {
    return selectedItems[item.id] ? sum + item.price : sum;
  }, 0);

  const handleSaveEditedTotal = (garageId) => {
    const num = parseInt(editTotalInput.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setGarages(prev => prev.map(g => {
        if (g.id === garageId) {
          return {
            ...g,
            total: num,
            sourceLabel: 'Đã cập nhật theo báo giá anh nhập'
          };
        }
        return g;
      }));
    }
    setEditingGarageId(null);
    setEditTotalInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  Dự Toán Sơn Xe & Đối Chiếu Gara
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Đỏ Camay
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Sơn quây nguyên xe • Mâm • Lòng vè ONZCA • {vehicle?.license_plate || '60K-228.98'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors shrink-0"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation - Mobile-first large segmented buttons */}
        <div className="p-2 bg-slate-950/80 border-b border-slate-800">
          <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'quote_anbinh', icon: '📄', title: 'Báo Giá An Bình', sub: '17.000.000 đ' },
              { id: 'comparison', icon: '⚖️', title: 'So Sánh 3 Gara', sub: 'Đối chiếu giá' },
              { id: 'original_doc', icon: '🖼️', title: 'Ảnh Phiếu Gốc', sub: 'Xem phiếu giấy' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center justify-center text-center ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-b from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/30 font-bold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <span>{tab.icon}</span>
                  <span className="truncate">{tab.title}</span>
                </div>
                <span className={`text-[11px] sm:text-xs font-mono mt-0.5 ${activeTab === tab.id ? 'text-rose-100 font-semibold' : 'text-slate-400'}`}>
                  {tab.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
          
          {/* TAB 1: BÁO GIÁ Ô TÔ AN BÌNH */}
          {activeTab === 'quote_anbinh' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Garage Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider block">
                      Đơn vị báo giá:
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {quoteAnBinh.garage_name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      {quoteAnBinh.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${quoteAnBinh.hotline.replace(/\s/g, '')}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{quoteAnBinh.hotline}</span>
                    </a>
                  </div>
                </div>

                {/* 4 Specs Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm pt-1">
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Khách hàng:</span>
                    <strong className="text-slate-100 text-sm">{quoteAnBinh.customer}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Thời gian:</span>
                    <strong className="text-cyan-300 text-sm">{quoteAnBinh.delivery_time}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Bảo hành sơn:</span>
                    <strong className="text-emerald-400 text-sm">{quoteAnBinh.warranty_paint}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">Hiệu lực:</span>
                    <strong className="text-amber-300 text-sm">{quoteAnBinh.validity_days} ngày</strong>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" />
                    Chi tiết các hạng mục (Chạm để chọn / bỏ chọn):
                  </h4>
                  <span className="text-xs text-cyan-300 font-bold">
                    {Object.values(selectedItems).filter(Boolean).length}/{quoteAnBinh.items.length} mục
                  </span>
                </div>

                <div className="space-y-2">
                  {quoteAnBinh.items.map((item) => {
                    const isSelected = selectedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-slate-950 border-rose-500/50 shadow-md shadow-rose-500/10'
                            : 'bg-slate-950/40 border-slate-800/80 opacity-55'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-5 h-5 rounded text-rose-500 focus:ring-rose-400 border-slate-700 bg-slate-800 cursor-pointer shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-white">
                                {item.stt}. {item.name}
                              </span>
                              {item.isFree && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  TẶNG MIỄN PHÍ
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                              {item.note}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                              <span>Số lượng: <b className="text-slate-200">{item.qty} {item.unit}</b></span>
                              {item.unitPrice && (
                                <span>• Đơn giá: <b className="text-slate-200">{formatCurrency(item.unitPrice)}/{item.unit}</b></span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pt-0.5">
                          <span className={`text-base sm:text-lg font-bold font-mono ${item.isFree ? 'text-emerald-400' : 'text-slate-100'}`}>
                            {item.isFree ? '0 đ' : formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-amber-950/40 border border-rose-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                <div>
                  <span className="text-xs text-slate-300 block font-medium">
                    Tổng dự toán theo các mục anh chọn:
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                      {formatCurrency(calculatedTotal)}
                    </span>
                    <span className="text-xs text-slate-400">(Chưa bao gồm VAT)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-400 mt-1 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Bảo hành chất lượng sơn 24 tháng chính thức
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('comparison')}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowUpDown className="w-4 h-4 text-cyan-400" />
                  <span>Đối chiếu giá các gara</span>
                </button>
              </div>

              {/* Terms and Notes from Receipt */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs sm:text-sm">
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Quy định & Bảo hành từ Gara Ô Tô An Bình:
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-xs sm:text-sm leading-relaxed">
                  <li>Báo giá có giá trị trong vòng <strong className="text-white">15 ngày</strong> kể từ ngày 16/09/2026.</li>
                  <li><strong className="text-emerald-400">Bảo hành sơn 24 tháng</strong>: Áp dụng cho các lỗi kỹ thuật như bong tróc, không đồng đều màu, xuống màu hoặc lỗi liên quan đến chất lượng sơn trong quá trình thi công.</li>
                  <li>Phụ tùng thay thế bảo hành 3 tháng hoặc 5.000 km.</li>
                  <li>Cọc trước 50% giá trị phụ tùng khi đặt hàng thi công.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: SO SÁNH ĐỐI CHIẾU 3 GARA */}
          {activeTab === 'comparison' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Explanation Note on Data Sources */}
              <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-2xl text-xs sm:text-sm text-cyan-200 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  Nguồn gốc số liệu bảng đối chiếu:
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  • <b>Gara Ô Tô An Bình:</b> Lấy chính xác 100% từ phiếu báo giá giấy của xưởng (17.000.000 đ).<br />
                  • <b>1Car Gara & Hyundai Ngọc Phát:</b> Là giá ước tính tham khảo theo mặt bằng chung thị trường Biên Hòa & định mức giờ công hãng. Anh có thể bấm nút <b>"Chỉnh sửa"</b> bên dưới để nhập số tiền thực tế nếu anh hỏi giá thêm từ các gara khác nhé!
                </p>
              </div>

              {/* 3 Garages Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {garages.map((g) => (
                  <div
                    key={g.id}
                    className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between space-y-3.5 transition-all ${
                      g.isRecommended
                        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-rose-500/60 shadow-xl shadow-rose-500/10 ring-1 ring-rose-500/40'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          g.isRecommended
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {g.isRecommended ? '⭐ BÁO GIÁ THỰC TẾ' : 'GIÁ THAM KHẢO'}
                        </span>
                        <span className="text-xs text-slate-300 font-mono">{g.time}</span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white">{g.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{g.location}</p>
                        <p className="text-[11px] text-cyan-300 font-mono mt-1">{g.sourceLabel}</p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-800 space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sơn quây xe:</span>
                          <span className="font-mono font-semibold text-slate-200">{formatCurrency(g.paintQuote)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sơn 4 mâm:</span>
                          <span className="font-mono font-semibold text-slate-200">{formatCurrency(g.rimQuote)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hóa nhựa lòng vè:</span>
                          <span className="font-mono font-semibold text-slate-200">{formatCurrency(g.fenderQuote)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dọn nội thất:</span>
                          <span className={`font-mono font-semibold ${g.cleaning === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                            {g.cleaning === 0 ? 'Miễn phí' : formatCurrency(g.cleaning)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1.5 border-t border-slate-800 text-xs sm:text-sm">
                          <span className="text-slate-400 font-medium">Bảo hành sơn:</span>
                          <span className="font-bold text-emerald-400">{g.warranty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      {editingGarageId === g.id ? (
                        <div className="space-y-2">
                          <span className="text-xs text-slate-300 block font-medium">Nhập tổng tiền báo giá mới:</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editTotalInput}
                              onChange={(e) => setEditTotalInput(e.target.value)}
                              placeholder="Ví dụ: 19000000"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-500 text-white text-xs font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEditedTotal(g.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingGarageId(null)}
                              className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="text-xs text-slate-400">Tổng chi phí:</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-lg sm:text-xl font-mono font-extrabold ${g.isRecommended ? 'text-rose-400' : 'text-slate-100'}`}>
                                {formatCurrency(g.total)}
                              </span>
                              {!g.isRecommended && (
                                <button
                                  onClick={() => {
                                    setEditingGarageId(g.id);
                                    setEditTotalInput(g.total.toString());
                                  }}
                                  className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                                  title="Chỉnh sửa số tiền theo báo giá mới của anh"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-snug mt-1">
                            {g.highlight}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Economic conclusion */}
              <div className="p-4 sm:p-5 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl space-y-1.5">
                <div className="font-bold text-emerald-300 text-sm sm:text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Đánh giá kinh tế & bảo hành:
                </div>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                  Lựa chọn <b>Gara Ô Tô An Bình</b> giúp anh tiết kiệm <b>9.700.000 đ (~36%)</b> so với Hãng, đồng thời được hưởng thời gian bảo hành sơn lên đến <b>24 tháng</b> (dài gấp đôi so với 12 tháng thông thường) và được tặng kèm gói dọn vệ sinh nội thất chuyên sâu.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ẢNH BÁO GIÁ GỐC */}
          {activeTab === 'original_doc' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs sm:text-sm text-slate-300">
                  Phiếu báo giá sửa chữa chính thức Ô Tô An Bình (Biên Hòa - 16/09/2026):
                </span>
                <a
                  href="/bao_gia_o_to_an_binh.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-bold"
                >
                  <ExternalLink className="w-4 h-4" /> Mở ảnh toàn màn hình
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center p-1 sm:p-2 shadow-2xl">
                <img
                  src="/bao_gia_o_to_an_binh.jpg"
                  alt="Phiếu Báo Giá Ô Tô An Bình 17.000.000 đ"
                  className="w-full h-auto rounded-xl object-contain max-h-[600px]"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-slate-300">
            Dự kiến: <b className="text-white font-mono text-sm sm:text-base">{formatCurrency(calculatedTotal)}</b> • Sơn quây đỏ camay & mâm & lòng vè
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:0985074112"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Gara An Bình (0985.074.112)</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors active:scale-95"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
