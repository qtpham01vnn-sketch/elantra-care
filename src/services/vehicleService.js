import { 
  INITIAL_VEHICLE, 
  INITIAL_SERVICE_LOGS, 
  INITIAL_FUEL_LOGS, 
  INITIAL_EXPENSE_LOGS, 
  INITIAL_REMINDERS 
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  VEHICLE: 'elantra_app_vehicle_v2',
  SERVICE_LOGS: 'elantra_app_services_v2',
  FUEL_LOGS: 'elantra_app_fuel_v2',
  EXPENSES: 'elantra_app_expenses_v2',
  REMINDERS: 'elantra_app_reminders_v2',
};

// Helper format tiền tệ VNĐ
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// Helper format số km
export const formatKm = (km) => {
  return new Intl.NumberFormat('vi-VN').format(km || 0) + ' km';
};

// Helper tính trạng thái bảo dưỡng kép (Drivvo Dual Trigger: ODO & Ngày)
// Chuẩn logic:
// - ĐỎ 'Quá hạn': Đã dùng >= 100% hoặc km còn lại <= 0 hoặc ngày còn lại <= 0
// - VÀNG 'Sắp đến hạn': Đã dùng từ 80% - 99% hoặc km còn lại <= 500km / ngày còn lại <= 15 ngày
// - XANH 'Tốt': Dưới 80%
export const calculateReminderStatus = (reminder, currentOdo) => {
  const odoRemaining = reminder.next_due_odo - currentOdo;
  const today = new Date();
  const dueDate = new Date(reminder.next_due_date);
  const diffTime = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Tính % tuổi thọ đã dùng dựa trên quãng đường
  const kmUsed = Math.max(0, currentOdo - reminder.last_service_odo);
  const percentKmUsed = Math.round((kmUsed / reminder.interval_km) * 100);

  let status = 'OK';
  if (percentKmUsed >= 100 || odoRemaining <= 0 || daysRemaining <= 0) {
    status = 'OVERDUE';
  } else if (
    (percentKmUsed >= 80 && percentKmUsed < 100) || 
    odoRemaining <= (reminder.alert_threshold_km || 500) || 
    daysRemaining <= (reminder.alert_threshold_days || 15)
  ) {
    status = 'DUE_SOON';
  } else {
    status = 'OK';
  }

  return {
    ...reminder,
    odoRemaining,
    daysRemaining,
    percentKmUsed: Math.min(100, percentKmUsed),
    status,
  };
};

