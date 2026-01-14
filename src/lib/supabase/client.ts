import { createBrowserClient } from "@supabase/ssr";

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "your-project-url" && 
  supabaseAnonKey !== "your-anon-key";

export function createClient() {
  if (!isConfigured) {
    // Return a mock client that throws helpful errors
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: "Supabase ยังไม่ได้ตั้งค่า กรุณาใส่ NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ใน .env.local" } 
        }),
        signInWithOAuth: async () => ({ 
          data: { url: null, provider: null }, 
          error: { message: "Supabase ยังไม่ได้ตั้งค่า" } 
        }),
        signUp: async () => ({ 
          data: { user: null, session: null }, 
          error: { message: "Supabase ยังไม่ได้ตั้งค่า" } 
        }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: { message: "Supabase ยังไม่ได้ตั้งค่า" } }),
        update: () => ({ data: null, error: { message: "Supabase ยังไม่ได้ตั้งค่า" } }),
        delete: () => ({ data: null, error: { message: "Supabase ยังไม่ได้ตั้งค่า" } }),
      }),
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export { isConfigured as isSupabaseConfigured };
