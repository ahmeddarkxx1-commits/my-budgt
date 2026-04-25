import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomeView from './pages/HomeView';
import ProductivityView from './pages/ProductivityView';
import FinanceView from './pages/FinanceView';
import SettingsView from './pages/SettingsView';
import AuthView from './pages/AuthView';
import { useAuthStore } from './store/useAuthStore';
import { useProductivityStore } from './store/useProductivityStore';
import { useFinanceStore } from './store/useFinanceStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Zap } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading, init } = useAuthStore();
  const fetchTasks = useProductivityStore(state => state.fetchTasks);
  const { fetchTransactions, fetchCategories } = useFinanceStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchTransactions();
      fetchCategories();
    }
  }, [user, fetchTasks, fetchTransactions, fetchCategories]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'productivity':
        return <ProductivityView />;
      case 'finance':
        return <FinanceView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background text-foreground transition-colors duration-300">
      <main className="container mx-auto max-w-lg px-4 pt-6">
        <Toaster position="top-center" reverseOrder={false} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      <AnimatePresence>
        {activeTab === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-28 right-8 z-50"
          >
            <button 
              className="fab-button shadow-2xl shadow-primary/50"
              onClick={() => setActiveTab('finance')}
            >
              <Zap size={28} className="fill-current" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;

