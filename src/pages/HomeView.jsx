import React from 'react';
import { useProductivityStore } from '../store/useProductivityStore';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Wallet,
  Calendar as CalendarIcon,
  LayoutDashboard,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const HomeView = () => {
  const { user } = useAuthStore();
  const tasks = useProductivityStore((state) => state.tasks);
  const { getStats, getCurrencySymbol } = useFinanceStore();
  const { income, expenses, balance } = getStats();
  const symbol = getCurrencySymbol();

  const today = new Date();
  const pendingTasks = tasks.filter(t => t.status !== 'done');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">أهلاً بك، {user?.email?.split('@')[0]}</p>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-2">
            لوحة التحكم <LayoutDashboard className="text-primary" size={28} />
          </h1>
        </div>
        <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-primary">
          <Zap size={24} className="fill-current" />
        </div>
      </header>

      {/* Main Wallet Card */}
      <motion.section 
        variants={item}
        className="relative group h-64 overflow-hidden rounded-[3rem] shadow-2xl shadow-primary/20"
      >
        <div className="absolute inset-0 gradient-primary transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">الرصيد الكلي</p>
              <h2 className="text-5xl font-black tracking-tighter">
                {balance.toLocaleString()} <span className="text-2xl font-medium opacity-60">{symbol}</span>
              </h2>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/10">
              <Wallet size={28} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <ArrowUpRight size={20} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase">دخل</p>
                <p className="text-lg font-bold">+{income.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-400/20 flex items-center justify-center">
                <ArrowDownRight size={20} className="text-rose-300" />
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase">صرف</p>
                <p className="text-lg font-bold">-{expenses.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div variants={item} className="glass-card p-6 rounded-[2.5rem] group hover:bg-white transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-4xl font-black text-foreground">{pendingTasks.length}</h3>
          <p className="text-xs font-bold text-muted uppercase mt-1">مهمة متبقية</p>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6 rounded-[2.5rem] group hover:bg-white transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <h3 className="text-4xl font-black text-foreground">
            {Math.floor(tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0) / 60)}
          </h3>
          <p className="text-xs font-bold text-muted uppercase mt-1">ساعة إنتاج</p>
        </motion.div>
      </div>

      {/* Agenda Section */}
      <motion.section variants={item} className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            جدول اليوم <CalendarIcon size={20} className="text-primary" />
          </h3>
          <button className="text-xs font-bold text-primary hover:underline">عرض الكل</button>
        </div>

        <div className="space-y-4">
          {pendingTasks.slice(0, 3).length > 0 ? (
            pendingTasks.slice(0, 3).map((task, idx) => (
              <div key={task.id} className="glass-card p-5 rounded-[2rem] flex items-center gap-4 hover:translate-x-2 transition-all cursor-pointer group">
                <div className={`w-1.5 h-12 rounded-full gradient-primary opacity-40 group-hover:opacity-100 transition-opacity`} />
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">{task.title}</h4>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{task.projectId || 'Personal'}</p>
                </div>
                <div className="text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {task.deadline ? format(new Date(task.deadline), 'hh:mm a') : '--:--'}
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-12 rounded-[3rem] text-center border-dashed border-2">
              <p className="font-bold text-muted">لا يوجد مهام مجدولة لليوم ✨</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Smart Insight */}
      <motion.section 
        variants={item}
        className="p-8 rounded-[3rem] bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            <TrendingUp size={18} /> نصيحة ذكية
          </h3>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {balance > 0 
              ? "وضعك المالي مستقر تماماً! جرب تخصيص مبلغ بسيط للاستثمار في مهارة جديدة هذا الأسبوع."
              : "لاحظنا زيادة في مصروفاتك هذا الأسبوع. مراجعة سريعة للفئات قد توفر لك الكثير!"}
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-3xl opacity-20" />
      </motion.section>
    </motion.div>
  );
};

export default HomeView;
