import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  
  setAuth: (session) => {
    set({ 
      session, 
      user: session?.user ?? null, 
      loading: false,
      error: null
    })
  },
  
  login: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      const msg = error.message === 'Failed to fetch' 
        ? 'فشل الاتصال بسيرفر Supabase. تأكد من صحة المفتاح وإعادة تشغيل السيرفر.' 
        : error.message;
      set({ error: msg, loading: false })
      return { error }
    }
    
    set({ user: data.user, session: data.session, loading: false })
    return { data }
  },
  
  signup: async (email, password) => {
    set({ loading: true, error: null })
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) {
      const msg = error.message === 'Failed to fetch' 
        ? 'فشل الاتصال بسيرفر Supabase. تأكد من صحة المفتاح وإعادة تشغيل السيرفر.' 
        : error.message;
      set({ error: msg, loading: false })
      return { error }
    }
    
    set({ user: data.user, session: data.session, loading: false })
    return { data }
  },
  
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, error: null })
  },
  
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ 
      session, 
      user: session?.user ?? null, 
      loading: false 
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ 
        session, 
        user: session?.user ?? null, 
        loading: false 
      })
    })

    return () => subscription.unsubscribe()
  },

  updateProfile: async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    if (error) throw error
    set({ user: data.user })
    return data
  }
}))
