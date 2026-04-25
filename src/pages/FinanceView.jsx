import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Filter, PieChart as PieIcon, ArrowUpRight, ArrowDownRight, Trash2, Wallet, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const FinanceView = () => {
  const { user } = useAuthStore();
  const { transactions, categories, addTransaction, deleteTransaction, getStats, getCurrencySymbol } = useFinanceStore();
  
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState('all'); 

  const { income, expenses, balance } = getStats();
  const symbol = getCurrencySymbol();

  const filteredTransactions = transactions.filter(t => 
    filterType === 'all' ? true : t.type === filterType
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const expenseData = categories
    .filter(c => c.type === 'expense')
    .map(c => ({
      name: c.name,
      value: transactions
        .filter(t => t.categoryId === c.id)
        .reduce((acc, t) => acc + Number(t.amount), 0),
      color: c.color || '#6366f1'
    }))
    .filter(d => d.value > 0);

  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: categories.length > 0 ? categories[0].id : '',
    type: 'expense'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) return;
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString()
    }, user.id);
    setFormData({ ...formData, amount: '', description: '' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-foreground tracking-tight">المالية</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)}
          className="w-14 h-14 rounded-2xl gradient-primary text-white flex items-center justify-center shadow-xl shadow-primary/30"
        >
          <Plus size={32} />
        </motion.button>
      </header>

      {/* Main Balance Card */}
      <section className="relative overflow-hidden rounded-[3rem] p-8 text-white shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 gradient-secondary" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <div className="relative z-10">
          <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">الرصيد المتاح</p>
          <div className="flex items-baseline gap-2 mb-8">
            <h2 className="text-5xl font-black tracking-tighter">{balance.toLocaleString()}</h2>
            <span className="text-2xl font-medium opacity-60">{symbol}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight size={16} className="text-emerald-300" />
                <span className="text-[10px] font-bold opacity-60 uppercase">إجمالي الدخل</span>
              </div>
              <p className="text-xl font-black">+{income.toLocaleString()} {symbol}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDownRight size={16} className="text-rose-300" />
                <span className="text-[10px] font-bold opacity-60 uppercase">إجمالي المصروف</span>
              </div>
              <p className="text-xl font-black">-{expenses.toLocaleString()} {symbol}</p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showAdd && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit} 
            className="glass-card p-8 rounded-[2.5rem] space-y-6 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-muted/50 rounded-2xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'expense' ? 'bg-white shadow-lg text-rose-500' : 'text-muted-foreground'}`}
              >
                مصروف
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.type === 'income' ? 'bg-white shadow-lg text-emerald-500' : 'text-muted-foreground'}`}
              >
                دخل
              </button>
            </div>
            
            <div className="relative">
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full text-6xl font-black text-center bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/10 text-foreground"
                autoFocus
              />
              <span className="absolute bottom-4 right-0 text-xl font-bold text-muted-foreground/50">{symbol}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full"
              >
                <option value="">اختر التصنيف...</option>
                {categories.filter(c => c.type === formData.type).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="ماذا اشتريت؟ (اختياري)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <button type="submit" className="w-full py-5 gradient-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 active:scale-95 transition-all">
              إضافة المعاملة
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Stats/Chart Card */}
      {expenseData.length > 0 && (
        <section className="glass-card p-8 rounded-[3rem]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <PieIcon size={20} />
            </div>
            <h3 className="text-lg font-bold text-foreground">تحليل المصروفات</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={10}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: 'var(--card)' }}
                  itemStyle={{ fontWeight: 'black', fontSize: '14px' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '24px', fontWeight: 'bold' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Transaction History */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            العمليات الأخيرة <Layers size={20} className="text-primary" />
          </h3>
          <div className="flex bg-muted/50 p-1 rounded-xl">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${filterType === t ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground'}`}
              >
                {t === 'all' ? 'الكل' : t === 'income' ? 'دخل' : 'صرف'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.map((t) => (
            <motion.div 
              layout
              key={t.id} 
              whileHover={{ x: 10, scale: 1.01 }}
              className="glass-card p-6 rounded-[2.5rem] flex items-center justify-between group border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all group-hover:rotate-12 ${t.type === 'income' ? 'bg-emerald-50 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-rose-50 text-rose-500 shadow-lg shadow-rose-500/10'}`}>
                  {t.type === 'income' ? <ArrowUpRight size={32} /> : <ArrowDownRight size={32} />}
                </div>
                <div>
                  <p className="text-lg font-black text-foreground mb-0.5">{t.description || categories.find(c => c.id === t.categoryId)?.name || 'معاملة'}</p>
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.15em]">{format(new Date(t.date), 'MMM d, hh:mm a')}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-2xl font-black tracking-tighter ${t.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black text-muted-foreground/40">{symbol}</p>
                </div>
                <button 
                  onClick={() => deleteTransaction(t.id)}
                  className="p-3 bg-muted/20 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="glass-card p-16 rounded-[3rem] text-center border-dashed border-2">
              <Wallet size={48} className="mx-auto mb-4 opacity-10" />
              <p className="font-bold text-muted">لا توجد معاملات مسجلة بعد</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FinanceView;
