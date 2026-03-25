import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="max-w-md w-full mx-auto p-8 bg-[var(--bg-secondary)] rounded-2xl shadow-2xl border border-[var(--border-subtle)]">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-xl mb-4 text-indigo-400">
          <LogIn size={24} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1 opacity-70">Please enter your details to sign in</p>
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

        <div>
          <label className="block text-sm font-bold text-[var(--text-secondary)]/50 uppercase tracking-widest text-[10px] mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) resetError();
            }}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border-subtle)] focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/20"
            placeholder="••••••••"
          />
          <div className="flex justify-end mt-2">
            <Link to="/forgot-password" size={16} className="text-xs font-bold text-indigo-400/60 hover:text-indigo-400 transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-400/5 text-red-400 text-sm border border-red-500/10 animate-in fade-in slide-in-from-top-1 text-center font-bold">
            {(typeof error === 'string' ? error : error?.message) || 'Login failed'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)]/50 mt-8">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 font-bold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
