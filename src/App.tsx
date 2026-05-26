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
        {/* Fixed Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 mr-16">
          <Header />
          <div className="max-w-[1700px] mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Fixed Right Sidebar */}
        <ActiveContacts />
      </div>
    </FirebaseProvider>
  );
}

