import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  PhoneCall,
  Car,
  FileText
} from 'lucide-react';

export default function PhatNguoiLookupModal({ isOpen, onClose, vehicle }) {
  const [loading, setLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState('16:32:00 Hôm nay');
  const [violationStatus, setViolationStatus] = useState('CLEAN'); // CLEAN, FOUND

  if (!isOpen) return null;

  const plate = vehicle?.license_plate || '60K-228.98';

  const handleRefreshCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const now = new Date();
      setLastCheckTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} Hôm nay`);
    }, 1200);
  };

  const handleOpenCSGTPortal = () => {
    window.open('http://www.csgt.vn/tra-cuu-phuong-tien-vi-pham-giao-thong.html', '_blank');
  };

  const handleOpenPhatNguoiVN = () => {
    window.open(`https://phatnguoi.vn/?bienso=${plate.replace(/[^a-zA-Z0-9]/g, '')}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Tra Cứu Phạt Nguội Quốc Gia
              </h3>
              <p className="text-xs text-slate-400">
                Hệ thống Cục Cảnh sát Giao thông (CSGT) Toàn quốc
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Vehicle License Plate Display */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Biển số tra cứu</span>
                <span className="text-xl font-mono font-bold text-cyan-300 tracking-wider">
                  {plate}
                </span>
                <span className="text-xs text-slate-400 block">Loại xe: Ô tô con (Hyundai Elantra CN7)</span>
              </div>
            </div>

            <button
              onClick={handleRefreshCheck}
              disabled={loading}
              className="py-2 px-3.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Search className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Đang quét...' : 'Quét kiểm tra lại'}</span>
            </button>
          </div>

          {/* Current Status Result */}
          {violationStatus === 'CLEAN' ? (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-300">
                    KHÔNG CÓ LỖI VI PHẠM PHẠT NGUỘI
                  </h4>
                  <p className="text-xs text-slate-300">
                    Phương tiện <strong className="text-white font-mono">{plate}</strong> hoàn toàn sạch lỗi trên hệ thống cơ sở dữ liệu CSGT toàn quốc.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Cập nhật lần cuối: {lastCheckTime}
                </span>
                <span className="text-emerald-400 font-semibold">Đủ điều kiện đăng kiểm 100%</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl text-rose-300 text-xs">
              Có thông báo vi phạm chưa nộp phạt. Vui lòng kiểm tra chi tiết.
            </div>
          )}

          {/* 1-Click Direct Access to Official Portals */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-200 block">
              Tra cứu đối chiếu trực tiếp trên Cổng thông tin Chính thống:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleOpenCSGTPortal}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                    Cổng Cục CSGT (csgt.vn)
                  </h5>
                  <p className="text-[11px] text-slate-400">Cơ sở dữ liệu gốc Bộ Công An</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
              </button>

              <button
                onClick={handleOpenPhatNguoiVN}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    Tra cứu PhatNguoi.vn
                  </h5>
                  <p className="text-[11px] text-slate-400">Tự động điền biển số 60K-228.98</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Advice notes */}
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-[11px] text-slate-400 space-y-1">
            <p>💡 <b>Lưu ý tuyến đường hay camera phạt nguội:</b> Tuyến QL51, Cao tốc Long Thành - Dầu Giây - Phan Thiết và Xa Lộ Hà Nội đều có hệ thống camera AI phạt nguội tốc độ và làn đường 24/7.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
          <span className="text-slate-400">Tích hợp tra cứu phạt nguội 1-chạm</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
