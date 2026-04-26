import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvbsbocdiktlzvncvrik.supabase.co';
const supabaseKey = 'sb_publishable_FKzyFlf70XZTByYmBpXGkQ_0typly0M';

export const supabase = createClient(supabaseUrl, supabaseKey);
