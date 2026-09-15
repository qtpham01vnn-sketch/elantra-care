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
export const calculateReminderStatus = (reminder, currentOdo) => {
  const odoRemaining = reminder.next_due_odo - currentOdo;
  const today = new Date();
  const dueDate = new Date(reminder.next_due_date);
  const diffTime = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: vehicle, error: vErr } = await supabase.from('vehicles').select('*').limit(1).maybeSingle();
        const { data: serviceLogs, error: sErr } = await supabase.from('service_logs').select('*, items:service_items(*)').order('service_date', { ascending: false });
        const { data: fuelLogs, error: fErr } = await supabase.from('fuel_logs').select('*').order('fuel_date', { ascending: false });
        const { data: expenses, error: eErr } = await supabase.from('expense_logs').select('*').order('expense_date', { ascending: false });
        const { data: reminders, error: rErr } = await supabase.from('maintenance_reminders').select('*');

        if (vehicle && !vErr) {
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
        console.warn('Supabase fetch error, fallback to local storage:', err);
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

  // Thêm lần đổ xăng mới
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

    // Nếu có Supabase, insert vào database Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('fuel_logs').insert([{
          vehicle_id: currentVehicle.id,
          fuel_date: newLog.fuel_date,
          odo: newLog.odo,
          liters: newLog.liters,
          price_per_liter: newLog.price_per_liter,
          total_cost: newLog.total_cost,
          is_full_tank: newLog.is_full_tank,
          is_missed: newLog.is_missed,
          gas_station: newLog.gas_station,
          consumption_l_100km: newLog.consumption_l_100km,
          cost_per_km: newLog.cost_per_km,
          notes: newLog.notes,
        }]);
      } catch (err) {
        console.warn('Error syncing fuel log to Supabase:', err);
      }
    }

    const updatedVehicle = {
      ...currentVehicle,
      current_odo: Math.max(currentVehicle.current_odo, newOdo),
    };

    const updatedFuelLogs = [newLog, ...existingFuelLogs];
    localStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updatedFuelLogs));
    localStorage.setItem(STORAGE_KEYS.VEHICLE, JSON.stringify(updatedVehicle));

    return { newLog, updatedVehicle, updatedFuelLogs };
  },

  // Thêm lần bảo dưỡng mới
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

    // Nếu có Supabase, insert vào database Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: insertedService } = await supabase.from('service_logs').insert([{
          vehicle_id: currentVehicle.id,
          service_date: newLog.service_date,
          odo: newLog.odo,
          service_type: newLog.service_type,
          garage_type: newLog.garage_type,
          garage_name: newLog.garage_name,
          total_amount: newLog.total_amount,
          invoice_urls: newLog.invoice_urls,
          notes: newLog.notes,
        }]).select().single();

        if (insertedService && insertedService.id) {
          const itemsToInsert = serviceData.items.map(it => ({
            service_log_id: insertedService.id,
            item_name: it.item_name,
            item_code: it.item_code || null,
            category: it.category || 'ENGINE_CHASSIS',
            subcategory: it.subcategory || null,
            is_mandatory: it.is_mandatory !== false,
            quantity: Number(it.quantity || 1),
            unit_price: Number(it.unit_price || 0),
            labor_price: Number(it.labor_price || 0),
            total_price: Number(it.total_price || 0),
          }));
          await supabase.from('service_items').insert(itemsToInsert);
        }
      } catch (err) {
        console.warn('Error syncing service log to Supabase:', err);
      }
    }

    // Cập nhật nhắc nhở bảo dưỡng liên quan
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

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('expense_logs').insert([{
          vehicle_id: currentVehicle.id,
          expense_date: newLog.expense_date,
          category: newLog.category,
          title: newLog.title,
          amount: newLog.amount,
          odo: newLog.odo,
          notes: newLog.notes,
        }]);
      } catch (err) {
        console.warn('Error syncing expense to Supabase:', err);
      }
    }

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
