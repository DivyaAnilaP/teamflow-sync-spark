
import React from 'react';
import { 
  MessageSquare, 
  CheckSquare, 
  FolderOpen, 
  Trophy, 
  Heart, 
  BarChart3, 
  Code, 
  Award, 
  Target, 
  Brain, 
  Shield, 
  Mic 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  points: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, points }) => {
  const menuItems = [
    { id: 'tasks', label: 'Task Board', icon: CheckSquare, category: 'core' },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare, category: 'core' },
    { id: 'files', label: 'File Sharing', icon: FolderOpen, category: 'core' },
    { id: 'code', label: 'Code Collab', icon: Code, category: 'collaboration' },
    { id: 'meetings', label: 'AI Meetings', icon: Mic, category: 'collaboration' },
    { id: 'mood', label: 'Mood Check', icon: Heart, category: 'wellness' },
    { id: 'analytics', label: 'Work Heatmap', icon: BarChart3, category: 'analytics' },
    { id: 'sprints', label: 'Sprint Mgmt', icon: Target, category: 'management' },
    { id: 'progress', label: 'Progress Track', icon: Shield, category: 'management' },
    { id: 'ai-wrap', label: 'AI Daily Wrap', icon: Brain, category: 'ai' },
    { id: 'achievements', label: 'Badges', icon: Award, category: 'gamification' },
    { id: 'gamification', label: 'Leaderboard', icon: Trophy, category: 'gamification' },
  ];

  const categories = {
    core: 'Core Features',
    collaboration: 'Collaboration',
    wellness: 'Team Wellness',
    analytics: 'Analytics',
    management: 'Management',
    ai: 'AI Features',
    gamification: 'Gamification'
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <aside className="w-72 bg-white/60 backdrop-blur-sm border-r border-purple-100 p-4 overflow-y-auto">
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              {categories[category as keyof typeof categories]}
            </h3>
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                      activeTab === item.id
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                    )}
                  >
                    <Icon size={16} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Points Display */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <div className="flex items-center gap-2 text-purple-700">
          <Trophy size={20} />
          <span className="font-semibold">Your Points</span>
        </div>
        <p className="text-2xl font-bold text-purple-800 mt-1">{points.toLocaleString()}</p>
        <p className="text-xs text-purple-600 mt-1">Keep collaborating to earn more!</p>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg">
        <div className="text-xs text-green-700 space-y-1">
          <div className="flex justify-between">
            <span>Tasks Today:</span>
            <span className="font-bold">8</span>
          </div>
          <div className="flex justify-between">
            <span>Team Mood:</span>
            <span className="font-bold">😊 Happy</span>
          </div>
          <div className="flex justify-between">
            <span>Sprint Progress:</span>
            <span className="font-bold">76%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
