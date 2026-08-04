import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://outepnfkeitrlauzpzme.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dGVwbmZrZWl0cmxhdXpwem1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4ODkwNDQsImV4cCI6MjA5OTQ2NTA0NH0.boPaNJvxWZh7tc9V9rryMh6KChAXEqqWyNNqabgrb_M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
