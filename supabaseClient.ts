// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Expect Vite env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in your .env files.");
}

const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export default supabase;
