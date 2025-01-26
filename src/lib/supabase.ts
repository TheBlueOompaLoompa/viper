import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fotpecxhlapklaunsndl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvdHBlY3hobGFwa2xhdW5zbmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NjQxNzAsImV4cCI6MjA1MzQ0MDE3MH0.iq847c9FKd_lqthA5llYftrYQyInuTmcSq-KM8NJ4BI';
export default createClient(supabaseUrl, supabaseKey);
