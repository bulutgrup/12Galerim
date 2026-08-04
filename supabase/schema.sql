-- ============================================================
-- GALERİM — SaaS Multi-Tenant Database Schema
-- ============================================================
-- Supabase SQL Editor'e yapıştırıp çalıştırabilirsiniz.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. TENANTS (Galeriler) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS tenants (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  name                TEXT          NOT NULL,
  slug                TEXT          UNIQUE NOT NULL, -- "bulut-galeri" -> bulut-galeri.galerim.app
  owner_name          TEXT          NOT NULL, -- Yetkili Kişi
  owner_phone         TEXT          NOT NULL, -- Telefon
  owner_email         TEXT          NOT NULL, -- E-posta
  password            TEXT          NOT NULL DEFAULT '123456', -- Giriş Şifresi
  status              TEXT          DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'cancelled')),
  trial_ends_at       TIMESTAMPTZ   DEFAULT NOW() + INTERVAL '7 days',
  subscription_ends_at TIMESTAMPTZ  DEFAULT NOW() + INTERVAL '7 days',
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- Index for subdomain lookup
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- ── 2. SUBSCRIPTIONS (Abonelik Paketleri) ───────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_type           TEXT          NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status              TEXT          NOT NULL CHECK (status IN ('active', 'ended', 'cancelled')),
  amount              NUMERIC(12,2) NOT NULL, -- Aylık 6490 ya da yıllık 48000
  start_date          TIMESTAMPTZ   DEFAULT NOW(),
  end_date            TIMESTAMPTZ   NOT NULL,
  iyzico_token        TEXT          NOT NULL,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 3. IYZICO_PAYMENTS (Ödeme Geçmişi) ────────────────────────
