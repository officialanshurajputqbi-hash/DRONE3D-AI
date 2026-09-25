import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface AuthPageProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToLanding }) => {
  const { loginUser } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('demo@drone3d.ai');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your credentials.');
      return;
    }
    loginUser(email);
    onSuccess();
  };

  const fillDemo = () => {
    setEmail('demo@drone3d.ai');
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#07111F] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
      >
        ← Return to Platform Overview
      </button>

      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25 mb-3 text-lg">
            3D
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            {isSignUp ? 'Create Operator Account' : 'Mission Control Access'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp
              ? 'Register your telemetry and drone reconstruction credentials'
              : 'Sign in to access your 3D digital twins and processing pipelines'}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@drone3d.ai"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-0"
              />
              <span>Remember this workstation</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); fillDemo(); }} className="text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Login Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              SIH Evaluator Demo Login
            </span>
            <button
              onClick={fillDemo}
              className="text-[11px] font-semibold text-cyan-400 hover:underline"
            >
              Autofill
            </button>
          </div>
          <div className="font-mono text-[11px] text-slate-400 space-y-0.5">
            <div>Email: <span className="text-slate-200">demo@drone3d.ai</span></div>
            <div>Password: <span className="text-slate-200">demo123</span></div>
          </div>
        </div>

        {/* Toggle sign in / sign up */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <span>{isSignUp ? 'Already registered?' : "Don't have an operator account?"}{' '}</span>
          <button
            onClick={() => setIsSignUp((prev) => !prev)}
            className="text-blue-400 font-semibold hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};
