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
      <div className="flex bg-bg-main min-h-screen text-gray-400">
        {/* Fixed Sidebar - Hidden on mobile */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} hidden lg:block`}>
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

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

