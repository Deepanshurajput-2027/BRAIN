import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Loader2, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PasswordInput } from '../../../shared/components/PasswordInput';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, resetError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error handled by redux state
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Link to="/" className="flex flex-col items-center mb-8 group">
        <div className="w-14 h-14 bg-[#6C63FF] rounded-2xl flex items-center justify-center mb-3 shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-white text-2xl font-black tracking-tight">BRAIN</h1>
        <p className="text-[#9090CC] text-xs mt-1 font-bold uppercase tracking-[0.2em] opacity-70">Your Second Brain</p>
      </Link>

      <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="flex flex-col items-center mb-8 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight grow">Welcome Back</h2>
          <p className="text-[#9090CC] text-sm mt-1 font-medium">Please enter your details to sign in</p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[var(--text-secondary)]/50 uppercase tracking-widest text-[10px] mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) resetError();
            }}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border-subtle)] focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/20"
            placeholder="name@example.com"
          />
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) resetError();
          }}
          required
          placeholder="••••••••"
        />
        <div className="flex justify-end -mt-3">
          <Link to="/forgot-password" size={16} className="text-xs font-bold text-indigo-400/60 hover:text-indigo-400 transition-colors">
            Forgot Password?
          </Link>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-400/5 text-red-400 text-sm border border-red-500/10 animate-in fade-in slide-in-from-top-1 text-center font-bold">
            {(typeof error === 'string' ? error : error?.message) || 'Login failed'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#6C63FF] hover:bg-[#5A52E8] text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      </div>

      <p className="text-center text-sm text-[#555577] mt-8 font-medium">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#6C63FF] font-black hover:underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
