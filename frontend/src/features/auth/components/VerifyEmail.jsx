import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Brain, ArrowLeft } from 'lucide-react';
import * as authService from '../services/authService';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'succeeded' | 'failed'
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('succeeded');
        setMessage('Your email has been verified successfully!');
      } catch (err) {
        setStatus('failed');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-[#0B0724]/80 backdrop-blur-xl border border-white/5 shadow-2xl animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-2">
          <Brain size={32} />
        </div>
        
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="animate-spin text-indigo-500 mx-auto" size={40} />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Verifying...</h2>
              <p className="text-slate-400 text-sm">{message}</p>
            </div>
          </div>
        )}

        {status === 'succeeded' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Verified!</h2>
              <p className="text-emerald-400/80 text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 mx-auto">
              <XCircle size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Verification Failed</h2>
              <p className="text-red-400/80 text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Link 
            to="/login"
            className="flex items-center justify-center gap-2 py-3 px-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
