import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  
  setAuth: (session) => {
    set({ 
      session, 
      user: session?.user ?? null, 
      loading: false 
    })
  },
  
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
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
