import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      addToast('Welcome back', `Logged in as ${email}`, 'success');
      navigate('/');
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('alex.rivera@streamhub.io');
    setPassword('streamhub2026!');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#F5F7FA]">Sign in to StreamHub</h2>
        <p className="text-xs text-[#A3AABD] mt-1">
          Access your library, subscribed creators, and creator studio.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#F06464]/10 border border-[#F06464]/30 text-xs text-[#F06464]">
          {error}
        </div>
      )}

      {/* Demo Credentials Helper Pill */}
      <div className="p-3.5 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 flex items-center justify-between gap-3">
        <div className="text-xs text-[#A3AABD]">
          <span className="font-semibold text-[#9278FF] block">Demo Account Ready:</span>
          <span>alex.rivera@streamhub.io</span>
        </div>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shrink-0 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-fill</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#A3AABD] mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC] transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#A3AABD]">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#7C5CFC] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC] transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A3AABD] hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A3AABD]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-md accent-[#7C5CFC]"
            />
            <span>Remember this device</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-xs text-[#A3AABD]">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#7C5CFC] font-semibold hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
};
