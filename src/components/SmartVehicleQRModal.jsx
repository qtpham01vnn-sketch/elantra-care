import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Share2, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Car, 
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { formatKm } from '../services/vehicleService';

export default function SmartVehicleQRModal({ isOpen, onClose, vehicle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const passportUrl = 'https://elantra-care.vercel.app/?passport=60K22898';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(passportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Mã QR Hồ Sơ Xe Thông Minh
              </h3>
              <p className="text-xs text-slate-400">
                Quét nhanh để tra cứu lịch sử bảo dưỡng & phụ tùng tại mọi gara
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1 flex flex-col items-center text-center">
          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-cyan-500/40 relative group">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(passportUrl)}`}
              alt="QR Code Hồ sơ xe 60K-228.98"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <img
              src={vehicle?.owner_avatar || "/avatar_tuan.jpg"}
              alt={vehicle?.owner_name || "Phạm Quốc Tuấn"}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-cyan-500/50 shadow-md shadow-cyan-500/20"
            />
            <div className="text-left space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-cyan-300">
                  {vehicle?.license_plate || '60K-228.98'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Hyundai Elantra 2022
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chủ xe: <b className="text-slate-200">{vehicle?.owner_name || 'Phạm Quốc Tuấn'}</b> • ODO: <b className="text-cyan-400">{formatKm(vehicle?.current_odo || 65030)}</b>
              </p>
            </div>
          </div>

          {/* Quick Summary for Mechanics */}
          <div className="w-full p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-left space-y-2 text-xs">
            <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Thông số kỹ thuật nhanh cho Cố vấn & Thợ kỹ thuật:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1 font-mono text-[11px]">
              <div>• Dầu máy: <b className="text-white">5W-30 (4.5L)</b></div>
              <div>• Lốp: <b className="text-white">KENDA 195/65R15</b></div>
              <div>• Áp suất: <b className="text-emerald-400">2.2 - 2.3 bar (33 PSI)</b></div>
              <div>• Dầu ATF: <b className="text-white">Đã thay lúc 50.000 km</b></div>
              <div>• Lọc nhiên liệu: <b className="text-white">Đã thay lúc 65.023 km</b></div>
              <div>• Hẹn bảo dưỡng: <b className="text-cyan-300">70.023 km (Cấp 1)</b></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép Link hồ sơ!' : 'Sao chép Link Hồ Sơ'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>In mã QR dán kính lái</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
          <span className="text-slate-400">Hồ sơ xe điện tử thông minh</span>
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
