import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { StudioSidebar } from '../components/StudioSidebar';
import { ToastContainer } from '../components/ToastContainer';
import { useAuth } from '../contexts/AuthContext';
import { Bell, HelpCircle, ExternalLink, Video as VideoIcon } from 'lucide-react';

export const StudioLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F7FA] flex flex-col">
      {/* Studio Top Bar */}
      <header className="h-16 bg-[#0B0D12] border-b border-[#2A3040]/70 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#F5F7FA]">Creator Dashboard</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#7C5CFC]/20 text-[#9278FF] border border-[#7C5CFC]/30">
            Prototype Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/channel/channel-techmatrix"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181C26] hover:bg-[#202635] border border-[#2A3040] text-xs text-[#A3AABD] hover:text-[#F5F7FA] transition-colors"
          >
            <span>View Public Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/studio/upload"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C5CFC] hover:bg-[#9278FF] text-white text-xs font-semibold shadow-md shadow-[#7C5CFC]/20 transition-all"
          >
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Create</span>
          </Link>

          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-[#2A3040]"
          />
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden">
        <StudioSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#0B0D12]">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
