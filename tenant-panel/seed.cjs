const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://outepnfkeitrlauzpzme.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dGVwbmZrZWl0cmxhdXpwem1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg4OTA0NCwiZXhwIjoyMDk5NDY1MDQ0fQ.LMzk7lTn0dVhjP_bmTIs4uwYxIoADEAj8xPx-kFdmbE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seed() {
  console.log('Seeding demo data into Supabase...');

  try {
    // 1. Delete existing data to avoid duplicate key errors during seed (optional/cascade)
    // We will insert since it's a new DB

    // 2. Insert Tenant
    const { data: tenantData, error: tenantErr } = await supabase
      .from('tenants')
      .insert([{
        name: 'Bulut Grup Otomotiv',
        slug: 'bulutgrup',
        owner_name: 'Fatih Akyıldız',
        owner_phone: '0532 000 00 00',
        owner_email: 'fatih@bulutgrup.tr',
        status: 'active'
      }])
      .select();

    if (tenantErr) throw tenantErr;
    const tenantId = tenantData[0].id;
    console.log('Inserted Tenant:', tenantId);

    // 3. Insert Bank accounts
    const { data: bankData, error: bankErr } = await supabase
      .from('banks')
      .insert([
        { tenant_id: tenantId, bank_name: 'Yapı Kredi', account_name: 'Ticari TL Hesabı', iban: 'TR12 0006 2000 0000 1234 5678 90', balance: 500000.00 },
        { tenant_id: tenantId, bank_name: 'Kasa', account_name: 'Merkez Nakit Kasa', balance: 45000.00 }
      ])
      .select();

    if (bankErr) throw bankErr;
    const bankId = bankData[0].id;
    console.log('Inserted Bank accounts');

    // 4. Insert Customer
    const { data: customerData, error: custErr } = await supabase
      .from('customers')
      .insert([
        { tenant_id: tenantId, name_surname: 'Ahmet Yılmaz', phone: '0542 111 22 33', email: 'ahmet@gmail.com', notes: 'Düzenli müşteri, VIP' }
      ])
      .select();

    if (custErr) throw custErr;
    const customerId = customerData[0].id;
    console.log('Inserted Customer');

    // 5. Insert Vehicles
    const { data: vehData, error: vehErr } = await supabase
      .from('vehicles')
      .insert([
        {
          tenant_id: tenantId,
          buy_price: 850000.00,
          sell_price: 950000.00,
          seller_name: 'Mehmet Demir',
          seller_phone: '0555 444 33 22',
          brand: 'Renault',
          model: 'Clio 1.0 TCe',
          plate: '34 ABC 123',
          km: 45000,
          year: 2021,
          fuel_type: 'Benzin',
          gear_type: 'Otomatik',
          buy_date: '2026-06-10',
          has_spare_key: true,
          has_ruhsat: true,
          status: 'stokta'
        },
        {
          tenant_id: tenantId,
          buy_price: 1200000.00,
          sell_price: 1350000.00,
          seller_name: 'Ali Vural',
          seller_phone: '0506 999 88 77',
          brand: 'Volkswagen',
          model: 'Golf 1.5 eTSI',
          plate: '06 XYZ 789',
          km: 28000,
          year: 2022,
          fuel_type: 'Benzin',
          gear_type: 'Otomatik',
          buy_date: '2026-05-15',
          has_spare_key: true,
          has_ruhsat: true,
          status: 'stokta'
        }
      ])
      .select();

    if (vehErr) throw vehErr;
    const vehicleId = vehData[0].id;
    console.log('Inserted Vehicles');

    // 6. Insert Expense for vehicle 1
    const { error: expErr } = await supabase
      .from('expenses')
      .insert([
        {
          tenant_id: tenantId,
          vehicle_id: vehicleId,
          expense_type: 'bakim',
          amount: 5000.00,
          expense_date: '2026-06-12',
          bank_id: bankId,
          description: 'Periyodik yağ değişimi ve filtre bakımları'
        }
      ]);

    if (expErr) throw expErr;
    console.log('Inserted Expense');

    // 7. Insert Subscription
    const { error: subErr } = await supabase
      .from('subscriptions')
      .insert([
        {
          tenant_id: tenantId,
          plan_type: 'yearly',
          status: 'active',
          amount: 48000.00,
          start_date: '2026-07-13',
          end_date: '2027-07-13',
          iyzico_token: 'TOKEN-MOCK-12345'
        }
      ]);

    if (subErr) throw subErr;
    console.log('Inserted Subscription');

    console.log('Database seeding successfully finished!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seed();
