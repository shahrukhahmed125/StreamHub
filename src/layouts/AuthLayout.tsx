import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { PlaySquare } from 'lucide-react';
import { ToastContainer } from '../components/ToastContainer';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F7FA] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#9278FF] flex items-center justify-center text-white shadow-lg shadow-[#7C5CFC]/30 group-hover:scale-105 transition-transform">
            <PlaySquare className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F5F7FA]">
            Stream<span className="text-[#7C5CFC]">Hub</span>
          </span>
        </Link>
      </div>

      {/* Card Content */}
      <div className="w-full max-w-md bg-[#12151D] border border-[#2A3040] rounded-2xl shadow-2xl p-8 z-10">
        <Outlet />
      </div>

      <div className="mt-8 text-center text-xs text-[#A3AABD] z-10">
        <p>© 2026 StreamHub Platform · Demonstration Prototype</p>
      </div>

      <ToastContainer />
    </div>
  );
};
