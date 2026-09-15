-- ==============================================================================
-- HYUNDAI ELANTRA (60K-228.98) - VEHICLE MAINTENANCE & COST MANAGEMENT SCHEMA
-- Inspired by Drivvo & Fuelio Mechanics
-- Compatible with Supabase PostgreSQL & SQL Editor
-- ==============================================================================

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLES
-- 2.1 Bảng Phương tiện (Vehicles)
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID DEFAULT auth.uid(),
    make VARCHAR(50) NOT NULL DEFAULT 'Hyundai',
    model VARCHAR(50) NOT NULL DEFAULT 'Elantra',
    year INT NOT NULL DEFAULT 2023,
    trim VARCHAR(50) DEFAULT '2.0 AT',
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    vin VARCHAR(50),
    current_odo INT NOT NULL DEFAULT 0,
    fuel_capacity NUMERIC(5,2) DEFAULT 47.0, -- Dung tích bình xăng Elantra ~47L
    fuel_type VARCHAR(20) DEFAULT 'RON 95-III',
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Bảng Nhật ký Bảo dưỡng / Sửa chữa (Service Logs)
CREATE TABLE IF NOT EXISTS service_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    odo INT NOT NULL,
    service_type VARCHAR(50) NOT NULL DEFAULT 'PERIODIC', -- PERIODIC (Định kỳ), REPAIR (Sửa chữa), BODY_PAINT (Đồng sơn)
    garage_type VARCHAR(20) NOT NULL DEFAULT 'HANG',      -- HANG (Chính hãng), GARA_NGOAI (Gara ngoài)
    garage_name VARCHAR(150) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    invoice_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Bảng Chi tiết Phụ tùng & Hạng mục Bảo dưỡng (Service Items)
