import { 
  INITIAL_VEHICLE, 
  INITIAL_SERVICE_LOGS, 
  INITIAL_FUEL_LOGS, 
  INITIAL_EXPENSE_LOGS, 
  INITIAL_REMINDERS 
} from '../data/mockData.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const STORAGE_KEYS = {
  VEHICLE: 'elantra_app_vehicle_v2',
  SERVICE_LOGS: 'elantra_app_services_v2',
  FUEL_LOGS: 'elantra_app_fuel_v2',
  EXPENSES: 'elantra_app_expenses_v2',
  REMINDERS: 'elantra_app_reminders_v2',
};

const safeGetStorage = (key) => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const safeSetStorage = (key, value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const safeRemoveStorage = (key) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Helper format tiền tệ VNĐ
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// Helper format số km
export const formatKm = (km) => {
  return new Intl.NumberFormat('vi-VN').format(km || 0) + ' km';
};

// Helper so khớp phụ tùng thông minh (Smart Automotive Keyword Matcher)
export const isReminderMatched = (remItemType, logItemName) => {
  const rem = (remItemType || '').toLowerCase();
  const log = (logItemName || '').toLowerCase();

  // 1. Nhớt động cơ
  if (
    (rem.includes('nhớt động cơ') || rem.includes('dầu động cơ') || rem.includes('nhớt máy')) && 
    (log.includes('nhớt') || log.includes('dầu động cơ') || log.includes('dầu máy') || log.includes('5w-30') || log.includes('5w30') || log.includes('engine oil'))
  ) {
    return true;
  }

  // 2. Lọc nhớt
  if (
    rem.includes('lọc nhớt') && 
    (log.includes('lọc nhớt') || log.includes('lọc dầu') || log.includes('oil filter') || log.includes('2630035505'))
  ) {
    return true;
  }

  // 3. Lọc gió động cơ
  if (
    rem.includes('lọc gió động cơ') && 
    (log.includes('lọc gió động cơ') || (log.includes('lọc gió') && !log.includes('lạnh') && !log.includes('điều hòa') && !log.includes('cabin')))
  ) {
    return true;
  }

  // 4. Lọc gió máy lạnh / Cabin filter
  if (
    (rem.includes('máy lạnh') || rem.includes('cabin') || rem.includes('điều hòa')) && 
    (log.includes('máy lạnh') || log.includes('cabin') || log.includes('điều hòa') || log.includes('lọc gió cabin'))
  ) {
    return true;
  }

  // 5. Lọc xăng
  if (
    rem.includes('lọc xăng') && 
    (log.includes('lọc xăng') || log.includes('lọc nhiên liệu') || log.includes('31112c1000') || log.includes('fuel filter'))
  ) {
    return true;
  }

  // 6. Phanh & Dầu phanh
  if (
    rem.includes('phanh') && 
    (log.includes('phanh') || log.includes('thắng') || log.includes('brake') || log.includes('dot4'))
  ) {
    return true;
  }

  // 7. Bugi đánh lửa
  if (
    rem.includes('bugi') && 
    (log.includes('bugi') || log.includes('spark plug') || log.includes('iridium'))
  ) {
    return true;
  }

  // 8. Dầu hộp số tự động
  if (
    rem.includes('hộp số') && 
    (log.includes('hộp số') || log.includes('atf') || log.includes('transmission'))
  ) {
    return true;
  }

  // Fallback string matching
  return rem.includes(log) || log.includes(rem);
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
    const savedVehicle = safeGetStorage(STORAGE_KEYS.VEHICLE);
    const savedServices = safeGetStorage(STORAGE_KEYS.SERVICE_LOGS);
    const savedFuel = safeGetStorage(STORAGE_KEYS.FUEL_LOGS);
    const savedExpenses = safeGetStorage(STORAGE_KEYS.EXPENSES);
    const savedReminders = safeGetStorage(STORAGE_KEYS.REMINDERS);

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
      // Sắp xếp theo ODO giảm dần để lấy chính xác lần đổ đầy bình gần nhất
      const sortedLogs = [...existingFuelLogs].sort((a, b) => (Number(b.odo) || 0) - (Number(a.odo) || 0));
      const lastFullLog = sortedLogs.find(f => f.is_full_tank && Number(f.odo) < newOdo);
      if (lastFullLog && newOdo > Number(lastFullLog.odo)) {
        const deltaKm = newOdo - Number(lastFullLog.odo);
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
    safeSetStorage(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(updatedFuelLogs));
    safeSetStorage(STORAGE_KEYS.VEHICLE, JSON.stringify(updatedVehicle));

    return { newLog, updatedVehicle, updatedFuelLogs };
  },

  // Thêm lần bảo dưỡng mới (Drivvo Smart Reset Logic)
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

    // Tự động reset và cập nhật các nhắc nhở bảo dưỡng liên quan bằng so khớp từ khóa thông minh
    const updatedReminders = existingReminders.map(rem => {
      const matched = serviceData.items.some(item => isReminderMatched(rem.item_type, item.item_name));

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
          status: 'OK',
        };
      }
      return rem;
    });

    const updatedVehicle = {
      ...currentVehicle,
      current_odo: Math.max(currentVehicle.current_odo, newOdo),
    };

    const updatedServices = [newLog, ...existingServices];
    safeSetStorage(STORAGE_KEYS.SERVICE_LOGS, JSON.stringify(updatedServices));
    safeSetStorage(STORAGE_KEYS.REMINDERS, JSON.stringify(updatedReminders));
    safeSetStorage(STORAGE_KEYS.VEHICLE, JSON.stringify(updatedVehicle));

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
    safeSetStorage(STORAGE_KEYS.EXPENSES, JSON.stringify(updatedExpenses));
    return { newLog, updatedExpenses };
  },

  // Reset về dữ liệu mẫu thực tế ban đầu
  resetToDefault() {
    safeRemoveStorage(STORAGE_KEYS.VEHICLE);
    safeRemoveStorage(STORAGE_KEYS.SERVICE_LOGS);
    safeRemoveStorage(STORAGE_KEYS.FUEL_LOGS);
    safeRemoveStorage(STORAGE_KEYS.EXPENSES);
    safeRemoveStorage(STORAGE_KEYS.REMINDERS);
    return {
      vehicle: INITIAL_VEHICLE,
      serviceLogs: INITIAL_SERVICE_LOGS,
      fuelLogs: INITIAL_FUEL_LOGS,
      expenses: INITIAL_EXPENSE_LOGS,
      reminders: INITIAL_REMINDERS,
    };
  }
};
