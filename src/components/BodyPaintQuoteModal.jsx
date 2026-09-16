import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, Phone, MapPin, Calendar, Clock, 
  ShieldCheck, Wrench, DollarSign, ExternalLink, Image as ImageIcon,
  ChevronRight, AlertCircle, FileText, ArrowUpDown, Plus
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
        note: 'Sơn quây toàn diện chất lượng cao, xử lý đồng móp méo thân vỏ, màu đỏ camay bóng sâu.',
        isFree: false,
      },
      {
        id: 'son_mam',
        stt: 2,
        name: 'Sơn mâm (4 bánh)',
        unit: 'Cái',
        qty: 4,
        price: 2000000,
        unitPrice: 500000,
        note: 'Sơn tĩnh điện/sơn mâm thể thao 4 bánh theo tông màu xe hoặc đen bóng.',
        isFree: false,
      },
      {
        id: 'long_ve',
        stt: 3,
        name: 'Hóa nhựa lòng vè sau (chai phủ gốc nước, ONZCA)',
        unit: 'Cái',
        qty: 2,
        price: 3000000,
        unitPrice: 1500000,
        note: 'Phủ hợp chất hóa nhựa gốc nước ONZCA cao cấp, chống ồn hốc bánh, chống đá văng rỉ sét.',
        isFree: false,
      },
      {
        id: 'don_noi_that',
        stt: 4,
        name: 'Dọn vệ sinh nội thất chuyên sâu (Khuyến mãi tặng kèm)',
        unit: 'Lần',
        qty: 1,
        price: 0,
        note: 'Hút bụi, khử mùi diệt khuẩn ozon, dưỡng da ghế và taplo cao cấp.',
        isFree: true,
      }
    ]
  };

  // Garages comparison data
  const comparisonGarages = [
    {
      id: 'an_binh',
      name: 'Ô Tô An Bình (Biên Hòa)',
      location: 'Tam Hiệp, Biên Hòa, Đồng Nai',
      paintQuote: 12000000,
      rimQuote: 2000000,
      fenderQuote: 3000000,
      cleaning: 0, // Free
      total: 17000000,
      time: '7 - 10 ngày',
      warranty: '24 tháng (2 năm)',
      highlight: 'Giá tốt nhất, bảo hành sơn 2 năm rất dài, tặng dọn nội thất.',
      isRecommended: true,
    },
    {
      id: '1car_gara',
      name: '1Car Gara Chuyên Nghiệp',
      location: 'Biên Hòa, Đồng Nai',
      paintQuote: 14500000,
      rimQuote: 2400000,
      fenderQuote: 3200000,
      cleaning: 800000,
      total: 20900000,
      time: '6 - 8 ngày',
      warranty: '12 tháng (1 năm)',
      highlight: 'Xưởng sơn buồng kín, phòng sấy hồng ngoại.',
      isRecommended: false,
    },
    {
      id: 'hyundai_ngoc_phat',
      name: 'Hyundai Ngọc Phát (Đại Lý Hãng)',
      location: 'Amata / Long Bình, Biên Hòa',
      paintQuote: 18500000,
      rimQuote: 3200000,
      fenderQuote: 3800000,
      cleaning: 1200000,
      total: 26700000,
      time: '10 - 14 ngày',
      warranty: '12 tháng (1 năm)',
      highlight: 'Chuẩn màu sơn mã gốc Hãng, phòng sấy tiêu chuẩn Hyundai Motor.',
      isRecommended: false,
    }
  ];

  const toggleItem = (itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const calculatedTotal = quoteAnBinh.items.reduce((sum, item) => {
    return selectedItems[item.id] ? sum + item.price : sum;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Dự Toán & Đối Chiếu Báo Giá Sơn Thân Vỏ
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Đỏ Camay
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sơn quây nguyên xe • Sơn mâm • Hóa nhựa lòng vè ONZCA • {vehicle?.license_plate || '60K-228.98'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-2 border-b border-slate-800 bg-slate-950/60 overflow-x-auto">
          {[
            { id: 'quote_anbinh', label: '📄 Báo giá Ô Tô An Bình', badge: '17.000.000 đ' },
            { id: 'comparison', label: '⚖️ So sánh đối chiếu 3 Gara', badge: 'Tiết kiệm ~9.7tr' },
            { id: 'original_doc', label: '🖼️ Xem ảnh phiếu báo giá gốc' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3.5 py-2.5 rounded-t-xl font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-rose-400 text-rose-300 bg-rose-500/10 font-bold' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* TAB 1: BÁO GIÁ Ô TÔ AN BÌNH */}
          {activeTab === 'quote_anbinh' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Garage Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-inner space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Đơn vị báo giá:</span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {quoteAnBinh.garage_name}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {quoteAnBinh.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${quoteAnBinh.hotline.replace(/\s/g, '')}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{quoteAnBinh.hotline}</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Khách hàng:</span>
                    <strong className="text-slate-200">{quoteAnBinh.customer}</strong>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Thời gian thi công:</span>
                    <strong className="text-cyan-300">{quoteAnBinh.delivery_time}</strong>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Bảo hành sơn:</span>
                    <strong className="text-emerald-400">{quoteAnBinh.warranty_paint}</strong>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Hiệu lực báo giá:</span>
                    <strong className="text-amber-300">{quoteAnBinh.validity_days} ngày</strong>
                  </div>
                </div>
              </div>

              {/* Items Breakdown Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-rose-400" />
                    Chi tiết các hạng mục (Bấm để chọn/bỏ chọn tính tổng):
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {Object.values(selectedItems).filter(Boolean).length}/{quoteAnBinh.items.length} mục chọn
                  </span>
                </div>

                <div className="space-y-2">
                  {quoteAnBinh.items.map((item) => {
                    const isSelected = selectedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-slate-950/80 border-rose-500/40 shadow-md shadow-rose-500/5'
                            : 'bg-slate-950/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-slate-700 bg-slate-800 cursor-pointer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-100">
                                {item.stt}. {item.name}
                              </span>
                              {item.isFree && (
                                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  TẶNG MIỄN PHÍ
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                              {item.note}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                              <span>Số lượng: <b className="text-slate-300">{item.qty} {item.unit}</b></span>
                              {item.unitPrice && (
                                <span>• Đơn giá: <b className="text-slate-300">{formatCurrency(item.unitPrice)}/{item.unit}</b></span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-sm font-bold font-mono ${item.isFree ? 'text-emerald-400' : 'text-slate-100'}`}>
                            {item.isFree ? '0 đ' : formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Tổng dự toán theo các mục đã chọn:
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-extrabold text-white">
                      {formatCurrency(calculatedTotal)}
                    </span>
                    <span className="text-xs text-slate-400">(Chưa bao gồm VAT)</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Được bảo hành chất lượng nước sơn 24 tháng chính thức
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <ArrowUpDown className="w-4 h-4 text-cyan-400" />
                    <span>Xem đối chiếu gara khác</span>
                  </button>
                </div>
              </div>

              {/* Terms and Notes from Receipt */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2 text-xs">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Quy định & Chính sách từ Gara Ô Tô An Bình:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                  <li>Báo giá có giá trị trong vòng <strong className="text-slate-200">15 ngày</strong> kể từ ngày 16/09/2026.</li>
                  <li><strong className="text-emerald-400">Bảo hành sơn 24 tháng</strong>: Áp dụng cho các lỗi kỹ thuật như bong tróc, không đồng đều màu, xuống màu hoặc lỗi liên quan đến chất lượng sơn trong quá trình thi công.</li>
                  <li>Phụ tùng thay thế bảo hành 3 tháng hoặc 5.000 km.</li>
                  <li>Đối với trường hợp đặt hàng, quý khách vui lòng cọc trước 50% giá trị phụ tùng/vật tư.</li>
                  <li>Những chi phí phát sinh ngoài phần báo giá sẽ được thông báo sau khi đã kiểm tra trực tiếp xe.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: SO SÁNH ĐỐI CHIẾU 3 GARA */}
          {activeTab === 'comparison' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-2xl text-xs text-cyan-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Bảng đối chiếu tổng hợp giúp anh Tuấn cân đối giữa <b>Gara ngoài chuyên đồng sơn (An Bình)</b>, <b>Xưởng tư nhân (1Car)</b> và <b>Đại lý Hãng (Hyundai Ngọc Phát)</b>.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {comparisonGarages.map((g) => (
                  <div
                    key={g.id}
                    className={`rounded-2xl p-4 border flex flex-col justify-between space-y-3 transition-all ${
                      g.isRecommended
                        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-rose-500/50 shadow-xl shadow-rose-500/10 ring-1 ring-rose-500/30'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          g.isRecommended
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {g.isRecommended ? '⭐ ĐỀ XUẤT TỐI ƯU' : 'THAM KHẢO'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{g.time}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white">{g.name}</h4>
                        <p className="text-[11px] text-slate-400">{g.location}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sơn quây xe:</span>
                          <span className="font-mono text-slate-200">{formatCurrency(g.paintQuote)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sơn 4 mâm:</span>
                          <span className="font-mono text-slate-200">{formatCurrency(g.rimQuote)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hóa nhựa lòng vè:</span>
                          <span className="font-mono text-slate-200">{formatCurrency(g.fenderQuote)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dọn nội thất:</span>
                          <span className={`font-mono ${g.cleaning === 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                            {g.cleaning === 0 ? 'Miễn phí' : formatCurrency(g.cleaning)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                          <span className="text-slate-400">Bảo hành sơn:</span>
                          <span className="font-bold text-emerald-400">{g.warranty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-[11px] text-slate-400">Tổng chi phí:</span>
                        <span className={`text-base font-mono font-extrabold ${g.isRecommended ? 'text-rose-400' : 'text-slate-200'}`}>
                          {formatCurrency(g.total)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {g.highlight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Economic conclusion */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Kết luận phân tích kinh tế & bảo hành:
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Lựa chọn <b>Gara Ô Tô An Bình</b> giúp anh tiết kiệm <b>9.700.000 đ (~36%)</b> so với Hãng, đồng thời được hưởng thời gian bảo hành sơn <b>24 tháng</b> (dài gấp đôi bảo hành 12 tháng thông thường của các garage khác) và được tặng gói dọn vệ sinh nội thất chuyên sâu.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ẢNH BÁO GIÁ GỐC */}
          {activeTab === 'original_doc' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Phiếu báo giá sửa chữa chính thức từ Ô Tô An Bình (Biên Hòa - 16/09/2026):
                </span>
                <a
                  href="/bao_gia_o_to_an_binh.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở ảnh tab mới
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center p-2">
                <img
                  src="/bao_gia_o_to_an_binh.jpg"
                  alt="Phiếu Báo Giá Ô Tô An Bình 17.000.000 đ"
                  className="w-full h-auto rounded-xl object-contain max-h-[550px]"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Tổng dự kiến: <b className="text-white font-mono">{formatCurrency(calculatedTotal)}</b> • Sơn quây đỏ camay & mâm & lòng vè
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:0985074112"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi Gara An Bình (0985.074.112)</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