CREATE TABLE IF NOT EXISTS service_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_log_id UUID NOT NULL REFERENCES service_logs(id) ON DELETE CASCADE,
    item_name VARCHAR(200) NOT NULL,
    item_code VARCHAR(100), -- Mã phụ tùng chính hãng (vd: 31112C1000)
    category VARCHAR(50) NOT NULL DEFAULT 'ENGINE_CHASSIS', -- ENGINE_CHASSIS (Máy/Gầm), BODY_PAINT (Đồng sơn), CONSUMABLE (Tiêu hao), ADDITIVE (Phụ gia)
    subcategory VARCHAR(50), -- OIL, FILTER, BRAKE, PAINT, LABOR...
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE: Bắt buộc theo cấp bảo dưỡng, FALSE: Phụ gia khuyến nghị thêm (vd: MT-10 EFFI)
    quantity NUMERIC(6,2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    labor_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    warranty_months INT DEFAULT 0,
    warranty_km INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Bảng Nhật ký Đổ Xăng (Fuel Logs - Fuelio Full Tank Algorithm)
CREATE TABLE IF NOT EXISTS fuel_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    fuel_date DATE NOT NULL DEFAULT CURRENT_DATE,
    odo INT NOT NULL,
    liters NUMERIC(6,2) NOT NULL,
    price_per_liter NUMERIC(10,2) NOT NULL,
    total_cost NUMERIC(12,2) NOT NULL,
    is_full_tank BOOLEAN NOT NULL DEFAULT TRUE,  -- Cờ đầy bình chuẩn Fuelio
    is_missed BOOLEAN NOT NULL DEFAULT FALSE,    -- Cờ bỏ sót lần đổ trước
    gas_station VARCHAR(150),                    -- Cây xăng (Petrolimex, PVOIL...)
    consumption_l_100km NUMERIC(5,2),            -- Mức tiêu thụ tự tính (L/100km)
    cost_per_km NUMERIC(8,2),                    -- Chi phí tiền xăng/km
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Bảng Chi phí khác (Expense Logs - Phí cầu đường, Bảo hiểm, Đăng kiểm, Rửa xe...)
CREATE TABLE IF NOT EXISTS expense_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    category VARCHAR(50) NOT NULL, -- TOLL_VETC, PARKING, INSURANCE, REGISTRATION, WASH, FINE, ACCESSORY, OTHER
    title VARCHAR(150) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    odo INT,
    invoice_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Bảng Nhắc nhở Bảo dưỡng Kép (Maintenance Reminders - Drivvo Dual Trigger)
CREATE TABLE IF NOT EXISTS maintenance_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    item_type VARCHAR(100) NOT NULL, -- Thay nhớt động cơ, Lọc nhớt, Lọc gió động cơ, Lọc gió máy lạnh, Lọc xăng, Dầu phanh, Nước làm mát, Bugi...
    category VARCHAR(50) DEFAULT 'CONSUMABLE',
    interval_km INT NOT NULL DEFAULT 5000,
    interval_months INT NOT NULL DEFAULT 6,
    last_service_odo INT NOT NULL DEFAULT 0,
    last_service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    next_due_odo INT NOT NULL,
    next_due_date DATE NOT NULL,
    alert_threshold_km INT DEFAULT 500,   -- Cảnh báo trước 500 km
    alert_threshold_days INT DEFAULT 15,  -- Cảnh báo trước 15 ngày
    status VARCHAR(20) DEFAULT 'OK',      -- OK, DUE_SOON (Vàng), OVERDUE (Đỏ)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TRIGGERS & FUNCTIONS (AUTO UPDATE ODO & STATUSES)
-- ==============================================================================

-- 3.1 Hàm tự động cập nhật ODO của xe khi có nhật ký mới
CREATE OR REPLACE FUNCTION update_vehicle_current_odo()
RETURNS TRIGGER AS $$
BEGIN
    -- Nếu ODO mới lớn hơn ODO hiện tại của xe, cập nhật vehicles.current_odo
    IF NEW.odo IS NOT NULL THEN
        UPDATE vehicles
        SET current_odo = GREATEST(current_odo, NEW.odo),
            updated_at = NOW()
        WHERE id = NEW.vehicle_id;

        -- Tự động cập nhật lại status của tất cả reminders liên quan
        UPDATE maintenance_reminders
        SET status = CASE
                WHEN NEW.odo >= next_due_odo OR CURRENT_DATE >= next_due_date THEN 'OVERDUE'
                WHEN (next_due_odo - NEW.odo) <= alert_threshold_km OR (next_due_date - CURRENT_DATE) <= alert_threshold_days THEN 'DUE_SOON'
                ELSE 'OK'
            END,
            updated_at = NOW()
        WHERE vehicle_id = NEW.vehicle_id AND is_active = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gắn trigger cho 3 bảng log
DROP TRIGGER IF EXISTS trg_service_logs_update_odo ON service_logs;
CREATE TRIGGER trg_service_logs_update_odo
AFTER INSERT OR UPDATE ON service_logs
FOR EACH ROW EXECUTE FUNCTION update_vehicle_current_odo();

DROP TRIGGER IF EXISTS trg_fuel_logs_update_odo ON fuel_logs;
CREATE TRIGGER trg_fuel_logs_update_odo
AFTER INSERT OR UPDATE ON fuel_logs
FOR EACH ROW EXECUTE FUNCTION update_vehicle_current_odo();

DROP TRIGGER IF EXISTS trg_expense_logs_update_odo ON expense_logs;
CREATE TRIGGER trg_expense_logs_update_odo
AFTER INSERT OR UPDATE ON expense_logs
FOR EACH ROW EXECUTE FUNCTION update_vehicle_current_odo();

-- ==============================================================================
-- 4. VIEWS THỐNG KÊ CHI PHÍ & VẬN HÀNH (REPORTS & TCO)
-- ==============================================================================

-- 4.1 View tổng hợp chi phí toàn diện theo xe
CREATE OR REPLACE VIEW v_vehicle_cost_summary AS
SELECT 
    v.id AS vehicle_id,
    v.license_plate,
    v.current_odo,
    COALESCE(s.total_service_cost, 0) AS total_service_cost,
    COALESCE(f.total_fuel_cost, 0) AS total_fuel_cost,
    COALESCE(f.total_fuel_liters, 0) AS total_fuel_liters,
    COALESCE(e.total_other_expenses, 0) AS total_other_expenses,
    (COALESCE(s.total_service_cost, 0) + COALESCE(f.total_fuel_cost, 0) + COALESCE(e.total_other_expenses, 0)) AS grand_total_cost,
    ROUND(
        CASE 
            WHEN v.current_odo > 0 THEN 
                (COALESCE(s.total_service_cost, 0) + COALESCE(f.total_fuel_cost, 0) + COALESCE(e.total_other_expenses, 0)) / v.current_odo 
            ELSE 0 
        END, 2
    ) AS cost_per_km
FROM vehicles v
LEFT JOIN (
    SELECT vehicle_id, SUM(total_amount) AS total_service_cost 
    FROM service_logs GROUP BY vehicle_id
) s ON v.id = s.vehicle_id
LEFT JOIN (
    SELECT vehicle_id, SUM(total_cost) AS total_fuel_cost, SUM(liters) AS total_fuel_liters 
    FROM fuel_logs GROUP BY vehicle_id
) f ON v.id = f.vehicle_id
LEFT JOIN (
    SELECT vehicle_id, SUM(amount) AS total_other_expenses 
    FROM expense_logs GROUP BY vehicle_id
) e ON v.id = e.vehicle_id;

-- ==============================================================================
-- 5. SEED DATA THỰC TẾ: HYUNDAI ELANTRA 2023 (60K-228.98) TẠI MỐC 65.010 KM
-- ==============================================================================

DO $$
DECLARE
    v_vehicle_id UUID;
    v_log_hang_id UUID;
    v_log_gara_id UUID;
BEGIN
    -- 5.1 Tạo thông tin xe Elantra
    INSERT INTO vehicles (id, make, model, year, trim, license_plate, vin, current_odo, fuel_capacity, fuel_type)
    VALUES (
        'e1a47a11-2289-4860-9889-000000000001',
        'Hyundai',
        'Elantra',
        2023,
        '2.0 AT',
        '60K-228.98',
        'MALB141CBP0022898',
        65010,
        47.0,
        'RON 95-III'
    )
    ON CONFLICT (license_plate) DO UPDATE 
    SET current_odo = 65010
    RETURNING id INTO v_vehicle_id;

    -- 5.2 Phiếu 1: Hãng Hyundai Ngọc Phát - Bảo dưỡng cấp 3 mốc 60.000 km (hoặc định kỳ)
    INSERT INTO service_logs (id, vehicle_id, service_date, odo, service_type, garage_type, garage_name, total_amount, notes)
    VALUES (
        'a1111111-1111-1111-1111-111111111111',
        v_vehicle_id,
        '2024-04-12',
        60120,
        'PERIODIC',
        'HANG',
        'Hyundai Ngọc Phát (Đồng Nai)',
        4180000,
        'Bảo dưỡng định kỳ Cấp 3 mốc 60.000 km theo tiêu chuẩn Hyundai Motor. Đầy đủ phụ tùng bảo dưỡng và vệ sinh phụ trợ.'
    ) RETURNING id INTO v_log_hang_id;

    -- Chi tiết phiếu 1: Hãng Hyundai Ngọc Phát (Có phân loại is_mandatory)
    INSERT INTO service_items (service_log_id, item_name, item_code, category, subcategory, is_mandatory, quantity, unit_price, labor_price, total_price)
    VALUES 
    (v_log_hang_id, 'Dầu động cơ Shell Helix Ultra Hyundai 5W-30', '0510000441', 'ENGINE_CHASSIS', 'OIL', TRUE, 4.0, 195000, 0, 780000),
    (v_log_hang_id, 'Lọc dầu nhớt động cơ chính hãng Mobis', '2630035505', 'ENGINE_CHASSIS', 'FILTER', TRUE, 1.0, 115000, 0, 115000),
    (v_log_hang_id, 'Cụm lọc xăng chính hãng (Fuel Filter)', '31112C1000', 'ENGINE_CHASSIS', 'FILTER', TRUE, 1.0, 890000, 250000, 1140000),
    (v_log_hang_id, 'Gói vệ sinh & bảo dưỡng 4 cụm phanh', 'SRV-BRK-01', 'ENGINE_CHASSIS', 'BRAKE', TRUE, 1.0, 350000, 150000, 500000),
    (v_log_hang_id, 'Phụ gia bôi trơn bảo vệ động cơ MT-10 EFFI', 'MT10-EFFI-US', 'ADDITIVE', 'ADDITIVE', FALSE, 1.0, 480000, 0, 480000), -- is_mandatory = FALSE
    (v_log_hang_id, 'Combo vệ sinh súc béc phun & buồng đốt 3M', '3M-INJ-CLEAN', 'ADDITIVE', 'ADDITIVE', FALSE, 1.0, 320000, 100000, 420000), -- is_mandatory = FALSE
    (v_log_hang_id, 'Công lao động bảo dưỡng định kỳ Cấp 3', 'LABOR-LV3', 'ENGINE_CHASSIS', 'LABOR', TRUE, 1.0, 745000, 0, 745000);

    -- 5.3 Phiếu 2: Gara Ngoài - 1Car Gara (Tách rõ Máy/Gầm & Đồng Sơn)
    INSERT INTO service_logs (id, vehicle_id, service_date, odo, service_type, garage_type, garage_name, total_amount, notes)
    VALUES (
        'b2222222-2222-2222-2222-222222222222',
        v_vehicle_id,
        '2024-07-20',
        63500,
        'REPAIR',
        'GARA_NGOAI',
        '1Car Gara Garage Chuyên Nghiệp',
        6950000,
        'Kết hợp xử lý bảo dưỡng gầm máy và phục hồi đồng sơn thân vỏ sau va quẹt nhẹ góc phụ.'
    ) RETURNING id INTO v_log_gara_id;

    -- Chi tiết phiếu 2: 1Car Gara
    INSERT INTO service_items (service_log_id, item_name, item_code, category, subcategory, is_mandatory, quantity, unit_price, labor_price, total_price)
    VALUES 
    -- Nhóm Máy / Gầm
    (v_log_gara_id, 'Thay 2 Cao su tăm bông & Bọc bụi phuộc trước', '54626C1000', 'ENGINE_CHASSIS', 'CHASSIS', TRUE, 2.0, 260000, 200000, 720000),
    (v_log_gara_id, 'Bảo dưỡng tra mỡ Cupen ắc thắng & Cân chỉnh thước lái 3D Hunter', 'ALIGN-3D', 'ENGINE_CHASSIS', 'CHASSIS', TRUE, 1.0, 650000, 0, 650000),
    (v_log_gara_id, 'Xịt phủ hóa nhựa chống mục lòng vè 4 hốc bánh', 'WHEEL-WELL-COAT', 'ENGINE_CHASSIS', 'CHASSIS', FALSE, 4.0, 300000, 100000, 1300000),
    -- Nhóm Đồng Sơn / Thân vỏ
    (v_log_gara_id, 'Gò nắn & Sửa móp vè trước bên phụ (Dent Repair)', 'BODY-DENT-01', 'BODY_PAINT', 'BODY', TRUE, 1.0, 500000, 0, 500000),
    (v_log_gara_id, 'Sơn dặm vè trước phải & Góc cản trước (Mã màu R4R Đỏ Mận)', 'PAINT-FENDER-R', 'BODY_PAINT', 'PAINT', TRUE, 1.0, 1200000, 0, 1200000),
    (v_log_gara_id, 'Sơn cánh cửa trước bên phụ & Đánh bóng xóa xước toàn xe', 'PAINT-DOOR-RF', 'BODY_PAINT', 'PAINT', TRUE, 1.0, 1800000, 300000, 2100000),
    (v_log_gara_id, 'Công tháo lắp phục vụ sơn sấy phòng hấp tiêu chuẩn', 'LABOR-BODY', 'BODY_PAINT', 'LABOR', TRUE, 1.0, 480000, 0, 480000);

    -- 5.4 Seed Fuel Logs (Lịch sử đổ xăng chuỗi chuẩn Fuelio)
    INSERT INTO fuel_logs (vehicle_id, fuel_date, odo, liters, price_per_liter, total_cost, is_full_tank, is_missed, gas_station, consumption_l_100km, cost_per_km)
    VALUES 
    (v_vehicle_id, '2024-07-01', 62800, 40.0, 23500, 940000, TRUE, FALSE, 'Petrolimex Cửa Hàng 15 (QL1K)', 7.20, 1692),
    (v_vehicle_id, '2024-07-15', 63380, 42.5, 23800, 1011500, TRUE, FALSE, 'PVOIL Phạm Văn Đồng', 7.33, 1744),
    (v_vehicle_id, '2024-08-02', 63950, 41.0, 23100, 947100, TRUE, FALSE, 'Petrolimex Cửa Hàng 01 (Biên Hòa)', 7.19, 1661),
    (v_vehicle_id, '2024-08-20', 64520, 42.0, 22900, 961800, TRUE, FALSE, 'Petrolimex Trạm 32 (Long Thành)', 7.37, 1687),
    (v_vehicle_id, '2024-09-08', 65010, 36.8, 22450, 826160, TRUE, FALSE, 'PVOIL Võ Nguyên Giáp', 7.51, 1686);

    -- 5.5 Seed Expense Logs (Chi phí VETC, Bảo hiểm, Gửi xe)
    INSERT INTO expense_logs (vehicle_id, expense_date, category, title, amount, odo, notes)
    VALUES 
    (v_vehicle_id, '2024-06-15', 'INSURANCE', 'Bảo hiểm Vật chất Thân xe Bảo Việt (1 Năm)', 8200000, 62200, 'Tái tục hợp đồng bảo hiểm thân vỏ gói mở rộng thủy kích & mất cắp'),
    (v_vehicle_id, '2024-08-01', 'TOLL_VETC', 'Nạp tài khoản thu phí tự động VETC', 1000000, 63900, 'Nạp tiền đi cao tốc Phan Thiết & Long Thành'),
    (v_vehicle_id, '2024-08-15', 'PARKING', 'Phí gửi xe chung cư Tháng 08/2024', 1200000, 64400, 'Thanh toán phí đỗ xe cố định ô tô'),
    (v_vehicle_id, '2024-09-01', 'WASH', 'Rửa xe bọt tuyết & Hút bụi nội thất cao cấp', 150000, 64900, 'Chăm sóc xe định kỳ cuối tuần');

    -- 5.6 Seed Maintenance Reminders (Chu kỳ kép ODO vs Thời gian)
    INSERT INTO maintenance_reminders (vehicle_id, item_type, category, interval_km, interval_months, last_service_odo, last_service_date, next_due_odo, next_due_date, alert_threshold_km, alert_threshold_days, status)
    VALUES 
    (v_vehicle_id, 'Thay nhớt động cơ (5W-30 Fully Synthetic)', 'CONSUMABLE', 5000, 6, 60120, '2024-04-12', 65120, '2024-10-12', 500, 15, 'DUE_SOON'),
    (v_vehicle_id, 'Thay lọc nhớt động cơ Mobis', 'CONSUMABLE', 10000, 12, 60120, '2024-04-12', 70120, '2025-04-12', 500, 15, 'OK'),
    (v_vehicle_id, 'Thay lọc gió động cơ', 'CONSUMABLE', 20000, 12, 50000, '2023-11-05', 70000, '2024-11-05', 1000, 30, 'OK'),
    (v_vehicle_id, 'Thay lọc gió máy lạnh (Cabin filter)', 'CONSUMABLE', 15000, 12, 50000, '2023-11-05', 65000, '2024-11-05', 500, 15, 'OVERDUE'),
    (v_vehicle_id, 'Thay cụm lọc xăng (31112C1000)', 'CONSUMABLE', 40000, 24, 60120, '2024-04-12', 100120, '2026-04-12', 2000, 60, 'OK'),
    (v_vehicle_id, 'Bảo dưỡng phanh & Thay dầu phanh DOT4', 'CONSUMABLE', 20000, 12, 60120, '2024-04-12', 80120, '2025-04-12', 1000, 30, 'OK'),
    (v_vehicle_id, 'Thay Bugi Iridium đánh lửa', 'CONSUMABLE', 40000, 36, 60120, '2024-04-12', 100120, '2027-04-12', 2000, 60, 'OK'),
    (v_vehicle_id, 'Thay dầu hộp số tự động (ATF SP-IV)', 'CONSUMABLE', 60000, 48, 60120, '2024-04-12', 120120, '2028-04-12', 3000, 90, 'OK');

END $$;
