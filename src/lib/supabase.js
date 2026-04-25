import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const safeUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co'
const safeKey = supabaseAnonKey && supabaseAnonKey !== 'your-supabase-anon-key' ? supabaseAnonKey : 'placeholder-key'

if (!isValidUrl(supabaseUrl) || safeKey === 'placeholder-key') {
  console.warn('Supabase credentials missing or invalid. Authentication will not work until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly in .env')
}

export const supabase = createClient(safeUrl, safeKey)

