import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { MobileNavigation } from '../components/MobileNavigation';
import { ToastContainer } from '../components/ToastContainer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F7FA] flex flex-col antialiased selection:bg-[#7C5CFC]/30 selection:text-white">
      {/* Cinematic Top Navigation Header */}
      <AppHeader />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full pt-16 pb-20 md:pb-12 px-4 sm:px-8 max-w-[1800px] mx-auto overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
