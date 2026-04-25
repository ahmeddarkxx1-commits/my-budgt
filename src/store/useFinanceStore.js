import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useFinanceStore = create((set, get) => ({
  transactions: [],
  categories: [],
  currency: localStorage.getItem('app-currency') || 'EGP',
  loading: false,

  setCurrency: (currency) => {
    localStorage.setItem('app-currency', currency);
    set({ currency });
  },

  getCurrencySymbol: () => {
    const { currency } = get();
    return currency === 'USD' ? '$' : 'ج.م';
  },

  fetchTransactions: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error) {
      const transformedData = data.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        categoryId: t.category_id,
        type: t.type,
        date: t.date,
        userId: t.user_id,
        createdAt: t.created_at
      }));
      set({ transactions: transformedData });
    }
    set({ loading: false });
  },

  fetchCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (!error && data.length > 0) {
      set({ categories: data.map(c => ({ ...c, userId: c.user_id })) });
    } else {
      // Default categories if none exist
      set({ categories: [
        { id: 'default-1', name: 'طعام', type: 'expense', color: '#ef4444' },
        { id: 'default-2', name: 'سكن', type: 'expense', color: '#f59e0b' },
        { id: 'default-3', name: 'راتب', type: 'income', color: '#10b981' },
      ] });
    }
  },

  addCategory: async (category, userId) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
        name: category.name, 
        type: category.type, 
        color: category.color || '#1e3a8a',
        user_id: userId 
      }])
      .select();

    if (!error && data) {
      set((state) => ({ categories: [...state.categories, data[0]] }));
    }
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      set((state) => ({ categories: state.categories.filter(c => c.id !== id) }));
    }
  },

  addTransaction: async (transaction, userId) => {
    const newTransaction = {
      amount: transaction.amount,
      description: transaction.description,
      category_id: transaction.categoryId,
      type: transaction.type,
      date: transaction.date || new Date().toISOString(),
      user_id: userId
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
      .select();

    if (!error && data) {
      const t = data[0];
      const transformedTransaction = {
        id: t.id,
        amount: t.amount,
        description: t.description,
        categoryId: t.category_id,
        type: t.type,
        date: t.date,
        userId: t.user_id,
        createdAt: t.created_at
      };
      set((state) => ({ transactions: [transformedTransaction, ...state.transactions] }));
    }
  },

  deleteTransaction: async (id) => {
    const oldTransactions = get().transactions;
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    }));

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      set({ transactions: oldTransactions });
    }
  },

  getStats: () => {
    const { transactions } = get();
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    return { income, expenses, balance: income - expenses };
  }
}));

