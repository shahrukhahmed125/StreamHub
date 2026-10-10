import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs text-[#A3AABD] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to sign in</span>
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-[#F5F7FA]">Password Recovery</h2>
        <p className="text-xs text-[#A3AABD] mt-1">
          Enter the email associated with your StreamHub account.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-5 rounded-2xl bg-[#35C98A]/10 border border-[#35C98A]/30 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#35C98A] mx-auto" />
          <h3 className="text-sm font-bold text-[#F5F7FA]">Reset Link Simulated</h3>
          <p className="text-xs text-[#A3AABD] leading-relaxed">
            In a production environment, a secure password reset link would be sent to{' '}
            <span className="font-semibold text-white">{email}</span>.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block px-4 py-2 bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold rounded-xl"
            >
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181C26] border border-[#2A3040] text-sm text-[#F5F7FA] placeholder-[#A3AABD]/50 focus:outline-hidden focus:border-[#7C5CFC]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] disabled:opacity-50 text-white text-sm font-semibold shadow-md shadow-[#7C5CFC]/25 transition-all"
          >
            {isLoading ? 'Sending request...' : 'Send Recovery Link'}
          </button>
        </form>
      )}
    </div>
  );
};
