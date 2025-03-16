import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kxytutiiwnmzcskuabox.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4eXR1dGlpd25temNza3VhYm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MzU3OTAsImV4cCI6MjA1NzQxMTc5MH0.bWDK12arzMXidtjgV52oO-NviPjGNCjB_H0y6Mcu91M";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
