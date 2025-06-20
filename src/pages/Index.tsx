
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TaskBoard } from '@/components/TaskBoard';
import { ChatPanel } from '@/components/ChatPanel';
import { FileSharing } from '@/components/FileSharing';
import { Gamification } from '@/components/Gamification';
import { UserPresence } from '@/components/UserPresence';
import { MoodCheck } from '@/components/MoodCheck';
import { SmartTaskSuggestions } from '@/components/SmartTaskSuggestions';
import { WorkHeatmap } from '@/components/WorkHeatmap';
import { CodeCollaboration } from '@/components/CodeCollaboration';
import { BadgesAndTitles } from '@/components/BadgesAndTitles';
import { SprintManagement } from '@/components/SprintManagement';
import { AIWrapUp } from '@/components/AIWrapUp';
import { ProgressTracking } from '@/components/ProgressTracking';
import { MeetingNotes } from '@/components/MeetingNotes';

const Index = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [points, setPoints] = useState(1250);
  const [userRole] = useState<'manager' | 'team-lead' | 'member'>('team-lead'); // Simulated user role

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const handleAcceptSuggestion = (suggestion: any) => {
    // Add suggested task to task board
    console.log('Adding suggested task:', suggestion);
    addPoints(10); // Bonus points for accepting AI suggestions
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
                TeamSync Pro
              </h1>
              <p className="text-gray-600 text-sm">Advanced real-time collaboration platform</p>
            </div>
            <UserPresence />
          </header>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <TaskBoard onPointsEarned={addPoints} />
                  <SmartTaskSuggestions onAcceptSuggestion={handleAcceptSuggestion} />
                </div>
              )}
              {activeTab === 'chat' && <ChatPanel onPointsEarned={addPoints} />}
              {activeTab === 'files' && <FileSharing />}
              {activeTab === 'gamification' && <Gamification points={points} />}
              {activeTab === 'mood' && <MoodCheck />}
              {activeTab === 'analytics' && <WorkHeatmap />}
              {activeTab === 'code' && <CodeCollaboration />}
              {activeTab === 'achievements' && <BadgesAndTitles />}
              {activeTab === 'sprints' && <SprintManagement isManager={userRole === 'manager'} />}
              {activeTab === 'ai-wrap' && <AIWrapUp />}
              {activeTab === 'progress' && <ProgressTracking userRole={userRole} />}
              {activeTab === 'meetings' && <MeetingNotes />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
