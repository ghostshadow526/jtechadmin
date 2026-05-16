/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ActiveContacts from './components/layout/ActiveContacts';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import AIServices from './components/dashboard/AIServices';
import { FirebaseProvider } from './components/FirebaseProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'ai-services':
        return <AIServices />;
      default:
        return <AnalyticsDashboard />;
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

