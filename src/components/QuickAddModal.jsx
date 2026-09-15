import React, { useState } from 'react';
import { X, Fuel, Wrench, DollarSign, Plus, Trash2, Check, Sparkles, Building, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuickAddModal({ 
  isOpen, 
  onClose, 
  initialMode = 'fuel', 
  currentOdo, 
  onAddFuel, 
  onAddService, 
  onAddExpense 
}) {
  const [activeMode, setActiveMode] = useState(initialMode); // fuel, service, expense

  // Fuel State
  const [fuelOdo, setFuelOdo] = useState(currentOdo || 65010);
  const [fuelLiters, setFuelLiters] = useState('40.0');
  const [fuelCost, setFuelCost] = useState('900000');
  const [isFullTank, setIsFullTank] = useState(true);
  const [gasStation, setGasStation] = useState('Petrolimex');

  // Service State
  const [serviceOdo, setServiceOdo] = useState(currentOdo || 65010);
  const [garageType, setGarageType] = useState('HANG'); // HANG, GARA_NGOAI
  const [garageName, setGarageName] = useState('Hyundai Ngọc Phát');
  const [serviceNotes, setServiceNotes] = useState('');
  const [serviceItems, setServiceItems] = useState([
    { 
      item_name: 'Dầu nhớt động cơ 5W-30', 
      category: 'ENGINE_CHASSIS', 
      is_mandatory: true, 
      quantity: 4, 
      unit_price: 195000, 
      labor_price: 0 
    },
    { 
      item_name: 'Lọc nhớt Mobis', 
      category: 'ENGINE_CHASSIS', 
      is_mandatory: true, 
      quantity: 1, 
      unit_price: 115000, 
      labor_price: 0 
    }
  ]);

  // Expense State
  const [expenseTitle, setExpenseTitle] = useState('Nạp tiền VETC / ePass');
  const [expenseCategory, setExpenseCategory] = useState('TOLL_VETC');
  const [expenseAmount, setExpenseAmount] = useState('500000');
  const [expenseNotes, setExpenseNotes] = useState('');

  if (!isOpen) return null;

  // Handle Fuel Submit
  const handleFuelSubmit = (e) => {
    e.preventDefault();
    onAddFuel({
      odo: Number(fuelOdo),
      liters: Number(fuelLiters),
      totalCost: Number(fuelCost),
      isFullTank,
      gasStation,
      fuelDate: new Date().toISOString().split('T')[0],
    });
    triggerConfetti();
    onClose();
  };

  // Handle Service Submit
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    const formattedItems = serviceItems.map(it => ({
      ...it,
      total_price: (Number(it.quantity) * Number(it.unit_price)) + Number(it.labor_price || 0)
    }));

    onAddService({
      odo: Number(serviceOdo),
      garageType,
      garageName,
      serviceDate: new Date().toISOString().split('T')[0],
      notes: serviceNotes,
      items: formattedItems,
      invoiceUrls: [
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80'
      ]
    });
    triggerConfetti();
    onClose();
  };

  // Handle Expense Submit
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    onAddExpense({
      title: expenseTitle,
      category: expenseCategory,
      amount: Number(expenseAmount),
      odo: Number(currentOdo),
      expenseDate: new Date().toISOString().split('T')[0],
      notes: expenseNotes,
    });
    triggerConfetti();
    onClose();
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  // Helper Service Row Operations
  const addServiceRow = () => {
    setServiceItems([
      ...serviceItems,
      { item_name: '', category: 'ENGINE_CHASSIS', is_mandatory: true, quantity: 1, unit_price: 0, labor_price: 0 }
    ]);
  };

  const removeServiceRow = (index) => {
    setServiceItems(serviceItems.filter((_, idx) => idx !== index));
  };

  const updateServiceRow = (index, field, value) => {
    const updated = [...serviceItems];
    updated[index][field] = value;
    setServiceItems(updated);
  };

  const totalServiceCalc = serviceItems.reduce((acc, it) => 
    acc + (Number(it.quantity || 0) * Number(it.unit_price || 0)) + Number(it.labor_price || 0), 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header with Mode Switcher */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMode('fuel')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeMode === 'fuel' 
                  ? 'bg-emerald-500 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>Đổ xăng</span>
            </button>
            <button
              onClick={() => setActiveMode('service')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeMode === 'service' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Bảo dưỡng</span>
            </button>
            <button
              onClick={() => setActiveMode('expense')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeMode === 'expense' 
                  ? 'bg-purple-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Chi phí</span>
            </button>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* 1. FUEL FORM (Fuelio One-Touch Style) */}
          {activeMode === 'fuel' && (
            <form onSubmit={handleFuelSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Số ODO hiện tại (km)</label>
                  <input
                    type="number"
                    value={fuelOdo}
                    onChange={(e) => setFuelOdo(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Số Lít đã đổ</label>
                  <input
                    type="number"
                    step="0.01"
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tổng tiền thanh toán (VNĐ)</label>
                <input
                  type="number"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-mono text-lg font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Trạm xăng</label>
                  <select
                    value={gasStation}
                    onChange={(e) => setGasStation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Petrolimex">Petrolimex</option>
                    <option value="PVOIL">PVOIL</option>
                    <option value="SGS Saigon Petro">SGS Petro</option>
                    <option value="Khác">Cây xăng khác</option>
                  </select>
                </div>

                {/* Fuelio Full Tank Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Đầy bình?</span>
                    <span className="text-[10px] text-slate-400">Đo L/100km chuẩn</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFullTank}
                    onChange={(e) => setIsFullTank(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-98 text-sm mt-2"
              >
                Lưu Nhật Ký Đổ Xăng
              </button>
            </form>
          )}

          {/* 2. SERVICE FORM (Drivvo Items & Garage Type) */}
          {activeMode === 'service' && (
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Số ODO (km)</label>
                  <input
                    type="number"
                    value={serviceOdo}
                    onChange={(e) => setServiceOdo(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phân loại xưởng</label>
                  <select
                    value={garageType}
                    onChange={(e) => {
                      setGarageType(e.target.value);
                      if (e.target.value === 'HANG') setGarageName('Hyundai Ngọc Phát');
                      else setGarageName('1Car Gara Garage');
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="HANG">Chính Hãng Hyundai</option>
                    <option value="GARA_NGOAI">Gara Ngoài Chuyên Nghiệp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tên Gara / Trung tâm</label>
                <input
                  type="text"
                  value={garageName}
                  onChange={(e) => setGarageName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none"
                />
              </div>

              {/* Dynamic Items Rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Danh mục phụ tùng & Công bảo dưỡng
                  </label>
                  <button
                    type="button"
                    onClick={addServiceRow}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm mục
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {serviceItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Tên phụ tùng / Hạng mục..."
                          value={item.item_name}
                          onChange={(e) => updateServiceRow(idx, 'item_name', e.target.value)}
                          required
                          className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                        {serviceItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeServiceRow(idx)}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Nhóm</span>
                          <select
                            value={item.category}
                            onChange={(e) => updateServiceRow(idx, 'category', e.target.value)}
                            className="w-full p-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-[11px]"
                          >
                            <option value="ENGINE_CHASSIS">Máy / Gầm</option>
                            <option value="BODY_PAINT">Đồng sơn</option>
                            <option value="ADDITIVE">Phụ gia</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Đơn giá (đ)</span>
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => updateServiceRow(idx, 'unit_price', Number(e.target.value))}
                            className="w-full p-1 bg-slate-900 border border-slate-700 rounded text-slate-100 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Bắt buộc?</span>
                          <div className="flex items-center h-6">
                            <input
                              type="checkbox"
                              checked={item.is_mandatory}
                              onChange={(e) => updateServiceRow(idx, 'is_mandatory', e.target.checked)}
                              className="w-4 h-4 accent-cyan-500"
                            />
                            <span className="text-[10px] text-slate-400 ml-1">
                              {item.is_mandatory ? 'Bắt buộc' : 'Phụ gia'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Tổng tiền dự tính:</span>
                <strong className="text-emerald-400 font-mono text-base">
                  {totalServiceCalc.toLocaleString('vi-VN')} đ
                </strong>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-98 text-sm"
              >
                Lưu Phiếu Bảo Dưỡng
              </button>
            </form>
          )}

          {/* 3. EXPENSE FORM */}
          {activeMode === 'expense' && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Khoản chi</label>
                <input
                  type="text"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Danh mục</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none"
                  >
                    <option value="TOLL_VETC">Phí Cầu Đường VETC/ePass</option>
                    <option value="PARKING">Gửi xe chung cư / văn phòng</option>
                    <option value="INSURANCE">Bảo hiểm Thân vỏ / TNDS</option>
                    <option value="REGISTRATION">Đăng kiểm & Phí đường bộ</option>
                    <option value="WASH">Rửa xe & Spa chăm sóc</option>
                    <option value="OTHER">Chi phí khác</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Số tiền (VNĐ)</label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-purple-300 font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all active:scale-98 text-sm mt-2"
              >
                Lưu Chi Phí
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
