import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Lock, Mail, User, RefreshCw, Sun, Moon } from 'lucide-react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signup, loading, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      await signup(username, email, password);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 md:p-8 font-sans transition-colors duration-200">
      {/* Container Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/50 dark:border-slate-800/40 min-h-[580px] z-10"
      >
        {/* Left Pane - Blue Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-10 md:p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Abstract SVG Ornaments */}
          <div className="absolute top-8 left-8 flex gap-2 opacity-50">
            <div className="w-1.5 h-6 bg-white/20 rounded-full" />
            <div className="w-1.5 h-10 bg-white/40 rounded-full" />
            <div className="w-1.5 h-4 bg-white/20 rounded-full" />
          </div>
          <div className="absolute top-16 right-16 w-3 h-3 rounded-full border-2 border-white/20" />
          
          {/* Concentric bottom circles matching mockup */}
          <div className="absolute bottom-[-60px] right-[-60px] w-48 h-48 rounded-full border-[16px] border-white/10 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-[12px] border-white/10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-cyan-400/20" />
            </div>
          </div>
          
          {/* Scattered dots */}
          <div className="absolute bottom-10 left-10 opacity-30 grid grid-cols-4 gap-1.5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>

          <div className="text-left z-10">
            {/* Custom logo icon clickable to Home */}
            <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition cursor-pointer">
              <svg 
                className="w-7 h-7 text-cyan-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              <span className="font-extrabold text-base tracking-wider">PRO-ALIGN</span>
            </Link>
          </div>

          <div className="space-y-4 text-left z-10 my-auto">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Adventure <br />starts here
            </h1>
            <p className="text-slate-100/80 text-xs leading-relaxed max-w-xs">
              Create an account to join modern recruiters, build semantic resume comparisons, and score match guides.
            </p>
          </div>

          <div className="z-10 text-left text-[10px] text-slate-200/50">
            © 2026 PRO-ALIGN. All rights reserved.
          </div>
        </div>

        {/* Right Pane - Light Signup Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-50 dark:bg-slate-900/50 relative">
          
          {/* Top-right action bar: Back to Home & Theme switcher */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <Link 
              to="/" 
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
            >
              ← Back to Home
            </Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-500" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            </button>
          </div>

          <div className="max-w-sm w-full mx-auto space-y-5">
            {/* Header */}
            <div className="text-center md:text-left space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto md:mx-0 mb-3 border border-blue-500/20">
                <svg 
                  className="w-6 h-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-850 dark:text-slate-100">
                Get Started
              </h2>
              <p className="text-xs text-slate-400">Create an account to join our community.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-xl">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">
              {/* Input 1: Username */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="developer101"
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-slate-800 dark:text-slate-200 transition"
                  />
                </div>
              </div>

              {/* Input 2: Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-slate-800 dark:text-slate-200 transition"
                  />
                </div>
              </div>

              {/* Input 3: Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-slate-800 dark:text-slate-200 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs text-white transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Create Account'}
              </button>
            </form>



            {/* Footer */}
            <div className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold transition">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
