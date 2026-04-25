import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, User, ArrowRight, Code, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, loading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full gradient-primary blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full gradient-secondary blur-[120px] opacity-20 animate-pulse" />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 gradient-primary rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white shadow-2xl shadow-primary/40"
          >
            <Zap size={40} className="fill-current" />
          </motion.div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter mb-2">
            {isLogin ? 'مرحباً بعودتك' : 'ابدأ رحلتك'}
          </h1>
          <p className="text-muted-foreground font-medium">نظامك الشخصي لإدارة المهام والمالية باحترافية</p>
        </div>

        <div className="glass-card p-8 rounded-[3rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-destructive/10 text-destructive text-xs font-bold p-4 rounded-2xl border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 gradient-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-border flex-1" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">أو عبر</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="flex gap-4 w-full">
              <button className="flex-1 py-4 glass-card rounded-2xl flex items-center justify-center hover:bg-muted/50 transition-colors">
                <Code size={20} />
              </button>
              <button className="flex-1 py-4 glass-card rounded-2xl flex items-center justify-center hover:bg-muted/50 transition-colors">
                <Shield size={20} />
              </button>
            </div>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthView;
