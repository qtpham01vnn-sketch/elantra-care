import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Calendar, 
  Hash, 
  Cpu, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Sparkles, 
  Building, 
  ExternalLink,
  Info,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatKm } from '../services/vehicleService';

export const REAL_GARAGE_ROADMAP = [
  {
    date: '2022-12-07',
    time: '09:50',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ mốc 1.000 km đầu tiên',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Kiểm tra siết ốc toàn xe, thay dầu rà máy đầu tiên sau xuất xưởng.'
  },
  {
    date: '2023-02-14',
    time: '09:34',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ mốc 5.000 km',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Thay dầu nhớt động cơ chính hãng, kiểm tra các mức dung dịch.'
  },
  {
    date: '2023-03-18',
    time: '18:23',
    type: 'WARRANTY',
    title: 'Bảo hành theo bản tin kỹ thuật nhà máy',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Cập nhật phần mềm ECU / kiểm tra kỹ thuật miễn phí theo chiến dịch Hyundai.'
  },
  {
    date: '2023-07-29',
    time: '17:09',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ & Kiểm tra còi',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Bảo dưỡng cấp nhỏ 10.000 km, xử lý còi kêu chập chờn.'
  },
  {
    date: '2023-11-14',
    time: '11:16',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ mốc 15.745 km',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Thay nhớt động cơ, lọc nhớt, vệ sinh lọc gió động cơ & điều hòa.'
  },
  {
    date: '2023-11-29',
    time: '15:22',
    type: 'REPAIR',
    title: 'Kiểm tra còi không kêu',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Kiểm tra relay còi, vệ sinh tiếp điểm giắc cắm.'
  },
  {
    date: '2024-01-29',
    time: '17:17',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ mốc 21.750 km (Cấp 2)',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Thay nhớt máy, lọc nhớt, thay lọc gió điều hòa, bảo dưỡng phanh 4 bánh.'
  },
  {
    date: '2024-06-29',
    time: '11:37',
    type: 'INSPECTION',
    title: 'Kiểm tra miễn phí Test K/máy',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Kiểm tra hệ thống điều hòa, quét lỗi chẩn đoán G-Scan.'
  },
  {
    date: '2024-08-28',
    time: '13:34',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ mốc 30.000 km',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Thay nhớt động cơ, lọc nhớt, đảo lốp cân mâm.'
  },
  {
    date: '2024-11-28',
    time: '17:27',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ mốc 35.000 km',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Bảo dưỡng định kỳ nhanh cấp 1.'
  },
  {
    date: '2025-01-24',
    time: '13:24',
    type: 'PERIODIC_MAJOR',
    title: 'Bảo dưỡng định kỳ Cấp 3 lớn mốc 40.000 km',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Đợt bảo dưỡng lớn: Thay nhớt, lọc nhớt, lọc gió động cơ, lọc điều hòa, bugi, dầu phanh DOT4.'
  },
  {
    date: '2026-04-04',
    time: '04:04',
    type: 'PERIODIC',
    title: 'Bảo dưỡng định kỳ mốc 50.000 km / 55.000 km',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Thay dầu nhớt động cơ và kiểm tra an toàn gầm phanh.'
  },
  {
    date: '2026-05-20',
    time: '16:01',
    type: 'WARRANTY',
    title: 'Bảo hành Cảm biến túi khí & Mặt ga lăng',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'COMPLETED',
    note: 'Bảo hành thay thế cảm biến hệ thống túi khí và căn chỉnh mặt ca-lăng trước.'
  },
  {
    date: '2026-09-15',
    time: '07:59',
    type: 'QUOTE',
    title: 'Báo giá Bảo dưỡng Cấp 3 mốc 65.023 km (Phiếu BG-VS039-260915-004)',
    garage: 'Hyundai Ngọc Phát (Chi nhánh Amata)',
    status: 'QUOTATION',
    note: 'Tổng tiền dự kiến 5.421.600 đ (Bao gồm: Lọc xăng 1.026k, Nhớt máy 936k, Lọc nhớt 155k, Công 675k + Phụ gia MT-10 1.350k). Đang thẩm định so sánh.'
  },
  {
    date: '2026-09-14',
    time: '14:00',
    type: 'QUOTE',
    title: 'Báo giá & Hợp đồng dịch vụ mốc 65.010 km',
    garage: '1Car Gara Garage Chuyên Nghiệp',
    status: 'QUOTATION',
    note: 'Tổng tiền dự kiến 9.352.800 đ (Gồm: Bảo dưỡng máy gầm 4.410.000 đ + Đồng sơn thân vỏ phục hồi móp cửa/cản 4.250.000 đ + VAT 8%).'
  }
];

