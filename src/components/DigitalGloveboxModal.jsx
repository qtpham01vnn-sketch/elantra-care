import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  UserCheck, 
  QrCode,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DigitalGloveboxModal({ isOpen, onClose, vehicle }) {
  const [activeDocIndex, setActiveDocIndex] = useState(0);

  if (!isOpen) return null;

  const documents = [
    {
      id: 'gplx',
      title: 'Giấy Phép Lái Xe (GPLX Hạng C)',
      docNo: '740009000756',
      holder: 'PHẠM QUỐC TUẤN (10/01/1979)',
      expiry: '27/09/2029',
      authority: 'Sở GTVT Tỉnh Đồng Nai',
      typeBadge: 'GPLX Hạng C',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      note: 'Xã Cẩm Đường, Huyện Long Thành, Tỉnh Đồng Nai. Giá trị đến 27/09/2029.',
      details: [
        { label: 'Số GPLX', value: '740009000756' },
        { label: 'Hạng giấy phép', value: 'Hạng C (Xe tải > 3.5T & Xe con)' },
        { label: 'Ngày cấp', value: '27/09/2024' },
        { label: 'Có giá trị đến', value: '27/09/2029' },
        { label: 'Nơi cấp', value: 'Sở GTVT Đồng Nai (Phó Giám Đốc Dương Văn Đông ký)' },
      ]
    },
    {
      id: 'registry',
      title: 'Sổ Đăng Kiểm An Toàn Kỹ Thuật & BVMT',
      docNo: 'VA 0765744 (Số QL: 6001S-159002)',
      holder: '60K-228.98 • ELANTRA CN7 1.6 MPI 6AT',
      expiry: '15/05/2027',
      authority: 'TT Đăng Kiểm 6006D (Đồng Nai)',
      typeBadge: 'Sổ Kiểm Định',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      note: 'Số phiếu 6006D-08056/23. Ô tô con không kinh doanh vận tải. Hạn kiểm định: 15/05/2027.',
      details: [
        { label: 'Số GCN', value: 'VA 0765744' },
        { label: 'Mã kiểu loại', value: 'ELANTRA CN7 1.6 MPI 6AT (2022)' },
        { label: 'Số khung / VIN', value: 'RLULL41BBNT000481' },
        { label: 'Số máy', value: 'G4FGNU243843 (1.591 cm³ / 93 kW)' },
        { label: 'Cỡ lốp', value: 'KENDA 195/65R15 (4 bánh)' },
        { label: 'Hạn kiểm định', value: '15/05/2027 (Trạm 6006D)' },
      ]
    },
    {
      id: 'insurance',
      title: 'Bảo Hiểm Bắt Buộc TNDS & Tự Nguyện',
      docNo: 'OTOBB25 3140025',
      holder: 'PHẠM QUỐC TUẤN • 60K-228.98',
      expiry: '07/06/2027',
      authority: 'Bảo Hiểm Viễn Đông (VASS TP.HCM)',
      typeBadge: 'Bảo Hiểm VASS',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      note: 'Thời hạn: 07/11/2025 đến 07/06/2027. TNDS 150tr/người + BH người ngồi trên xe 10tr/người.',
      details: [
        { label: 'Số GCN', value: 'OTOBB25 3140025' },
        { label: 'Công ty bảo hiểm', value: 'Công ty CP Bảo hiểm Viễn Đông (VASS)' },
        { label: 'Thời hạn hiệu lực', value: 'Từ 07/11/2025 đến 17h03 07/06/2027' },
        { label: 'Mức trách nhiệm TNDS', value: '150 triệu đ/người/vụ' },
        { label: 'BH Người ngồi trên xe', value: '10 triệu đ/người/vụ (4 chỗ ngồi)' },
        { label: 'Hotline bồi thường 24/7', value: '1900 9249' },
      ]
    },
    {
      id: 'service_settlement',
      title: 'Quyết Toán Bảo Dưỡng Thực Tế 65.000 KM',
      docNo: 'LS-VS039-260915-004 (16/09/2026)',
      holder: 'HYUNDAI NGỌC PHÁT (ĐỒNG NAI)',
      expiry: 'Tiếp theo: 70.023 km (16/01/2027)',
      authority: 'CVDV: Cao Nguyên (0358455495)',
      typeBadge: 'Phiếu Quyết Toán',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      note: 'Thực thanh toán: 3.322.080 đ (Tiết kiệm giảm trừ: 2.593.080 đ). Đã thay dầu 5W-30, lọc nhớt, lọc xăng 31112L1000, vệ sinh kim phun, bảo dưỡng phanh.',
      details: [
        { label: 'Lệnh sửa chữa', value: 'LS-VS039-260915-004' },
        { label: 'Mốc ODO thực hiện', value: '65.023 km (Ngày 16/09/2026)' },
        { label: 'Tổng tiền thanh toán', value: '3.322.080 đ (Đã gồm VAT 8%)' },
        { label: 'Tổng tiền được giảm', value: '2.593.080 đ (Tiết kiệm tối ưu)' },
        { label: 'Hẹn lần bảo dưỡng tới', value: '70.023 km hoặc ngày 16/01/2027' },
        { label: 'Cố vấn dịch vụ', value: 'Cao Nguyên - ĐT: 0358455495' },
      ]
    }
  ];

  const currentDoc = documents[activeDocIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Hộp Đựng Giấy Tờ Số (Digital Glovebox)
              </h3>
              <p className="text-xs text-slate-400">
                Xuất trình nhanh giấy tờ xe & GPLX chính chủ khi cần thiết
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 overflow-x-auto scrollbar-none">
          {documents.map((doc, idx) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocIndex(idx)}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeDocIndex === idx
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {doc.id === 'gplx' && <UserCheck className="w-3.5 h-3.5" />}
              {doc.id === 'registry' && <FileText className="w-3.5 h-3.5" />}
              {doc.id === 'insurance' && <ShieldCheck className="w-3.5 h-3.5" />}
              {doc.id === 'service_settlement' && <CreditCard className="w-3.5 h-3.5" />}
              <span className="truncate">{doc.typeBadge}</span>
            </button>
          ))}
        </div>

        {/* Document Content Display */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Card Presentation */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentDoc.badgeColor}`}>
                  {currentDoc.typeBadge}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mt-1.5">
                  {currentDoc.title}
                </h4>
                <p className="text-xs text-slate-400">{currentDoc.authority}</p>
              </div>

              <div className="w-12 h-12 bg-white/5 border border-slate-700/80 rounded-xl flex items-center justify-center text-cyan-400">
                <QrCode className="w-7 h-7" />
              </div>
            </div>

            {/* Spec Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80">
              {currentDoc.details.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    {item.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-100 break-words">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Note alert */}
            <div className="mt-3.5 p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{currentDoc.note}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Trang {activeDocIndex + 1}/{documents.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDocIndex((prev) => (prev > 0 ? prev - 1 : documents.length - 1))}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Trước
            </button>
            <button
              onClick={() => setActiveDocIndex((prev) => (prev < documents.length - 1 ? prev + 1 : 0))}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              Tiếp theo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
