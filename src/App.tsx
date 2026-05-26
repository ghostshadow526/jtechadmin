/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ActiveContacts from './components/layout/ActiveContacts';
import AIServices from './components/dashboard/AIServices';
import Complaints from './components/dashboard/Complaints';
import Users from './components/dashboard/Users';
import { FirebaseProvider } from './components/FirebaseProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState('ai-services');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'ai-services':
        return <AIServices />;
      case 'complaints':
        return <Complaints />;
      case 'users':
        return <Users />;
      default:
        return <AIServices />;
    }
  };

  return (
    <FirebaseProvider>
      <div className="flex bg-bg-main min-h-screen text-gray-400 relative">
        {/* Fixed Sidebar - Mobile overlay / Desktop sidebar */}
        <div className={`fixed lg:relative top-20 left-0 h-screen lg:h-auto transition-all duration-300 z-30 lg:z-0 ${sidebarOpen ? 'w-64 block' : 'w-0 hidden lg:block'} lg:w-64`}>
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-20 top-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 mr-16 lg:ml-0">
          <Header sidebarOpen={sidebarOpen} onSidebarToggle={setSidebarOpen} />
          <div className="max-w-[1700px] mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Fixed Right Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <ActiveContacts />
        </div>
      </div>
    </FirebaseProvider>
  );
}

