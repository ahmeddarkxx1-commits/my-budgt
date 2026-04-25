import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useProductivityStore = create((set, get) => ({
  tasks: [],
  projects: [{ id: 'default', name: 'Personal', color: '#1e3a8a' }],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) {
      const transformedData = data.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        timeSpent: t.time_spent,
        projectId: t.project_id,
        deadline: t.deadline,
        userId: t.user_id,
        createdAt: t.created_at
      }));
      set({ tasks: transformedData });
    }
    set({ loading: false });
  },
  
  addTask: async (task, userId) => {
    const newTask = {
      title: task.title,
      project_id: task.projectId || 'default',
      deadline: task.deadline,
      user_id: userId,
      status: 'todo',
      time_spent: 0
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();

    if (!error && data) {
      const t = data[0];
      const transformedTask = {
        id: t.id,
        title: t.title,
        status: t.status,
        timeSpent: t.time_spent,
        projectId: t.project_id,
        deadline: t.deadline,
        userId: t.user_id,
        createdAt: t.created_at
      };
      set((state) => ({ tasks: [transformedTask, ...state.tasks] }));
    }
  },
  
  updateTask: async (id, updates) => {
    // Optimistic update
    const oldTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    }));

    const { error } = await supabase
      .from('tasks')
      .update({
        status: updates.status,
        time_spent: updates.timeSpent,
        title: updates.title
      })
      .eq('id', id);

    if (error) {
      set({ tasks: oldTasks }); // Rollback
      console.error('Update failed:', error);
    }
  },
  
  deleteTask: async (id) => {
    const oldTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id)
    }));

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      set({ tasks: oldTasks });
    }
  },
  
  logTime: async (id, minutes) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    
    const newTime = (task.time_spent || 0) + minutes;
    await get().updateTask(id, { timeSpent: newTime });
  },
}));

