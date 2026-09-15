import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardTab from './components/DashboardTab';
import TimelineTab from './components/TimelineTab';
import ReportsTab from './components/ReportsTab';
import RemindersTab from './components/RemindersTab';
import QuickAddModal from './components/QuickAddModal';
import { vehicleService, calculateReminderStatus } from './services/vehicleService';
import { 
  INITIAL_VEHICLE, 
  INITIAL_SERVICE_LOGS, 
  INITIAL_FUEL_LOGS, 
  INITIAL_EXPENSE_LOGS, 
  INITIAL_REMINDERS 
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialMode, setQuickAddInitialMode] = useState('fuel');

  // App Main State - Initialized synchronously with rich default data
  const [vehicle, setVehicle] = useState(INITIAL_VEHICLE);
  const [serviceLogs, setServiceLogs] = useState(INITIAL_SERVICE_LOGS);
  const [fuelLogs, setFuelLogs] = useState(INITIAL_FUEL_LOGS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSE_LOGS);
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);

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
    if (window.confirm('Khôi phục lại toàn bộ dữ liệu mẫu thực tế của xe Hyundai Elantra 2023 (60K-228.98) tại mốc 65.010 km?')) {
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

  // Calculate Alerts Count
  const evaluatedReminders = (reminders || []).map(r => calculateReminderStatus(r, vehicle.current_odo));
  const activeAlertsCount = evaluatedReminders.filter(r => r.status === 'OVERDUE' || r.status === 'DUE_SOON').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header 
        vehicle={vehicle} 
        onReset={handleReset} 
        activeAlertsCount={activeAlertsCount} 
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
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab 
            serviceLogs={serviceLogs}
            fuelLogs={fuelLogs}
            expenses={expenses}
            currentOdo={vehicle.current_odo}
            onOpenQuickAdd={openQuickAddWithMode}
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
    </div>
  );
}
