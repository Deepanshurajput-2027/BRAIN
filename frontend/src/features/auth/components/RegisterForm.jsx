import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Brain, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import { PasswordInput } from '../../../shared/components/PasswordInput';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, error, resetError } = useAuth();
  const dispatch = useDispatch();

  const passwordsMatch = confirmPassword === '' || password === confirmPassword;

  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return null;
    if (pass.length < 8) return { level: 'Weak', color: '#E53E3E', width: '33%' };
    if (pass.length >= 8 && !/[^a-zA-Z0-9]/.test(pass)) return { level: 'Fair', color: '#F6AD55', width: '66%' };
    return { level: 'Strong', color: '#48BB78', width: '100%' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
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
          <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-[#9090CC] text-sm mt-1 font-medium">Join the Second Brain community</p>
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

        <div className="space-y-4">
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

          {password && (() => {
            const strength = getPasswordStrength(password);
            return (
              <div className="mt-2 px-1">
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest mt-1.5" style={{ color: strength.color }}>
                  {strength.level}
                </p>
              </div>
            );
          })()}

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            error={!passwordsMatch}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-[#E53E3E] text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">Passwords do not match</p>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-400/5 text-red-400 text-sm border border-red-500/10 text-center font-bold">
            {(typeof error === 'string' ? error : error?.message) || 'Registration failed'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !passwordsMatch || !password || !confirmPassword}
          className="w-full bg-[#6C63FF] hover:bg-[#5A52E8] text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20 mt-6"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      </div>

      <p className="text-center text-sm text-[#555577] mt-8 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-[#6C63FF] font-black hover:underline underline-offset-4">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
