import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubzhjfzgitrcbnsedlpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTk5ODIyNiwiZXhwIjoxOTM1NTc0MjI2fQ.cPMjt7bXd8bzPWC9_xfg6BrB_a7cavba3ZU-hbP6QhU';
export default createClient(supabaseUrl, supabaseKey);