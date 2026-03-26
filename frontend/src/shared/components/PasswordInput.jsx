import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = ({ label, name, placeholder, value, onChange, required = false, error = false }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative group">
      <label className="block text-[10px] font-black text-[#9090CC] uppercase tracking-[0.2em] mb-2 ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition-all outline-none text-white placeholder:text-[#555577] pr-12
            ${error 
              ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/20' 
              : 'border-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50'
            }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#555577] hover:text-white transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};