export default function VehicleProfileTab({ vehicle, onOpenQuickAdd }) {
  const [filterType, setFilterType] = useState('ALL');

  const filteredRoadmap = REAL_GARAGE_ROADMAP.filter(item => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PERIODIC') return item.type === 'PERIODIC' || item.type === 'PERIODIC_MAJOR';
    if (filterType === 'WARRANTY') return item.type === 'WARRANTY' || item.type === 'REPAIR';
    if (filterType === 'QUOTE') return item.type === 'QUOTE';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* 1. THẺ HỒ SƠ XE CHÍNH CHỦ (VEHICLE PASSPORT) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header Title & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-wide">Hồ Sơ Xe Điện Tử</h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Chính chủ xác thực
                  </span>
                </div>
                <p className="text-xs text-slate-400">Hyundai Elantra • 2.0 AT Xăng • Đời 2022</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">ODO Tiếp Nhận</span>
                <span className="text-base font-mono font-bold text-cyan-300">
                  {formatKm(vehicle?.current_odo || 65023)}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* Chủ xe */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Chủ phương tiện
              </span>
              <p className="text-sm font-bold text-slate-100">{vehicle?.owner_name || 'Phạm Quốc Tuấn'}</p>
            </div>

            {/* Biển số xe */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" /> Biển số đăng ký
              </span>
              <p className="text-sm font-bold font-mono text-cyan-300 tracking-wider">
                {vehicle?.license_plate || '60K-228.98'}
              </p>
            </div>

            {/* Ngày ĐKBH & Năm SX */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Ngày ĐKBH / Năm SX
              </span>
              <p className="text-sm font-bold text-slate-100">
                29/11/2022 <span className="text-xs font-normal text-slate-400">(Năm SX: 2022)</span>
              </p>
            </div>

            {/* Số khung (VIN) */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1 sm:col-span-2 md:col-span-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" /> Số khung (VIN)
              </span>
              <p className="text-xs font-mono font-bold text-slate-200 tracking-wider break-all">
                {vehicle?.vin || 'RLULL41BBNT000481'}
              </p>
            </div>

            {/* Số máy */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Số máy động cơ
              </span>
              <p className="text-xs font-mono font-bold text-slate-200 tracking-wider">
                {vehicle?.engine_no || 'G4FGNU243843'}
              </p>
            </div>

            {/* Đại lý chăm sóc chính */}
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" /> Đại lý chăm sóc chính
              </span>
              <p className="text-xs font-semibold text-slate-200 truncate">
                Hyundai Ngọc Phát (Amata)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LỘ TRÌNH LỊCH SỬ CÁC LẦN VÀO XƯỞNG (TIMELINE ROADMAP) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Lộ Trình Lịch Sử Các Lần Vào Xưởng Thực Tế
            </h3>
            <p className="text-xs text-slate-400">
              Đồng bộ chính xác 100% từ hồ sơ quản lý dịch vụ App Hyundai ME! / TC Motor ({REAL_GARAGE_ROADMAP.length} đợt)
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'PERIODIC', label: 'Bảo dưỡng định kỳ' },
              { id: 'WARRANTY', label: 'Bảo hành / Kỹ thuật' },
              { id: 'QUOTE', label: 'Báo giá so sánh' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  filterType === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Timeline Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl space-y-6">
          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
            {filteredRoadmap.map((item, idx) => {
              const isQuote = item.status === 'QUOTATION';
              const isMajor = item.type === 'PERIODIC_MAJOR';
              const isWarranty = item.type === 'WARRANTY';

              return (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125 ${
                    isQuote 
                      ? 'bg-amber-500 border-amber-300 shadow-md shadow-amber-500/40' 
                      : isMajor 
                        ? 'bg-cyan-500 border-cyan-300 shadow-md shadow-cyan-500/40'
                        : isWarranty
                          ? 'bg-purple-500 border-purple-300 shadow-md shadow-purple-500/40'
                          : 'bg-blue-500 border-blue-300'
                  }`} />

                  {/* Card Content */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    isQuote 
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50' 
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                          {item.date} • {item.time}
                        </span>
                        
                        {isQuote ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            BÁO GIÁ SO SÁNH (CHƯA LÀM)
                          </span>
                        ) : isMajor ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            CẤP 3 LỚN (ĐÃ LÀM)
                          </span>
                        ) : isWarranty ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            BẢO HÀNH CHÍNH HÃNG
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            ĐÃ HOÀN THÀNH
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-400 font-medium">
                        {item.garage}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
