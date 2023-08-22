
import { env } from "$env/dynamic/public"; 
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = env.PUBLIC_SUPASBASE_URL
const supabaseAnonKey = env.PUBLIC_SUPASBASE_ANON_KEY

const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string)

export default supabase