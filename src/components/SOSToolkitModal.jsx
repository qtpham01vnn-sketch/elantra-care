import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  AlertTriangle, 
  ShieldAlert, 
  LifeBuoy, 
  Zap, 
  Wrench, 
  Disc, 
  Flame, 
  Info,
  ChevronRight,
  ExternalLink,
  MapPin
} from 'lucide-react';

export default function SOSToolkitModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('contacts');

  if (!isOpen) return null;

  const hotlines = [
    {
      id: 'highway-sos',
      title: 'Cứu Hộ Cao Tốc Long Thành - Dầu Giây - Phan Thiết',
      desc: 'Hỗ trợ xe chết máy, va chạm, nổ lốp trên tuyến cao tốc CT01 & Phan Thiết 24/7',
      phone: '02862819191',
      displayPhone: '028 6281 9191 / 1900 6006',
      type: 'EMERGENCY',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'hyundai-advisor',
      title: 'Cố Vấn Dịch Vụ Hyundai Ngọc Phát (Amata)',
      desc: 'Cố vấn Cao Nguyên - Hỗ trợ kỹ thuật chính hãng, tư vấn sự cố & kéo xe về xưởng',
      phone: '0358455495',
      displayPhone: '0358 455 495 (Cao Nguyên)',
      type: 'GARAGE',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'vass-insurance',
      title: 'Hotline Cứu Hộ & Bồi Thường Bảo Hiểm Viễn Đông (VASS)',
      desc: 'Khai báo sự cố va quẹt, tai nạn, cứu hộ kéo xe miễn phí theo hợp đồng OTOBB25 3140025',
      phone: '19009249',
      displayPhone: '1900 9249 (Tổng đài VASS)',
      type: 'INSURANCE',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      id: 'hyundai-hotline',
      title: 'Tổng Đài CSKH & Cứu Hộ Hyundai Thành Công (TC Motor)',
      desc: 'Cứu hộ khẩn cấp toàn quốc và tra cứu bảo hành chính hãng 5 năm',
      phone: '1900561212',
      displayPhone: '1900 56 12 12',
      type: 'MANUFACTURER',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    }
  ];

  const emergencyGuides = [
    {
      id: 'battery',
      icon: Zap,
      title: 'Bình Ắc Quy Yếu / Không Đề Được Máy',
      steps: [
        '1. Tắt hết điều hòa, đèn pha, màn hình giải trí AVN.',
        '2. Nhờ xe khác câu bình: Nối kẹp ĐỎ (+) vào cực Dương (+) xe anh trước, rồi kẹp ĐỎ (+) vào xe hỗ trợ.',
        '3. Nối kẹp ĐEN (-) vào cực Âm (-) xe hỗ trợ, kẹp ĐEN (-) còn lại vào khung sắt không sơn của xe anh.',
        '4. Đề nổ xe hỗ trợ chạy 3 phút, sau đó đạp phanh đề nổ xe Elantra.',
        '5. Khi nổ máy xong, để nổ cầm chừng 15-20 phút để máy phát nạp điện lại.'
      ]
    },
    {
      id: 'tire',
      icon: Disc,
      title: 'Nổ Lốp / Xẹp Lốp Trên Đường',
      steps: [
        '1. Bật đèn khẩn cấp Hazard (nút tam giác đỏ), từ từ tấp xe vào làn dừng khẩn cấp / lề đường an toàn.',
        '2. Kéo phanh tay, về số P, đặt biển tam giác phản quang cách đuôi xe 50 - 100m.',
        '3. Lấy con đội và bánh xe sơ cua trong cốp sau (dưới tấm lót).',
        '4. Nới lỏng ốc tắc kê bánh xe 1/2 vòng trước khi đội xe lên.',
        '5. Nâng con đội, tháo bánh cũ, lắp bánh mới và siết ốc theo hình chữ X/ngôi sao đối xứng.'
      ]
    },
    {
      id: 'water',
      icon: AlertTriangle,
      title: 'Xe Đi Qua Vùng Ngập Nước / Chết Máy',
      steps: [
        '1. TUYỆT ĐỐI KHÔNG ĐƯỢC ĐỀ LẠI MÁY nếu xe bị chết máy trong vũng nước ngập (tránh thủy kích cong tay biên).',
        '2. Tắt chìa khóa điện, về số N.',
        '3. Xuống xe đẩy xe lên chỗ cao ráo an toàn hoặc ngồi yên trong xe gọi cứu hộ.',
        '4. Gọi ngay Hotline Bảo hiểm Viễn Đông 1900 9249 chụp ảnh hiện trường để được bảo hiểm chi trả 100%.'
      ]
    },
    {
      id: 'check_engine',
      icon: Wrench,
      title: 'Đèn Check Engine Màu Vàng Sáng Trên Táp-lô',
      steps: [
        '1. Đèn vàng sáng liên tục: Xe vẫn chạy được tạm thời, giảm tốc độ dưới 60 km/h, hạn chế thốc ga.',
        '2. Kiểm tra lại nắp bình xăng đã vặn chặt kêu "cạch" chưa.',
        '3. Đèn vàng NHẤP NHÁY LIÊN TỤC: Đang có hiện tượng bỏ máy (misfire), tấp vào lề an toàn tắt máy ngay.',
        '4. Liên hệ Cố vấn Cao Nguyên (0358 455 495) để đưa xe vào xưởng quét máy chẩn đoán G-Scan.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40 animate-pulse">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Trung Tâm Cứu Hộ & SOS Khẩn Cấp
              </h3>
              <p className="text-xs text-slate-400">
                1-Chạm gọi cứu hộ cao tốc, bảo hiểm & cẩm nang sự cố 24/7
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
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'bg-rose-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Hotline Cứu Hộ 1-Chạm</span>
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guides'
                ? 'bg-rose-600 text-white shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Cẩm Nang Xử Lý Sự Cố</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'contacts' ? (
            <div className="space-y-3">
              {hotlines.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.type}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>

                  <a
                    href={`tel:${item.phone}`}
                    className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 shrink-0 active:scale-95 transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{item.displayPhone}</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3.5">
              {emergencyGuides.map((guide) => {
                const Icon = guide.icon;
                return (
                  <div 
                    key={guide.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2.5"
                  >
                    <div className="flex items-center gap-2 text-rose-400">
                      <Icon className="w-4 h-4 shrink-0" />
                      <h4 className="text-sm font-bold text-slate-100">{guide.title}</h4>
                    </div>

                    <div className="space-y-1.5 pl-2 text-xs text-slate-300 leading-relaxed">
                      {guide.steps.map((st, sIdx) => (
                        <p key={sIdx} className="text-slate-300">{st}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 text-center">
          <p className="text-[11px] text-slate-400">
            📍 Vị trí xe đăng ký: <b className="text-slate-200">Xã Cẩm Đường, Long Thành, Đồng Nai</b> • Biển số: <b className="text-cyan-300 font-mono">60K-228.98</b>
          </p>
        </div>
      </div>
    </div>
  );
}
