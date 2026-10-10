import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('You must accept the terms of service');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(fullName, username, email);
      addToast('Account created', `Welcome to StreamHub, ${fullName}!`, 'success');
      navigate('/');
    } catch {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#F5F7FA]">Join StreamHub</h2>
        <p className="text-xs text-[#A3AABD] mt-1">
          Create an account to watch, subscribe, and publish your original content.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#F06464]/10 border border-[#F06464]/30 text-xs text-[#F06464]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Full name</label>
          <div className="relative">
            <User className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Username</label>
          <div className="relative">
            <span className="text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono">@</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="alexrivera"
              className="w-full pl-8 pr-4 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A3AABD] mb-1">Confirm</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A3AABD] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC]"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#A3AABD] leading-relaxed">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-md accent-[#7C5CFC]"
            />
            <span>I agree to the StreamHub Terms of Service and community guidelines.</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all mt-2"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-xs text-[#A3AABD]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#7C5CFC] font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
};
