import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, ArrowLeft, CheckCircle, Moon, Sun } from 'lucide-react';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { theme, toggleTheme } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    if (!email) {
      setError('Email is required.');
      setSubmitting(false);
      return;
    }
    
    try {
      const res = await authService.forgotPassword(email);
      setSuccess(res.message || 'Password reset instructions have been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request.');
    } finally {
      setSubmitting(false);
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
            {/* Custom logo icon */}
            <div className="flex items-center gap-2 mb-8">
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
            </div>
          </div>

          <div className="space-y-4 text-left z-10 my-auto">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Recovery <br />starts here
            </h1>
            <p className="text-slate-100/80 text-xs leading-relaxed max-w-xs">
              Follow simple security steps to recover your access key and continue optimization tasks.
            </p>
          </div>

          <div className="z-10 text-left text-[10px] text-slate-200/50">
            © 2026 PRO-ALIGN. All rights reserved.
          </div>
        </div>

        {/* Right Pane - Light Password Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-50 dark:bg-slate-900/50 relative">
          
          {/* Theme switcher */}
          <button 
            onClick={toggleTheme}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-slate-500" /> : <Sun className="w-4 h-4 text-yellow-400" />}
          </button>

          <div className="max-w-sm w-full mx-auto space-y-6">
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
                Reset Password
              </h2>
              <p className="text-xs text-slate-400">Enter your email to receive recovery instructions.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  {success}
                </p>
                <div className="pt-2">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 font-bold transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                {/* Input: Email */}
                <div className="space-y-1.5">
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xs text-white transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Send Recovery Email'}
                </button>

                <div className="text-center pt-2">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
