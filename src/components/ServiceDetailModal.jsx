import React, { useState } from 'react';
import { X, Wrench, Shield, CheckCircle2, AlertCircle, FileText, Image, Building, Sparkles } from 'lucide-react';
import { formatCurrency, formatKm } from '../services/vehicleService';

export default function ServiceDetailModal({ service, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!service) return null;

  const isHang = service.garage_type === 'HANG';
  const mandatoryItems = service.items?.filter(item => item.is_mandatory !== false) || [];
  const optionalItems = service.items?.filter(item => item.is_mandatory === false) || [];

  // Phân nhóm theo Category (Máy/Gầm vs Đồng Sơn)
  const engineChassisItems = service.items?.filter(item => item.category === 'ENGINE_CHASSIS' || item.category === 'ADDITIVE') || [];
  const bodyPaintItems = service.items?.filter(item => item.category === 'BODY_PAINT') || [];

  const mandatoryTotal = mandatoryItems.reduce((acc, it) => acc + Number(it.total_price || 0), 0);
  const optionalTotal = optionalItems.reduce((acc, it) => acc + Number(it.total_price || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl ${isHang ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  isHang ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isHang ? 'Chính Hãng Hyundai' : 'Gara Ngoài Chuyên Nghiệp'}
                </span>
                <span className="text-xs text-slate-400">{service.service_date}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{service.garage_name}</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Quick Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Mốc ODO thực hiện</span>
              <strong className="text-cyan-300 font-mono text-sm">{formatKm(service.odo)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Tổng tiền phiếu</span>
              <strong className="text-emerald-400 text-sm">{formatCurrency(service.total_amount)}</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px]">Cơ cấu phụ tùng</span>
              <span className="text-slate-300">
                {mandatoryItems.length} bắt buộc, {optionalItems.length} phụ gia
              </span>
            </div>
          </div>

          {/* Notes */}
          {service.notes && (
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-slate-200 block mb-1">Ghi chú kỹ thuật:</span>
              <p className="italic">{service.notes}</p>
            </div>
          )}

          {/* NHÓM 1: BẢO DƯỠNG MÁY / GẦM (Nếu có) */}
          {engineChassisItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  Nhóm Bảo dưỡng Máy & Khung Gầm ({engineChassisItems.length} mục)
                </h4>
              </div>

              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                {engineChassisItems.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-medium text-xs text-slate-100">{item.item_name}</span>
                          {item.item_code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {item.item_code}
                            </span>
                          )}
                          {/* Mandatory vs Optional Badge */}
                          {item.is_mandatory === false ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold">
                              <Sparkles className="w-2.5 h-2.5" /> Phụ gia / Tùy chọn
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                              Bắt buộc
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          SL: {item.quantity} × {formatCurrency(item.unit_price)}
                          {item.labor_price > 0 && ` + Công: ${formatCurrency(item.labor_price)}`}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-100 block">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NHÓM 2: ĐỒNG SƠN & THÂN VỎ (Nếu có) */}
          {bodyPaintItems.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Nhóm Đồng Sơn & Phục Hồi Thân Vỏ ({bodyPaintItems.length} mục)
                </h4>
              </div>

              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                {bodyPaintItems.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="font-medium text-xs text-slate-100">{item.item_name}</span>
                          {item.item_code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {item.item_code}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          SL: {item.quantity} × {formatCurrency(item.unit_price)}
                          {item.labor_price > 0 && ` + Công: ${formatCurrency(item.labor_price)}`}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-300 block">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phân tích Bắt buộc vs Tùy chọn */}
          {optionalItems.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Vật tư & Công bảo dưỡng bắt buộc:</span>
                <span className="font-semibold text-slate-100">{formatCurrency(mandatoryTotal)}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Phụ gia & Hóa chất làm sạch tùy chọn:
                </span>
                <span className="font-semibold">{formatCurrency(optionalTotal)}</span>
              </div>
            </div>
          )}

          {/* Hóa đơn đính kèm (Receipt Image Preview) */}
          {service.invoice_urls && service.invoice_urls.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Ảnh chụp hóa đơn / Phiếu báo giá gốc
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {service.invoice_urls.map((url, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(url)}
                    className="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center"
                  >
                    <img 
                      src={url} 
                      alt={`Hóa đơn ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      Phóng to ảnh
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Tổng thanh toán: <strong className="text-emerald-400 text-base ml-1">{formatCurrency(service.total_amount)}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Lightbox Zoom Image Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img 
            src={selectedImage} 
            alt="Hóa đơn phóng to" 
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
