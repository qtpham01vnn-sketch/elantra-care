import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardTab from './components/DashboardTab';
import TimelineTab from './components/TimelineTab';
import ReportsTab from './components/ReportsTab';
import RemindersTab from './components/RemindersTab';
import VehicleProfileTab from './components/VehicleProfileTab';
import QuickAddModal from './components/QuickAddModal';
import ExportLogbookModal from './components/ExportLogbookModal';
import DigitalGloveboxModal from './components/DigitalGloveboxModal';
import SOSToolkitModal from './components/SOSToolkitModal';
import TripCostCalculatorModal from './components/TripCostCalculatorModal';
import VETCWalletModal from './components/VETCWalletModal';
import PhatNguoiLookupModal from './components/PhatNguoiLookupModal';
import SmartVehicleQRModal from './components/SmartVehicleQRModal';
import { vehicleService, calculateReminderStatus } from './services/vehicleService';
import { 
  INITIAL_VEHICLE, 
  INITIAL_SERVICE_LOGS, 
  INITIAL_FUEL_LOGS, 
  INITIAL_EXPENSE_LOGS, 
  INITIAL_REMINDERS,
  INITIAL_LEGAL_DOCUMENTS 
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGloveboxOpen, setIsGloveboxOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isTripCalcOpen, setIsTripCalcOpen] = useState(false);
  const [isVetcOpen, setIsVetcOpen] = useState(false);
  const [isPhatNguoiOpen, setIsPhatNguoiOpen] = useState(false);
  const [isSmartQrOpen, setIsSmartQrOpen] = useState(false);
  const [quickAddInitialMode, setQuickAddInitialMode] = useState('fuel');

  // App Main State
  const [vehicle, setVehicle] = useState(INITIAL_VEHICLE);
  const [serviceLogs, setServiceLogs] = useState(INITIAL_SERVICE_LOGS);
  const [fuelLogs, setFuelLogs] = useState(INITIAL_FUEL_LOGS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSE_LOGS);
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [notificationBanner, setNotificationBanner] = useState(null);

  // Listen to messages from Service Worker when a user clicks push notification
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleSwMessage = (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_ACTION') {
          setActiveTab('reminders');
          setNotificationBanner({
            title: event.data.title || '🚗 Hyundai Elantra 60K-228.98',
            message: 'Đã mở từ thông báo điện thoại! Dưới đây là các hạng mục bảo dưỡng & bảo hiểm cần chú ý.'
          });
          setTimeout(() => setNotificationBanner(null), 7000);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage);
    }
  }, []);

  // Check URL query params for notification click redirect
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('notif=')) {
      setActiveTab('reminders');
      setNotificationBanner({
        title: '🚗 Hyundai Elantra 60K-228.98',
        message: 'Đã mở từ thông báo điện thoại! Dưới đây là các hạng mục bảo dưỡng & bảo hiểm cần chú ý.'
      });
      setTimeout(() => setNotificationBanner(null), 7000);
    }
  }, []);

  // Load Data on Mount from LocalStorage or Supabase
  useEffect(() => {
    const initData = async () => {
      try {
        const data = await vehicleService.getAllData();
        if (data && data.vehicle) {
          setVehicle(data.vehicle);
          setServiceLogs(data.serviceLogs || INITIAL_SERVICE_LOGS);
          setFuelLogs(data.fuelLogs || INITIAL_FUEL_LOGS);
          setExpenses(data.expenses || INITIAL_EXPENSE_LOGS);
          setReminders(data.reminders || INITIAL_REMINDERS);
        }
      } catch (err) {
        console.warn('Error loading persisted data:', err);
      }
    };
    initData();
  }, []);

  // Reset to Realistic Mock Data
  const handleReset = () => {
    if (window.confirm('Khôi phục lại toàn bộ dữ liệu mẫu thực tế của xe Hyundai Elantra 2022 (60K-228.98) tại mốc 65.023 km?')) {
      const defaultData = vehicleService.resetToDefault();
      setVehicle(defaultData.vehicle);
      setServiceLogs(defaultData.serviceLogs);
      setFuelLogs(defaultData.fuelLogs);
      setExpenses(defaultData.expenses);
      setReminders(defaultData.reminders);
    }
  };

  // Add Fuel Handler
  const handleAddFuel = async (fuelData) => {
    const { newLog, updatedVehicle, updatedFuelLogs } = await vehicleService.addFuelLog(
      fuelData,
      vehicle,
      fuelLogs
    );
    setVehicle(updatedVehicle);
    setFuelLogs(updatedFuelLogs);
  };

  // Add Service Handler
  const handleAddService = async (serviceData) => {
    const { newLog, updatedVehicle, updatedServices, updatedReminders } = await vehicleService.addServiceLog(
      serviceData,
      vehicle,
      serviceLogs,
      reminders
    );
    setVehicle(updatedVehicle);
    setServiceLogs(updatedServices);
    setReminders(updatedReminders);
  };

  // Add Expense Handler
  const handleAddExpense = async (expenseData) => {
    const { newLog, updatedExpenses } = await vehicleService.addExpenseLog(
      expenseData,
      vehicle,
      expenses
    );
    setExpenses(updatedExpenses);
  };

  // Quick Open Modal with Mode
  const openQuickAddWithMode = (mode = 'fuel') => {
    setQuickAddInitialMode(mode);
    setIsQuickAddOpen(true);
  };

  // Calculate Alerts Count (Phụ Tùng Bảo Dưỡng + Hạn Bảo Hiểm & Đăng Kiểm)
  const evaluatedReminders = (reminders || []).map(r => calculateReminderStatus(r, vehicle.current_odo));
  const maintenanceAlertsCount = evaluatedReminders.filter(r => r.status === 'OVERDUE' || r.status === 'DUE_SOON').length;

  const legalAlertsCount = (INITIAL_LEGAL_DOCUMENTS || []).filter(doc => {
    if (!doc.expiry_date) return false;
    const days = Math.ceil((new Date(doc.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= (doc.alert_days || 30);
  }).length;

  const activeAlertsCount = maintenanceAlertsCount + legalAlertsCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header 
        vehicle={vehicle} 
        onReset={handleReset} 
        onOpenExport={() => setIsExportOpen(true)}
        activeAlertsCount={activeAlertsCount} 
        onNavigateToProfile={() => setActiveTab('profile')}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-10">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            vehicle={vehicle}
            serviceLogs={serviceLogs}
            fuelLogs={fuelLogs}
            expenses={expenses}
            reminders={reminders}
            onNavigateTab={setActiveTab}
            onOpenQuickAdd={openQuickAddWithMode}
            onOpenGlovebox={() => setIsGloveboxOpen(true)}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenTripCalc={() => setIsTripCalcOpen(true)}
            onOpenVETC={() => setIsVetcOpen(true)}
            onOpenPhatNguoi={() => setIsPhatNguoiOpen(true)}
            onOpenSmartQR={() => setIsSmartQrOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <VehicleProfileTab 
            vehicle={vehicle}
            onOpenQuickAdd={openQuickAddWithMode}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab 
            serviceLogs={serviceLogs}
            fuelLogs={fuelLogs}
            expenses={expenses}
            currentOdo={vehicle.current_odo}
            onOpenQuickAdd={openQuickAddWithMode}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenTripCalc={() => setIsTripCalcOpen(true)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab 
            vehicle={vehicle}
            serviceLogs={serviceLogs}
            fuelLogs={fuelLogs}
            expenses={expenses}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersTab 
            reminders={reminders}
            currentOdo={vehicle.current_odo}
            onAddServiceFromReminder={(rem) => openQuickAddWithMode('service')}
          />
        )}
      </main>

      {/* Real-time Push Notification Triggered Banner */}
      {notificationBanner && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 rounded-2xl shadow-2xl border border-blue-400/40 flex items-start gap-3 backdrop-blur-md">
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0 mt-0.5 animate-bounce">
              <span className="text-xl">🔔</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-yellow-300 flex items-center gap-1.5">
                {notificationBanner.title}
              </h4>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                {notificationBanner.message}
              </p>
            </div>
            <button 
              onClick={() => setNotificationBanner(null)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => openQuickAddWithMode('fuel')}
        alertCount={activeAlertsCount}
      />

      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        initialMode={quickAddInitialMode}
        currentOdo={vehicle.current_odo}
        onAddFuel={handleAddFuel}
        onAddService={handleAddService}
        onAddExpense={handleAddExpense}
      />

      {/* Export Digital Logbook Modal */}
      <ExportLogbookModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        vehicle={vehicle}
        serviceLogs={serviceLogs}
        reminders={reminders}
      />

      {/* Digital Glovebox Modal */}
      <DigitalGloveboxModal
        isOpen={isGloveboxOpen}
        onClose={() => setIsGloveboxOpen(false)}
        vehicle={vehicle}
      />

      {/* SOS Toolkit Modal */}
      <SOSToolkitModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        vehicle={vehicle}
      />

      {/* Trip Cost Calculator Modal */}
      <TripCostCalculatorModal
        isOpen={isTripCalcOpen}
        onClose={() => setIsTripCalcOpen(false)}
        vehicle={vehicle}
      />

      {/* VETC Wallet Modal */}
      <VETCWalletModal
        isOpen={isVetcOpen}
        onClose={() => setIsVetcOpen(false)}
        vehicle={vehicle}
      />

      {/* Traffic Fine Lookup Modal */}
      <PhatNguoiLookupModal
        isOpen={isPhatNguoiOpen}
        onClose={() => setIsPhatNguoiOpen(false)}
        vehicle={vehicle}
      />

      {/* Smart Vehicle QR Modal */}
      <SmartVehicleQRModal
        isOpen={isSmartQrOpen}
        onClose={() => setIsSmartQrOpen(false)}
        vehicle={vehicle}
      />
    </div>
  );
}
