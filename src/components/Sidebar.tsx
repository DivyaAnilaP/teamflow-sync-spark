
import React from 'react';
import { MessageSquare, CheckSquare, FolderOpen, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  points: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, points }) => {
  const menuItems = [
    { id: 'tasks', label: 'Task Board', icon: CheckSquare },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'files', label: 'File Sharing', icon: FolderOpen },
    { id: 'gamification', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-sm border-r border-purple-100 p-4">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                activeTab === item.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Points Display */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <div className="flex items-center gap-2 text-purple-700">
          <Trophy size={20} />
          <span className="font-semibold">Your Points</span>
        </div>
        <p className="text-2xl font-bold text-purple-800 mt-1">{points.toLocaleString()}</p>
      </div>
    </aside>
  );
};
