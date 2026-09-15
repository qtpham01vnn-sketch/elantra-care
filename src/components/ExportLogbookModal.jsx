import React from 'react';
import { X, Printer, Download, Car, ShieldCheck, Calendar, CheckCircle2, Wrench, Building } from 'lucide-react';
import { formatCurrency, formatKm } from '../services/vehicleService';

export default function ExportLogbookModal({ isOpen, onClose, vehicle, serviceLogs, reminders }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalServiceSpent = serviceLogs.reduce((sum, s) => sum + (s.total_amount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Toolbar (Hidden during Print) */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Sổ Nhật Ký & Lịch Sử Bảo Dưỡng Điện Tử (Digital Service Logbook)
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>In sổ / Lưu file PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-100 print:text-black print:bg-white print:overflow-visible">
          
          {/* Header Banner for Print */}
          <div className="border-b-2 border-slate-700 print:border-black pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-black text-sm uppercase tracking-wider print:bg-black print:text-white">
                  HYUNDAI OFFICIAL LOGBOOK
                </span>
                <span className="text-xs text-slate-400 print:text-gray-600">Sổ Theo Dõi Kỹ Thuật Định Kỳ</span>
              </div>
              <h1 className="text-2xl font-black mt-1 text-white print:text-black">
                {vehicle.make} {vehicle.model} ({vehicle.trim}) - {vehicle.year}
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono mt-0.5">
                Biển số: <strong className="text-cyan-300 print:text-black font-bold">{vehicle.license_plate}</strong> | Số VIN: <strong className="text-slate-300 print:text-black">{vehicle.vin}</strong>
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 print:text-gray-600">ODO Hiện Tại</div>
              <div className="text-xl font-mono font-black text-cyan-400 print:text-black">
                {formatKm(vehicle.current_odo)}
              </div>
              <span className="text-[10px] text-slate-500 print:text-gray-500">
                Xuất ngày: {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-gray-100 print:border-gray-300 text-xs">
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Tổng số lần vào xưởng</span>
              <strong className="text-sm font-bold text-white print:text-black">{serviceLogs.length} Lần</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Tổng chi phí bảo dưỡng</span>
              <strong className="text-sm font-bold text-emerald-400 print:text-black">{formatCurrency(totalServiceSpent)}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-600 block text-[11px]">Tình trạng hồ sơ</span>
              <span className="text-xs font-semibold text-emerald-400 print:text-black flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline" /> Đầy đủ chứng từ & Hóa đơn
              </span>
            </div>
          </div>

          {/* Detailed Service Records Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300 print:text-black flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Lịch sử các đợt bảo dưỡng & Sửa chữa chi tiết
            </h3>

            <div className="space-y-4">
              {serviceLogs.map((srv, index) => {
                const isHang = srv.garage_type === 'HANG';
                return (
                  <div 
                    key={srv.id} 
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 print:bg-white print:border-gray-300 space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 print:border-gray-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-slate-800 print:bg-gray-200 flex items-center justify-center font-bold text-xs">
                          {serviceLogs.length - index}
                        </span>
                        <div>
                          <strong className="text-xs sm:text-sm font-bold text-white print:text-black">
                            {srv.garage_name}
                          </strong>
                          <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isHang ? 'bg-blue-500/20 text-blue-300 print:text-black' : 'bg-amber-500/20 text-amber-300 print:text-black'
                          }`}>
                            {isHang ? 'Chính Hãng' : 'Gara Ngoài'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="text-slate-400 print:text-gray-600">{srv.service_date}</span>
                        <span className="mx-1">•</span>
                        <strong className="text-cyan-300 print:text-black font-bold">{formatKm(srv.odo)}</strong>
                      </div>
                    </div>

                    {/* Parts List */}
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-[11px] text-slate-400 print:text-gray-600 border-b border-slate-800/60 print:border-gray-200">
                          <th className="pb-1.5 font-semibold">Hạng mục phụ tùng / Dịch vụ</th>
                          <th className="pb-1.5 font-semibold text-center w-20">Phân loại</th>
                          <th className="pb-1.5 font-semibold text-center w-14">SL</th>
                          <th className="pb-1.5 font-semibold text-right w-24">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 print:divide-gray-100">
                        {srv.items?.map((item) => (
                          <tr key={item.id} className="py-1">
                            <td className="py-1.5 pr-2">
                              <span className="font-medium text-slate-200 print:text-black">{item.item_name}</span>
                              {item.item_code && (
                                <span className="text-[10px] font-mono text-slate-500 print:text-gray-500 ml-1.5">
                                  ({item.item_code})
                                </span>
                              )}
                            </td>
                            <td className="py-1.5 text-center">
                              {item.is_mandatory === false ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 print:text-black font-medium">
                                  Phụ gia
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 print:text-black font-medium">
                                  Bắt buộc
                                </span>
                              )}
                            </td>
                            <td className="py-1.5 text-center font-mono">{item.quantity}</td>
                            <td className="py-1.5 text-right font-mono font-medium text-slate-200 print:text-black">
                              {formatCurrency(item.total_price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Footer Row */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 print:border-gray-200 text-xs">
                      <span className="text-slate-400 print:text-gray-600 italic">
                        {srv.notes || 'Không có ghi chú thêm.'}
                      </span>
                      <div className="font-mono text-sm font-bold text-emerald-400 print:text-black">
                        Tổng tiền: {formatCurrency(srv.total_amount)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signature Block for Print */}
          <div className="pt-6 border-t border-slate-800 print:border-black grid grid-cols-2 text-center text-xs print:grid">
            <div>
              <span className="font-bold block mb-8 print:text-black">XÁC NHẬN CỦA CHỦ PHƯƠNG TIỆN</span>
              <span className="text-slate-400 print:text-gray-600 italic">(Ký và ghi rõ họ tên)</span>
            </div>
            <div>
              <span className="font-bold block mb-8 print:text-black">CHUYÊN VIÊN KỸ THUẬT / CỐ VẤN DỊCH VỤ</span>
              <span className="text-slate-400 print:text-gray-600 italic">(Ký và đóng dấu xác nhận)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
