import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gputkqjyflcqeyesupza.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwdXRrcWp5ZmxjcWV5ZXN1cHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTIzMjMsImV4cCI6MjA1NzE4ODMyM30.YzqeLGgOfk-ouY_yNOcbZwQo1cTe9V06asHAuNqlNYM"
const supabaseAdminKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwdXRrcWp5ZmxjcWV5ZXN1cHphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTYxMjMyMywiZXhwIjoyMDU3MTg4MzIzfQ.t6enDzqJg53d96p4iyLiAfha5VknBm2ag3mAcopoDa4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
})
