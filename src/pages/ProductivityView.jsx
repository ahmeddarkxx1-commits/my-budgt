import React, { useState, useEffect } from 'react';
import { useProductivityStore } from '../store/useProductivityStore';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Clock, Play, Pause, CheckCircle2, Circle, Trash2, FolderPlus, Calendar, BarChart3, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const ProductivityView = () => {
  const { user } = useAuthStore();
  const { tasks, projects, addTask, updateTask, deleteTask, logTime } = useProductivityStore();
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null); 
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    projectId: projects.length > 0 ? projects[0].id : 'default',
    priority: 'medium',
    deadline: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const handleToggleTimer = (taskId) => {
    if (activeTimer === taskId) {
      const minutes = Math.floor(timerSeconds / 60);
      if (minutes > 0) logTime(taskId, minutes);
      setActiveTimer(null);
      setTimerSeconds(0);
    } else {
      if (activeTimer) {
        const minutes = Math.floor(timerSeconds / 60);
        if (minutes > 0) logTime(activeTimer, minutes);
      }
      setActiveTimer(taskId);
      setTimerSeconds(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addTask(formData, user.id);
    setFormData({ ...formData, title: '' });
    setShowAddTask(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-foreground tracking-tight">المهام</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddTask(!showAddTask)}
          className="w-14 h-14 rounded-2xl gradient-primary text-white flex items-center justify-center shadow-xl shadow-primary/30"
        >
          <Plus size={32} />
        </motion.button>
      </header>

      {/* Focus Timer Card */}
      {activeTimer && (
        <motion.section 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="gradient-primary p-8 rounded-[3rem] text-white shadow-2xl shadow-primary/20 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <Timer size={48} className="mb-4 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">جاري التركيز على</p>
            <h2 className="text-2xl font-black mb-6">{tasks.find(t => t.id === activeTimer)?.title}</h2>
            <div className="text-6xl font-black tracking-tighter mb-8 tabular-nums">
              {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
              {(timerSeconds % 60).toString().padStart(2, '0')}
            </div>
            <button 
              onClick={() => handleToggleTimer(activeTimer)}
              className="px-10 py-4 bg-white text-primary rounded-2xl font-black hover:scale-105 transition-transform"
            >
              إيقاف التركيز
            </button>
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circles.png')] opacity-10" />
        </motion.section>
      )}

      <AnimatePresence>
        {showAddTask && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit} 
            className="glass-card p-8 rounded-[2.5rem] space-y-6 overflow-hidden"
          >
            <input
              type="text"
              placeholder="ما الذي تنوي فعله؟"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/30 text-foreground"
              autoFocus
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase px-2">المشروع</p>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase px-2">الموعد</p>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full py-5 gradient-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 active:scale-95 transition-all">
              إضافة المهمة
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task Groups */}
      <section className="space-y-8">
        {['todo', 'done'].map((status) => {
          const filteredTasks = tasks.filter(t => t.status === status);
          if (filteredTasks.length === 0 && status === 'done') return null;

          return (
            <div key={status} className="space-y-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-3 px-2">
                {status === 'todo' ? 'قيد التنفيذ' : 'مكتملة'} 
                <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">{filteredTasks.length}</span>
              </h3>
              
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <motion.div 
                    layout
                    key={task.id} 
                    whileHover={{ scale: 1.02 }}
                    className={`glass-card p-6 rounded-[2.5rem] flex items-center gap-5 group border-2 border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 ${status === 'done' ? 'opacity-50 grayscale-[0.5]' : ''}`}
                  >
                    <button 
                      onClick={() => updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                      className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-primary border-primary text-white' : 'border-muted-foreground/20 bg-muted/20 hover:border-primary group-hover:scale-110'}`}
                    >
                      {task.status === 'done' ? <CheckCircle2 size={20} /> : <Circle size={20} className="opacity-20" />}
                    </button>

                    <div className="flex-1">
                      <h4 className={`font-bold text-foreground ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full gradient-primary" />
                          {projects.find(p => p.id === task.projectId)?.name || 'Personal'}
                        </span>
                        {task.timeSpent > 0 && (
                          <span className="text-[10px] font-bold text-indigo-500 uppercase flex items-center gap-1">
                            <Clock size={10} /> {task.timeSpent} دقيقة
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === 'todo' && (
                        <button 
                          onClick={() => handleToggleTimer(task.id)}
                          className={`p-3 rounded-2xl transition-all ${activeTimer === task.id ? 'bg-rose-500 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                        >
                          {activeTimer === task.id ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                      )}
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-3 text-muted-foreground hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {tasks.length === 0 && (
        <div className="glass-card p-20 rounded-[3rem] text-center border-dashed border-2">
          <CheckCircle2 size={64} className="mx-auto mb-4 opacity-10" />
          <p className="font-bold text-muted">ابدأ يومك بإضافة مهمة جديدة ✨</p>
        </div>
      )}
    </div>
  );
};

export default ProductivityView;
