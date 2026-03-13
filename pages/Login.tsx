
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (username: string, password: string, type: 'AGENT' | 'ADMIN') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAgentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert("يرجى إدخال اسم المستخدم وكلمة المرور");
    onLogin(username, password, 'AGENT');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert("يرجى إدخال اسم المستخدم وكلمة المرور");
    onLogin(username, password, 'ADMIN');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
      {/* Static light background - animate-pulse removed */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-10 group">
             <div className="absolute -inset-6 bg-white opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity"></div>
             <div className="relative w-36 h-36 bg-[#050505] border-2 border-white/5 rounded-[3.5rem] flex items-center justify-center text-white font-black text-7xl shadow-2xl transition-all group-hover:scale-105 group-hover:border-white/20">
                M
             </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic">MANDOUBI</h1>
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.8em]">Field Operation Hub</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]">
          <form className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mr-4">Username / اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-8 py-5 rounded-3xl bg-black border border-white/5 text-white focus:border-white focus:ring-0 outline-none transition-all font-bold placeholder:text-gray-800 text-sm"
                placeholder="USERNAME"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mr-4">Password / كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-8 py-5 rounded-3xl bg-black border border-white/5 text-white focus:border-white focus:ring-0 outline-none transition-all font-bold placeholder:text-gray-800 text-sm"
                placeholder="PASSWORD"
              />
            </div>

            <div className="flex flex-col gap-4 pt-8">
              <button
                onClick={handleAgentLogin}
                className="w-full bg-white text-black font-black py-5 rounded-[2rem] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em]"
              >
                Agent Deployment
              </button>
              <div className="flex items-center gap-4">
                <div className="h-px bg-white/5 flex-1"></div>
                <span className="text-[9px] font-black text-gray-700 uppercase">OR</span>
                <div className="h-px bg-white/5 flex-1"></div>
              </div>
              <button
                onClick={handleAdminLogin}
                className="w-full bg-transparent text-white border border-white/10 font-black py-5 rounded-[2rem] hover:bg-white hover:text-black active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em]"
              >
                Admin Command
              </button>
            </div>
          </form>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[8px] font-black text-gray-800 uppercase tracking-[1em]">
            SYSTEM VERSION 3.2.0 &bull; MMXXV
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
