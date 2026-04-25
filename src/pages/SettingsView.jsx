import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useFinanceStore } from '../store/useFinanceStore';
import { User, Shield, Bell, Moon, LogOut, ChevronRight, Globe, Tags, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsView = () => {
  const { user, signOut } = useAuthStore();
  const { currency, setCurrency, categories, addCategory, deleteCategory } = useFinanceStore();
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', type: 'expense' });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const currencies = [
    { code: 'USD', label: 'الدولار الأمريكي ($)', symbol: '$' },
    { code: 'EGP', label: 'الجنيه المصري (ج.م)', symbol: 'ج.م' },
    { code: 'EUR', label: 'اليورو (€)', symbol: '€' },
    { code: 'SAR', label: 'الريال السعودي (ر.س)', symbol: 'ر.س' },
  ];

  const handleAddCategory = () => {
    if (!newCat.name) return;
    addCategory(newCat, user.id);
    setNewCat({ ...newCat, name: '' });
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
      </header>

      {/* User Profile */}
      <section className="bg-card rounded-3xl p-6 border border-border shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{user?.email?.split('@')[0]}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>
      </section>

      {/* Currency Selector */}
      <section className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-foreground mb-2">
          <Globe className="text-primary" size={20} />
          <h3 className="font-bold">العملة الافتراضية</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => setCurrency(c.code)}
              className={`p-3 rounded-2xl border transition-all text-sm font-bold ${
                currency === c.code 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-background text-foreground border-border hover:border-primary/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Category Management */}
      <section className="bg-card rounded-3xl p-6 border border-border shadow-sm space-y-4">
        <button 
          onClick={() => setShowCategoryManager(!showCategoryManager)}
          className="w-full flex items-center justify-between text-foreground"
        >
          <div className="flex items-center gap-3">
            <Tags className="text-secondary" size={20} />
            <h3 className="font-bold">إدارة تصنيفات الدخل والصرف</h3>
          </div>
          <ChevronRight size={20} className={`transition-transform ${showCategoryManager ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showCategoryManager && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4 pt-2"
            >
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="اسم التصنيف..." 
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select 
                  value={newCat.type}
                  onChange={(e) => setNewCat({ ...newCat, type: e.target.value })}
                  className="bg-background border border-border rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="expense">صرف</option>
                  <option value="income">دخل</option>
                </select>
                <button 
                  onClick={handleAddCategory}
                  className="p-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-background rounded-2xl border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${cat.type === 'income' ? 'bg-secondary' : 'bg-destructive'}`} />
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    </div>
                    {!cat.id.toString().startsWith('default') && (
                      <button onClick={() => deleteCategory(cat.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Preferences */}
      <section className="bg-card rounded-3xl p-4 border border-border shadow-sm space-y-1">
        <button className="settings-item" onClick={toggleDarkMode}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <Moon size={20} />
            </div>
            <span className="font-medium">الوضع الليلي</span>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
          </div>
        </button>
        
        <button className="settings-item group">
          <div className="flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Shield size={20} />
            </div>
            <span className="font-medium">الأمان والخصوصية</span>
          </div>
          <ChevronRight size={20} className="text-muted group-hover:translate-x-1 transition-transform" />
        </button>

        <button className="settings-item group">
          <div className="flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Bell size={20} />
            </div>
            <span className="font-medium">الإشعارات</span>
          </div>
          <ChevronRight size={20} className="text-muted group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Logout */}
      <button 
        onClick={signOut}
        className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 text-destructive rounded-3xl font-bold hover:bg-destructive/20 transition-colors border border-destructive/20"
      >
        <LogOut size={20} />
        تسجيل الخروج
      </button>
    </div>
  );
};

export default SettingsView;
