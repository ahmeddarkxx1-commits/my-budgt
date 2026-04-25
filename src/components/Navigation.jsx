import React, { useState } from 'react';
import { Home, CheckSquare, DollarSign, Settings, Plus, X, Briefcase, Wallet, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = ({ activeTab, setActiveTab }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'productivity', icon: CheckSquare, label: 'المهام' },
    { id: null, icon: null, label: null }, // Spacer for FAB
    { id: 'finance', icon: DollarSign, label: 'المالية' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <>
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-6 pb-32 bg-black/40 backdrop-blur-md" 
            onClick={() => setShowQuickAdd(false)}
          >
            <motion.div 
              initial={{ y: 100, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 100, scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm glass-card rounded-[3rem] p-8 space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground">إضافة سريعة</h3>
                <button onClick={() => setShowQuickAdd(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveTab('productivity'); setShowQuickAdd(false); }}
                  className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-indigo-900/40 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase size={32} />
                  </div>
                  <span className="font-black text-sm">مهمة جديدة</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveTab('finance'); setShowQuickAdd(false); }}
                  className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-emerald-900/40 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wallet size={32} />
                  </div>
                  <span className="font-black text-sm">مصروف جديد</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="mobile-bottom-nav">
        {navItems.map((item, index) => {
          if (item.id === null) {
            return (
              <div key="fab-spacer" className="relative -top-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowQuickAdd(!showQuickAdd)}
                  className="w-16 h-16 gradient-primary text-white rounded-[1.5rem] shadow-2xl shadow-primary/40 flex items-center justify-center border-4 border-background"
                >
                  <motion.div
                    animate={{ rotate: showQuickAdd ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Plus size={36} strokeWidth={3} />
                  </motion.div>
                </motion.button>
              </div>
            );
          }
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all flex-1 relative ${
                activeTab === item.id ? 'text-primary' : 'text-muted hover:text-foreground'
              }`}
            >
              <motion.div
                animate={activeTab === item.id ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
              >
                <item.icon size={26} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${activeTab === item.id ? 'opacity-100' : 'opacity-0 h-0'}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Navigation;
