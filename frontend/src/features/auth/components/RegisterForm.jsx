import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../slices/authSlice';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoading, error, resetError } = useAuth();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
    } catch (err) {
      // Error handled by redux state
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-[var(--bg-secondary)] rounded-2xl shadow-2xl border border-[var(--border-subtle)]">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-xl mb-4 text-indigo-400">
          <UserPlus size={24} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create Account</h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1 opacity-70">Join the Second Brain community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[var(--text-secondary)]/50 uppercase tracking-widest text-[10px] mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) resetError();
            }}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border-subtle)] focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/20"
            placeholder="johndoe"
          />
        </div>

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
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-400/5 text-red-400 text-sm border border-red-500/10 text-center font-bold">
            {(typeof error === 'string' ? error : error?.message) || 'Registration failed'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20 mt-4"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)]/50 mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