export const vehicleService = {
  // Lấy toàn bộ dữ liệu ứng dụng
  async getAllData() {
    if (isSupabaseConfigured) {
      try {
        const { data: vehicle } = await supabase.from('vehicles').select('*').single();
        const { data: serviceLogs } = await supabase.from('service_logs').select('*, items:service_items(*)').order('service_date', { ascending: false });
        const { data: fuelLogs } = await supabase.from('fuel_logs').select('*').order('fuel_date', { ascending: false });
        const { data: expenses } = await supabase.from('expense_logs').select('*').order('expense_date', { ascending: false });
        const { data: reminders } = await supabase.from('maintenance_reminders').select('*');

        if (vehicle) {
          return {
            vehicle,
            serviceLogs: serviceLogs || [],
            fuelLogs: fuelLogs || [],
            expenses: expenses || [],
            reminders: reminders || [],
            source: 'supabase',
          };
        }
      } catch (err) {
        console.warn('Failed to fetch from Supabase, falling back to local storage:', err);
      }
    }

    // Local Storage Fallback Mode
    const savedVehicle = localStorage.getItem(STORAGE_KEYS.VEHICLE);
    const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICE_LOGS);
    const savedFuel = localStorage.getItem(STORAGE_KEYS.FUEL_LOGS);
    const savedExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const savedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);

    return {
      vehicle: savedVehicle ? JSON.parse(savedVehicle) : INITIAL_VEHICLE,
      serviceLogs: savedServices ? JSON.parse(savedServices) : INITIAL_SERVICE_LOGS,
      fuelLogs: savedFuel ? JSON.parse(savedFuel) : INITIAL_FUEL_LOGS,
      expenses: savedExpenses ? JSON.parse(savedExpenses) : INITIAL_EXPENSE_LOGS,
      reminders: savedReminders ? JSON.parse(savedReminders) : INITIAL_REMINDERS,
      source: 'local',
    };
  },

  // Thêm lần đổ xăng mới (Fuelio Full Tank Logic)
  async addFuelLog(logData, currentVehicle, existingFuelLogs) {
    const newOdo = Number(logData.odo);
    const liters = Number(logData.liters);
    const totalCost = Number(logData.totalCost);
    const pricePerLiter = liters > 0 ? Math.round(totalCost / liters) : 0;
    
    let consumption_l_100km = null;
    let cost_per_km = null;

    if (existingFuelLogs.length > 0) {
      const lastFullLog = existingFuelLogs.find(f => f.is_full_tank);
      if (lastFullLog && newOdo > lastFullLog.odo) {
        const deltaKm = newOdo - lastFullLog.odo;
        consumption_l_100km = Number(((liters / deltaKm) * 100).toFixed(2));
        cost_per_km = Number((totalCost / deltaKm).toFixed(0));
      }
    }

    const newLog = {
      id: 'fuel-' + Date.now(),
      vehicle_id: currentVehicle.id,
      fuel_date: logData.fuelDate || new Date().toISOString().split('T')[0],
      odo: newOdo,
      liters,
      price_per_liter: pricePerLiter,
      total_cost: totalCost,
      is_full_tank: logData.isFullTank ?? true,
      is_missed: logData.isMissed ?? false,
      gas_station: logData.gasStation || 'Petrolimex',
      consumption_l_100km,
      cost_per_km,
      notes: logData.notes || '',
    };

    const updatedVehicle = {
      ...currentVehicle,
      current_odo: Math.max(currentVehicle.current_odo, newOdo),
    };

    const updatedFuelLogs = [newLog, ...existingFuelLogs];
    localStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updatedFuelLogs));
    localStorage.setItem(STORAGE_KEYS.VEHICLE, JSON.stringify(updatedVehicle));

    return { newLog, updatedVehicle, updatedFuelLogs };
  },

  // Thêm lần bảo dưỡng mới (Drivvo Service Items & Invoice Logic)
  async addServiceLog(serviceData, currentVehicle, existingServices, existingReminders) {
    const newOdo = Number(serviceData.odo);
    const totalAmount = serviceData.items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);

    const newLog = {
      id: 'srv-' + Date.now(),
      vehicle_id: currentVehicle.id,
      service_date: serviceData.serviceDate || new Date().toISOString().split('T')[0],
      odo: newOdo,
      service_type: serviceData.serviceType || 'PERIODIC',
      garage_type: serviceData.garageType || 'HANG',
      garage_name: serviceData.garageName || 'Hyundai Workshop',
      total_amount: totalAmount,
      invoice_urls: serviceData.invoiceUrls || [],
      notes: serviceData.notes || '',
      items: serviceData.items.map((it, idx) => ({
        ...it,
        id: `item-${Date.now()}-${idx}`,
      })),
    };

    // Tự động reset và cập nhật các nhắc nhở bảo dưỡng liên quan
    const updatedReminders = existingReminders.map(rem => {
      const matched = serviceData.items.some(item => 
        item.item_name.toLowerCase().includes(rem.item_type.toLowerCase()) ||
        rem.item_type.toLowerCase().includes(item.item_name.toLowerCase())
      );

      if (matched) {
        const nextDueOdo = newOdo + rem.interval_km;
        const nextDueDate = new Date(serviceData.serviceDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + rem.interval_months);

        return {
          ...rem,
          last_service_odo: newOdo,
          last_service_date: serviceData.serviceDate,
          next_due_odo: nextDueOdo,
          next_due_date: nextDueDate.toISOString().split('T')[0],
        };
      }
      return rem;
    });

    const updatedVehicle = {
      ...currentVehicle,
      current_odo: Math.max(currentVehicle.current_odo, newOdo),
    };

    const updatedServices = [newLog, ...existingServices];
    localStorage.setItem(STORAGE_KEYS.SERVICE_LOGS, JSON.stringify(updatedServices));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updatedReminders));
    localStorage.setItem(STORAGE_KEYS.VEHICLE, JSON.stringify(updatedVehicle));

    return { newLog, updatedVehicle, updatedServices, updatedReminders };
  },

  // Thêm chi phí khác
  async addExpenseLog(expenseData, currentVehicle, existingExpenses) {
    const newLog = {
      id: 'exp-' + Date.now(),
      vehicle_id: currentVehicle.id,
      expense_date: expenseData.expenseDate || new Date().toISOString().split('T')[0],
      category: expenseData.category || 'OTHER',
      title: expenseData.title || 'Chi phí vận hành',
      amount: Number(expenseData.amount || 0),
      odo: expenseData.odo ? Number(expenseData.odo) : currentVehicle.current_odo,
      notes: expenseData.notes || '',
    };

    const updatedExpenses = [newLog, ...existingExpenses];
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
    return { newLog, updatedExpenses };
  },

  // Reset về dữ liệu mẫu thực tế ban đầu
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.VEHICLE);
    localStorage.removeItem(STORAGE_KEYS.SERVICE_LOGS);
    localStorage.removeItem(STORAGE_KEYS.FUEL_LOGS);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    return {
      vehicle: INITIAL_VEHICLE,
      serviceLogs: INITIAL_SERVICE_LOGS,
      fuelLogs: INITIAL_FUEL_LOGS,
      expenses: INITIAL_EXPENSE_LOGS,
      reminders: INITIAL_REMINDERS,
    };
  }
};
