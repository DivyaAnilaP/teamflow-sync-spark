
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TaskBoard } from '@/components/TaskBoard';
import { ChatPanel } from '@/components/ChatPanel';
import { FileSharing } from '@/components/FileSharing';
import { Gamification } from '@/components/Gamification';
import { UserPresence } from '@/components/UserPresence';

const Index = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [points, setPoints] = useState(1250);

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} points={points} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Team Workspace
              </h1>
              <p className="text-gray-600 text-sm">Collaborate in real-time with your team</p>
            </div>
            <UserPresence />
          </header>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-6">
              {activeTab === 'tasks' && <TaskBoard onPointsEarned={addPoints} />}
              {activeTab === 'chat' && <ChatPanel onPointsEarned={addPoints} />}
              {activeTab === 'files' && <FileSharing />}
              {activeTab === 'gamification' && <Gamification points={points} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
