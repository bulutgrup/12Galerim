const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://outepnfkeitrlauzpzme.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dGVwbmZrZWl0cmxhdXpwem1lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg4OTA0NCwiZXhwIjoyMDk5NDY1MDQ0fQ.LMzk7lTn0dVhjP_bmTIs4uwYxIoADEAj8xPx-kFdmbE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function check() {
  console.log('Checking database tenants (using service_role)...');
  const { data, error } = await supabase.from('tenants').select('*');
  if (error) {
    console.error('Error fetching tenants:', error);
  } else {
    console.log('Tenants in DB:', data);
  }
  const { data: vData, error: vErr } = await supabase.from('vehicles').select('*');
  if (vErr) {
    console.error('Error fetching vehicles:', vErr);
  } else {
    console.log('Vehicles in DB:', vData);
  }
}

check();
