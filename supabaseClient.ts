// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ntnudvecvuqvimuwsdip.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnVkdmVjdnVxdmltdXdzZGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNDQ0NzcsImV4cCI6MjA3MDkyMDQ3N30.HUm10PWetcdMNAUYPQbAGr1IhFCrxbrRdVqYKNg2GCc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
