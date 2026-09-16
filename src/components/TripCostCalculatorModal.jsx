import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Fuel, 
  CreditCard, 
  Calculator, 
  ArrowRight, 
  DollarSign, 
  Navigation,
  Sparkles
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockData';
import { formatCurrency } from '../services/vehicleService';

export default function TripCostCalculatorModal({ isOpen, onClose, currentFuelPrice = 24230, avgConsumption = 7.2 }) {
  const [selectedRouteId, setSelectedRouteId] = useState('route-hcm');
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [customDistance, setCustomDistance] = useState('');
  const [customToll, setCustomToll] = useState('');

  if (!isOpen) return null;

  const selectedRoute = POPULAR_ROUTES.find(r => r.id === selectedRouteId);
  const isCustom = selectedRouteId === 'custom';

  const distanceKm = isCustom ? (Number(customDistance) || 0) : (selectedRoute?.distance_km || 0);
  const tollFeeOneWay = isCustom ? (Number(customToll) || 0) : (selectedRoute?.toll_fee || 0);

  const multiplier = isRoundTrip ? 2 : 1;
  const totalDistance = distanceKm * multiplier;
  const totalTollFee = tollFeeOneWay * multiplier;

  // Tính toán nhiên liệu tiêu thụ
  const fuelLiters = Number(((totalDistance * avgConsumption) / 100).toFixed(2));
  const totalFuelCost = Math.round(fuelLiters * currentFuelPrice);
  const grandTotal = totalFuelCost + totalTollFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Dự Toán Chi Phí Chuyến Đi (Trip Calculator)
              </h3>
              <p className="text-xs text-slate-400">
                Tính nhanh tiền xăng RON 95 + Phí trạm thu phí BOT VETC
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Route Selector */}
          <div>
            <label className="text-xs text-slate-300 font-bold block mb-2">
              Chọn cung đường xuất phát từ Long Thành:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedRouteId === route.id
                      ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">{route.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Khoảng cách: <b>{route.distance_km} km</b> • Phí BOT: <b>{formatCurrency(route.toll_fee)}</b>
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedRouteId === route.id ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
                  }`}>
                    {selectedRouteId === route.id && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                </button>
              ))}

              <button
                onClick={() => setSelectedRouteId('custom')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedRouteId === 'custom'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold">🛠️ Nhập tuyến đường tùy chọn khác</p>
                  <p className="text-[11px] text-slate-400">Tự nhập số km và tiền trạm thu phí</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedRouteId === 'custom' ? 'border-emerald-400 bg-emerald-500 text-slate-950' : 'border-slate-600'
                }`}>
                  {selectedRouteId === 'custom' && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </button>
            </div>
          </div>

          {/* Custom Route Inputs */}
          {isCustom && (
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl grid grid-cols-2 gap-3 animate-in fade-in">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Quãng đường (km 1 chiều)</label>
                <input
                  type="number"
                  value={customDistance}
                  onChange={(e) => setCustomDistance(e.target.value)}
                  placeholder="VD: 120"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tiền trạm BOT (VNĐ 1 chiều)</label>
                <input
                  type="number"
                  value={customToll}
                  onChange={(e) => setCustomToll(e.target.value)}
                  placeholder="VD: 50000"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Trip Mode: One-way vs Round-trip */}
          <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold text-slate-200">Hình thức chuyến đi:</span>
            <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setIsRoundTrip(false)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  !isRoundTrip ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                1 Chiều
              </button>
              <button
                onClick={() => setIsRoundTrip(true)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isRoundTrip ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                2 Chiều (Khứ hồi)
              </button>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="p-5 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950 border border-emerald-500/40 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs text-slate-400">Tổng quãng đường di chuyển:</span>
              <span className="text-sm font-mono font-bold text-white">{totalDistance} km</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                  Tiền xăng RON 95-III ({fuelLiters} Lít @ {formatCurrency(currentFuelPrice)}/L):
                </span>
                <span className="font-mono font-bold text-amber-300">{formatCurrency(totalFuelCost)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  Phí trạm thu phí VETC / BOT:
                </span>
                <span className="font-mono font-bold text-cyan-300">{formatCurrency(totalTollFee)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
                  TỔNG CHI PHÍ DỰ KIẾN
                </span>
                <span className="text-xs text-emerald-400 font-medium">
                  (Tiền xăng + Phí BOT)
                </span>
              </div>
              <span className="text-2xl font-mono font-extrabold text-emerald-400">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
