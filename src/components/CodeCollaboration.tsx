
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Share, Users, Eye, Edit, Code } from 'lucide-react';

interface CodeUser {
  id: string;
  name: string;
  avatar: string;
  isViewing: boolean;
  isEditing: boolean;
  cursorLine?: number;
  status: 'online' | 'away';
}

export const CodeCollaboration: React.FC = () => {
  const [code, setCode] = useState(`// Welcome to Collaborative Code Editor
function calculateTeamProductivity(tasks, hours) {
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const productivity = completedTasks.length / hours;
  
  return {
    score: Math.round(productivity * 100),
    efficiency: productivity > 0.8 ? 'high' : 'medium'
  };
}

// Real-time collaboration active
console.log('Team members online: 3');`);

  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeUsers, setActiveUsers] = useState<CodeUser[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'SC',
      isViewing: true,
      isEditing: false,
      cursorLine: 5,
      status: 'online'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      avatar: 'MJ',
      isViewing: true,
      isEditing: true,
      cursorLine: 12,
      status: 'online'
    },
    {
      id: '3',
      name: 'You',
      avatar: 'YU',
      isViewing: true,
      isEditing: false,
      status: 'online'
    }
  ]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setCursorPosition(e.target.selectionStart);
    
    // Simulate real-time editing status
    setActiveUsers(prev => prev.map(user => 
      user.id === '3' 
        ? { ...user, isEditing: true, cursorLine: getCurrentLine(e.target.selectionStart) }
        : user
    ));
  };

  const getCurrentLine = (position: number): number => {
    const textBeforeCursor = code.substring(0, position);
    return textBeforeCursor.split('\n').length;
  };

  const toggleVideoCall = () => {
    setIsVideoCall(!isVideoCall);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  useEffect(() => {
    // Simulate real-time cursor updates
    const interval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => {
        if (user.id !== '3') {
          return {
            ...user,
            cursorLine: Math.floor(Math.random() * 15) + 1,
            isEditing: Math.random() > 0.7
          };
        }
        return user;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Video Call Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="text-blue-500" size={24} />
              Live Code Collaboration
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-600">
                <Users size={12} className="mr-1" />
                {activeUsers.filter(u => u.status === 'online').length} online
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button
              onClick={toggleVideoCall}
              variant={isVideoCall ? "default" : "outline"}
              size="sm"
              className={isVideoCall ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isVideoCall ? <Video size={16} /> : <VideoOff size={16} />}
              {isVideoCall ? 'End Call' : 'Start Video'}
            </Button>
            
            <Button
              onClick={toggleMute}
              variant={isMuted ? "destructive" : "outline"}
              size="sm"
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            
            <Button
              onClick={toggleScreenShare}
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              className={isScreenSharing ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <Share size={16} className="mr-1" />
              {isScreenSharing ? 'Stop Share' : 'Share Screen'}
            </Button>
          </div>

          {/* Active Users */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Active in editor:</span>
            {activeUsers.map(user => (
              <div key={user.id} className="flex items-center gap-1">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white ${
                    user.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{user.name}</span>
                  {user.isEditing && <Edit size={10} className="text-green-500" />}
                  {user.isViewing && !user.isEditing && <Eye size={10} className="text-blue-500" />}
                  {user.cursorLine && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      L{user.cursorLine}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Collaborative Code Editor</span>
            <div className="flex gap-2">
              <Badge variant="outline">JavaScript</Badge>
              <Badge variant="outline">Auto-save: ON</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <textarea
              ref={textAreaRef}
              value={code}
              onChange={handleCodeChange}
              className="w-full h-96 font-mono text-sm p-4 border rounded-lg bg-gray-50 resize-none"
              placeholder="Start coding collaboratively..."
            />
            
            {/* Live cursors indicator */}
            <div className="absolute top-2 right-2 space-y-1">
              {activeUsers.filter(u => u.isEditing && u.id !== '3').map(user => (
                <div key={user.id} className="flex items-center gap-1 text-xs bg-white rounded px-2 py-1 shadow">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>{user.name} editing line {user.cursorLine}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <div>
              Current line: {getCurrentLine(cursorPosition)} | 
              Characters: {code.length} | 
              Lines: {code.split('\n').length}
            </div>
            <div className="flex items-center gap-2">
              <span>Last saved: just now</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Participants (when video call is active) */}
      {isVideoCall && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activeUsers.filter(u => u.status === 'online').map(user => (
                <div key={user.id} className="relative">
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-white">
                    <div className="text-4xl font-bold">{user.avatar}</div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {user.name}
                  </div>
                  {user.name === 'You' && isMuted && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded">
                      <MicOff size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
