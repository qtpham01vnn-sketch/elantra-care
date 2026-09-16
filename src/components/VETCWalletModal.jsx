import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  ArrowUpRight, 
  QrCode, 
  History, 
  Smartphone, 
  Car, 
  Bike, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { formatCurrency } from '../services/vehicleService';

export default function VETCWalletModal({ isOpen, onClose, vehicle }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, history, topup
  const [filterStation, setFilterStation] = useState('');
  const [topupAmount, setTopupAmount] = useState('200000');

  if (!isOpen) return null;

  const vetcInfo = {
    account_name: 'Ví VETC',
    owner: vehicle?.owner_name || 'Phạm Quốc Tuấn',
    phone: vehicle?.phone || '0977138673',
    cccd: vehicle?.cccd || '052079020040',
    email: vehicle?.email || 'qtpham01vnn@gmail.com',
    status: 'Mở khóa (Hoạt động tốt)',
    wallet_type: 'Ví chính (Đã liên kết ngân hàng)',
    balance: 624267,
    available_balance: 624267,
    held_balance: 0,
    vehicles: [
      { plate: '60K-228.98T', type: 'Ô tô (Hyundai Elantra CN7)', status: 'Hoạt động', tag_code: 'E01-VETC' },
      { plate: '60G1-270.39', type: 'Xe máy', status: 'Đang hoạt động', tag_code: 'M02-VETC' }
    ],
    history: [
      { id: 'tx-1', date: '13/09/2026 12:04:15', station: 'Trạm Thu Phí Sông Phan', amount: 34000, plate: '60K-228.98', status: 'Thành công', route: 'Cao tốc Dầu Giây - Phan Thiết' },
      { id: 'tx-2', date: '31/08/2026 15:43:08', station: 'Trạm Thu Phí Trảng Bom', amount: 34000, plate: '60K-228.98', status: 'Thành công', route: 'Quốc Lộ 1A Đồng Nai' },
      { id: 'tx-3', date: '31/08/2026 05:42:55', station: 'Trạm Thu Phí Cầu Đồng Nai', amount: 34000, plate: '60K-228.98', status: 'Thành công', route: 'Xa Lộ Hà Nội - Biên Hòa' },
      { id: 'tx-4', date: '30/08/2026 14:48:47', station: 'Nút giao QL55 (Km84+200)', amount: 27000, plate: '60K-228.98', status: 'Thành công', route: 'Cao tốc Phan Thiết - Dầu Giây' },
      { id: 'tx-5', date: '30/08/2026 14:17:34', station: 'Trạm Thu Phí Sông Phan', amount: 46000, plate: '60K-228.98', status: 'Thành công', route: 'Cao tốc Dầu Giây - Phan Thiết' },
      { id: 'tx-6', date: '30/08/2026 14:07:46', station: 'Trạm Thu Phí Xa Lộ Hà Nội', amount: 27000, plate: '60K-228.98', status: 'Thành công', route: 'Cửa ngõ TP. Hồ Chí Minh' },
      { id: 'tx-7', date: '30/08/2026 14:07:33', station: 'Nút giao Ma Lâm (Km205+701)', amount: 0, plate: '60K-228.98', status: 'Vé vào ghi nhận', route: 'Cao tốc Vĩnh Hảo - Phan Thiết' },
      { id: 'tx-8', date: '30/08/2026 05:55:11', station: 'Trạm Thu Phí Trảng Bom', amount: 24000, plate: '60K-228.98', status: 'Thành công', route: 'Quốc Lộ 1A' },
      { id: 'tx-9', date: '30/08/2026 04:35:50', station: 'Nút giao QL1A (Km63+000)', amount: 0, plate: '60K-228.98', status: 'Vé vào ghi nhận', route: 'Cao tốc Phan Thiết' },
    ]
  };

  const filteredHistory = vetcInfo.history.filter(h => 
    !filterStation || h.station.toLowerCase().includes(filterStation.toLowerCase()) || h.route.toLowerCase().includes(filterStation.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with gradient */}
        <div className="p-5 bg-gradient-to-r from-emerald-900/60 via-slate-900 to-cyan-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Quản Lý Ví VETC Thu Phí Tự Động</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã liên kết
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chủ tài khoản: <strong className="text-slate-200">{vetcInfo.owner}</strong> • SĐT: <strong className="text-cyan-300 font-mono">{vetcInfo.phone}</strong>
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

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800/80 bg-slate-950/50">
          {[
            { id: 'overview', label: '💳 Tổng quan Ví & Số dư' },
            { id: 'history', label: `🛣️ Lịch sử qua trạm (${vetcInfo.history.length})` },
            { id: 'topup', label: '⚡ Nạp tiền nhanh' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-3.5 py-2 rounded-t-xl font-semibold transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Wallet Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
                      Tài Khoản Ví VETC Chính Hãng
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">Số điện thoại: {vetcInfo.phone}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🟢 Mở khóa
                  </span>
                </div>

                <div className="my-4">
                  <span className="text-xs text-slate-400 block">Số dư khả dụng</span>
                  <div className="text-3xl font-mono font-extrabold text-white tracking-tight">
                    {formatCurrency(vetcInfo.balance)}
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Số dư dồi dào, sẵn sàng lưu thông qua tất cả cao tốc BOT
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-emerald-900/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Số dư tạm giữ</span>
                    <strong className="text-slate-200 font-mono">0 đ</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Loại tài khoản</span>
                    <strong className="text-slate-200">Ví chính (Đã liên kết Ngân hàng)</strong>
                  </div>
                </div>
              </div>

              {/* Personal info & Legal */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={vehicle?.owner_avatar || "/avatar_tuan.jpg"}
                    alt={vetcInfo.owner}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-md shadow-emerald-500/20 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Chủ tài khoản định danh VETC
                    </h4>
                    <p className="text-sm font-bold text-emerald-300">{vetcInfo.owner}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1 font-mono border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Số điện thoại:</span>
                    <span className="text-slate-200 font-bold">{vetcInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Số CCCD:</span>
                    <span className="text-cyan-300">{vetcInfo.cccd}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Email đăng ký:</span>
                    <span className="text-slate-200">{vetcInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Địa chỉ:</span>
                    <span className="text-slate-200 font-sans">Ấp Suối Quýt, Xã Cẩm Đường, Long Thành, Đồng Nai</span>
                  </div>
                </div>
              </div>

              {/* Linked Vehicles */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Phương tiện đã liên kết vào Ví ({vetcInfo.vehicles.length})</span>
                  <span className="text-[10px] text-emerald-400">Đồng bộ từ VETC</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vetcInfo.vehicles.map((v, idx) => (
                    <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          {v.type.includes('Ô tô') ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-sm text-cyan-300">{v.plate}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                              {v.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{v.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOT TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo trạm thu phí (Sông Phan, Trảng Bom, QL55...)"
                  value={filterStation}
                  onChange={(e) => setFilterStation(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Transactions List */}
              <div className="space-y-2">
                {filteredHistory.map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-200">{tx.station}</h5>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                          {tx.plate}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{tx.route}</p>
                      <p className="text-[10px] font-mono text-slate-500">{tx.date}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {tx.amount > 0 ? `-${formatCurrency(tx.amount)}` : 'Ghi nhận vé'}
                      </div>
                      <span className="text-[10px] text-slate-400">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TOP UP (NẠP TIỀN) */}
          {activeTab === 'topup' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl text-xs text-emerald-200">
                💡 <b>Cách nạp tiền nhanh 24/7:</b> Quét mã QR hoặc chuyển khoản liên ngân hàng 24/7 (Napas247) đến số tài khoản VETC của anh Tuấn. Tiền vào ví chỉ sau 30 giây!
              </div>

              {/* Preset Amounts */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Chọn số tiền muốn nạp:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['100000', '200000', '500000', '1000000'].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTopupAmount(amt)}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                        topupAmount === amt 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {formatCurrency(parseInt(amt))}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code & Banking Transfer Info */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  {/* Generated QR representation */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=247%20VETC%200977138673%20${topupAmount}%20NAP%20VETC%2060K22898`}
                    alt="VietQR VETC"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 flex-1 w-full">
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-500">Ngân hàng thụ hưởng:</span>
                    <strong className="text-white">BIDV / VPBank (VETC)</strong>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-500">Số tài khoản / Mã ví:</span>
                    <strong className="text-cyan-300 font-mono">VETC 0977138673</strong>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-500">Người thụ hưởng:</span>
                    <strong className="text-white">VETC - PHAM QUOC TUAN</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nội dung CK:</span>
                    <strong className="text-emerald-400 font-mono">VETC 60K-228.98</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
          <span className="text-slate-400">Đồng bộ tự động từ ứng dụng VETC</span>
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