CREATE TABLE IF NOT EXISTS iyzico_payments (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount              NUMERIC(12,2) NOT NULL,
  status              TEXT          NOT NULL CHECK (status IN ('success', 'failed')),
  iyzico_payment_id   TEXT,
  card_association    TEXT, -- Visa, Mastercard vs.
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 4. CUSTOMERS (Müşteriler) ────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name_surname        TEXT          NOT NULL,
  phone               TEXT          NOT NULL,
  email               TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_tenant_phone ON customers(tenant_id, phone);

-- ── 5. BANKS (Bankalar / Kasalar) ────────────────────────────
CREATE TABLE IF NOT EXISTS banks (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  bank_name           TEXT          NOT NULL, -- Örn. Garanti, Nakit Kasa
  account_name        TEXT          NOT NULL, -- Örn. Ticari TL, Merkez Kasa
  iban                TEXT,
  balance             NUMERIC(15,2) DEFAULT 0.00, -- Bakiye
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 6. BANK_DOCUMENTS (Çek / Senet) ──────────────────────────
CREATE TABLE IF NOT EXISTS bank_documents (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type                TEXT          NOT NULL CHECK (type IN ('cek', 'senet')),
  amount              NUMERIC(12,2) NOT NULL,
  due_date            DATE          NOT NULL, -- Vade
  debtor              TEXT          NOT NULL, -- Borçlu / Alacaklı
  status              TEXT          DEFAULT 'bekliyor' CHECK (status IN ('bekliyor', 'tahsil', 'odendi')),
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 7. VEHICLES (Araç Listesi) ──────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  image_url           TEXT,
  buy_price           NUMERIC(12,2) NOT NULL, -- Alış Fiyatı
  sell_price          NUMERIC(12,2) NOT NULL, -- Hedef Satış Fiyatı
  seller_name         TEXT          NOT NULL, -- Alınan Kişi
  seller_phone        TEXT          NOT NULL, -- Telefon
  brand               TEXT          NOT NULL, -- Marka
  model               TEXT          NOT NULL, -- Model
  plate               TEXT          NOT NULL, -- Plaka
  km                  INTEGER       NOT NULL DEFAULT 0,
  year                INTEGER       NOT NULL, -- Model Yılı
  fuel_type           TEXT          NOT NULL, -- Yakıt Tipi
  gear_type           TEXT          NOT NULL, -- Vites Tipi
  body_type           TEXT          NOT NULL DEFAULT 'Sedan', -- Kasa Tipi
  chassis_no          TEXT, -- Şase No
  motor_no            TEXT, -- Motor No
  color               TEXT,
  buy_date            DATE          NOT NULL,
  has_kasko           BOOLEAN       DEFAULT false,
  has_sigorta         BOOLEAN       DEFAULT false,
  has_warranty        BOOLEAN       DEFAULT false,
  has_spare_key       BOOLEAN       DEFAULT false,
  has_ruhsat          BOOLEAN       DEFAULT false,
  has_invoice         BOOLEAN       DEFAULT false,
  tramer_amount       NUMERIC(12,2) DEFAULT 0.00,
  is_heavy_damage     BOOLEAN       DEFAULT false, -- Ağır hasar var mı
  is_consignment      BOOLEAN       DEFAULT false, -- Araç konsinye mi
  description         TEXT,
  expertise           JSONB         DEFAULT '{}'::jsonb, -- Kaporta Boya Durumu (Sol ön çamurluk, bagaj vb.)
  status              TEXT          DEFAULT 'stokta' CHECK (status IN ('stokta', 'satildi')),
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 8. EXPENSES (Araç Masrafları) ────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vehicle_id          UUID          REFERENCES vehicles(id) ON DELETE CASCADE,
  expense_type        TEXT          NOT NULL CHECK (expense_type IN ('yakit', 'bakim', 'sigorta', 'vergisi', 'muayene', 'lastik', 'yikama', 'noter', 'diger', 'personel', 'isletme')),
  amount              NUMERIC(12,2) NOT NULL,
  expense_date        DATE          NOT NULL,
  bank_id             UUID          NOT NULL REFERENCES banks(id),
  description         TEXT,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 9. SALES (Araç Satış Kaydı) ──────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vehicle_id          UUID          NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  customer_id         UUID          REFERENCES customers(id) ON DELETE SET NULL,
  sell_price          NUMERIC(12,2) NOT NULL, -- Son Satış Rakamı
  notary_expense      NUMERIC(12,2) DEFAULT 0.00,
  sale_date           DATE          NOT NULL,
  bank_id             UUID          NOT NULL REFERENCES banks(id),
  net_profit          NUMERIC(12,2) DEFAULT 0.00, -- Otomatik hesaplanacak
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 10. PERSONNEL (Çalısanlar) ──────────────────────────────
CREATE TABLE IF NOT EXISTS personnel (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  first_name          TEXT          NOT NULL,
  last_name           TEXT          NOT NULL,
  phone               TEXT          NOT NULL,
  email               TEXT,
  salary              NUMERIC(12,2) DEFAULT 0.00,
  created_at          TIMESTAMPTZ   DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 11. PERSONNEL_PAYMENTS (Personel Ödemeleri) ──────────────
CREATE TABLE IF NOT EXISTS personnel_payments (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  personnel_id        UUID          NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
  amount              NUMERIC(12,2) NOT NULL,
  payment_date        DATE          NOT NULL,
  payment_type        TEXT          NOT NULL CHECK (payment_type IN ('maas', 'prim', 'avans', 'diger')),
  bank_id             UUID          NOT NULL REFERENCES banks(id),
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);


-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- ── A. Araç Satıldıgında Kar Hesaplama ve Durum Güncelleme ────
CREATE OR REPLACE FUNCTION process_vehicle_sale()
RETURNS TRIGGER AS $$
DECLARE
  v_buy_price NUMERIC(12,2);
  v_total_expenses NUMERIC(12,2);
BEGIN
  -- Alıs fiyatını çekelim
  SELECT buy_price INTO v_buy_price FROM vehicles WHERE id = NEW.vehicle_id;
  
  -- Bu araca yapılmıs toplam masrafları çekelim
  SELECT COALESCE(SUM(amount), 0) INTO v_total_expenses FROM expenses WHERE vehicle_id = NEW.vehicle_id;
  
  -- Net karı hesapla: Satıs Fiyatı - (Alıs Fiyatı + Masraflar + Noter Gideri)
  NEW.net_profit := NEW.sell_price - (v_buy_price + v_total_expenses + NEW.notary_expense);
  
  -- Aracın durumunu 'satildi' olarak güncelle
  UPDATE vehicles SET status = 'satildi' WHERE id = NEW.vehicle_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_process_vehicle_sale
  BEFORE INSERT ON sales
  FOR EACH ROW
  EXECUTE FUNCTION process_vehicle_sale();


-- ── B. Finansal Islemler Sonucu Kasa/Banka Bakiye Güncellemesi ──

-- 1. Masraf Eklendiginde Bakiyeden Düsme
CREATE OR REPLACE FUNCTION update_bank_balance_on_expense()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE banks 
  SET balance = balance - NEW.amount 
  WHERE id = NEW.bank_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_bank_balance_on_expense
  AFTER INSERT ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_balance_on_expense();

-- 2. Satıs Yapıldıgında Bakiyeye Ekleme (Noter giderini düserek)
CREATE OR REPLACE FUNCTION update_bank_balance_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE banks 
  SET balance = balance + (NEW.sell_price - NEW.notary_expense) 
  WHERE id = NEW.bank_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_bank_balance_on_sale
  AFTER INSERT ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_balance_on_sale();

-- 3. Personel Ödemesi Yapıldıgında Bakiyeden Düsme
CREATE OR REPLACE FUNCTION update_bank_balance_on_personnel_payment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE banks 
  SET balance = balance - NEW.amount 
  WHERE id = NEW.bank_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_bank_balance_on_personnel_payment
  AFTER INSERT ON personnel_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_bank_balance_on_personnel_payment();


-- ── C. Yeni Üye Kaydı Bildirim Logu (Trigger) ─────────────────
-- Gerçek e-posta gönderimi bir Edge Function tarafından tetiklenebilir.
-- Bu fonksiyon yeni tenant kaydında tetiklenip bilgi loglayacak/bildirim tablosuna atacak.
CREATE TABLE IF NOT EXISTS admin_notifications (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  is_read     BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION notify_new_tenant()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications(title, message)
  VALUES (
    'Yeni Isletme Kaydı Yapıldı!',
    'Isletme Adı: ' || NEW.name || 
    ', Yetkili: ' || NEW.owner_name || 
    ', Tel: ' || NEW.owner_phone || 
    ', E-posta: ' || NEW.owner_email || 
    ', Slug: https://' || NEW.slug || '.galerim.app'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_notify_new_tenant
  AFTER INSERT ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_tenant();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SIMULATION
-- ============================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on tenants" ON tenants;
DROP POLICY IF EXISTS "Allow public select on tenants" ON tenants;
DROP POLICY IF EXISTS "Allow public update on tenants" ON tenants;
CREATE POLICY "Allow public insert on tenants" ON tenants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "Allow public update on tenants" ON tenants FOR UPDATE USING (true);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on vehicles" ON vehicles;
CREATE POLICY "Allow public access on vehicles" ON vehicles FOR ALL USING (true);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on customers" ON customers;
CREATE POLICY "Allow public access on customers" ON customers FOR ALL USING (true);

ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on banks" ON banks;
CREATE POLICY "Allow public access on banks" ON banks FOR ALL USING (true);

ALTER TABLE bank_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on bank_documents" ON bank_documents;
CREATE POLICY "Allow public access on bank_documents" ON bank_documents FOR ALL USING (true);

ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on personnel" ON personnel;
CREATE POLICY "Allow public access on personnel" ON personnel FOR ALL USING (true);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on expenses" ON expenses;
CREATE POLICY "Allow public access on expenses" ON expenses FOR ALL USING (true);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on sales" ON sales;
CREATE POLICY "Allow public access on sales" ON sales FOR ALL USING (true);

ALTER TABLE iyzico_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on iyzico_payments" ON iyzico_payments;
CREATE POLICY "Allow public access on iyzico_payments" ON iyzico_payments FOR ALL USING (true);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on admin_notifications" ON admin_notifications;
CREATE POLICY "Allow public access on admin_notifications" ON admin_notifications FOR ALL USING (true);


-- ── 15. MESSAGES (Müşteri Mesajları) ────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id                  UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id           UUID          NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vehicle_id          UUID          REFERENCES vehicles(id) ON DELETE SET NULL,
  sender_name         TEXT          NOT NULL,
  sender_phone        TEXT          NOT NULL,
  sender_email        TEXT,
  message_text        TEXT          NOT NULL,
  is_read             BOOLEAN       DEFAULT false,
  created_at          TIMESTAMPTZ   DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access on messages" ON messages;
CREATE POLICY "Allow public access on messages" ON messages FOR ALL USING (true);


-- ── 16. VEHICLES STATUS CONSTRAINT UPDATE ───────────────────────
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_status_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_status_check CHECK (status IN ('stokta', 'satildi', 'pasif'));


-- ── 17. TENANTS BILLING INFO COLUMNS ────────────────────────────
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS tax_office TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS tax_number TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS company_title TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS address TEXT;

