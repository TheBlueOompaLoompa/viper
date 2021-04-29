import { createClient } from '@supabase/supabase-js';

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTcxMjQ1NCwiZXhwIjoxOTM1Mjg4NDU0fQ.fAmYR_p8yRSvfdtbEc7UwAXKTlc5r2Jw4pW2MrXqpi8';
const SUPABASE_URL = "https://lzpombjaaizuqwdpggzf.supabase.co";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);