import React from 'react';
import { LayoutDashboard, History, Plus, BarChart3, BellRing, ShieldCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onOpenQuickAdd, alertCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Sức khỏe', icon: LayoutDashboard },
    { id: 'profile', label: 'Hồ sơ xe', icon: ShieldCheck },
    { id: 'quick_add', label: 'Thêm', icon: Plus, isAction: true },
    { id: 'timeline', label: 'Nhật ký', icon: History },
    { id: 'reminders', label: 'Mốc hạn', icon: BellRing, badge: alertCount },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={onOpenQuickAdd}
                className="relative -top-5 flex flex-col items-center group focus:outline-none"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 transform group-hover:scale-105 active:scale-95 transition-all border-4 border-slate-950">
                  <Plus className="w-7 h-7 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 mt-0.5">Nhập nhanh</span>
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-cyan-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
