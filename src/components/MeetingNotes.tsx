
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, Square, Play, Brain, FileText, Download, Calendar, Users } from 'lucide-react';

interface MeetingNote {
  id: string;
  title: string;
  date: Date;
  duration: number;
  participants: string[];
  type: 'video' | 'audio';
  status: 'recording' | 'processing' | 'completed';
  transcript?: string;
  summary?: string;
  actionItems?: string[];
  keyPoints?: string[];
}

export const MeetingNotes: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentMeeting, setCurrentMeeting] = useState<Partial<MeetingNote>>({
    title: '',
    participants: ['You'],
    type: 'video'
  });

  const [previousMeetings, setPreviousMeetings] = useState<MeetingNote[]>([
    {
      id: '1',
      title: 'Sprint Planning Q1 2024',
      date: new Date(Date.now() - 86400000),
      duration: 45,
      participants: ['Sarah Chen', 'Mike Johnson', 'Alex Rodriguez', 'You'],
      type: 'video',
      status: 'completed',
      summary: 'Discussed Q1 objectives, assigned tasks for the upcoming sprint, and reviewed team capacity. Decided to focus on user authentication and dashboard improvements.',
      keyPoints: [
        'Q1 goals: User auth, dashboard, mobile optimization',
        'Sprint duration: 2 weeks',
        'Team capacity: 85% due to holiday schedules',
        'Priority: Security features first'
      ],
      actionItems: [
        'Sarah: Design user authentication flow',
        'Mike: Set up OAuth integration',
        'Alex: Create mobile wireframes',
        'Team: Review security requirements'
      ]
    },
    {
      id: '2',
      title: 'Daily Standup',
      date: new Date(Date.now() - 3600000),
      duration: 15,
      participants: ['Sarah Chen', 'Mike Johnson', 'You'],
      type: 'audio',
      status: 'completed',
      summary: 'Quick sync on current progress. Sarah completed the login component, Mike is working on API integration, and discussing blocker with database connection.',
      keyPoints: [
        'Login component: Completed',
        'API integration: In progress',
        'Database issue: Needs attention'
      ],
      actionItems: [
        'Mike: Contact DevOps for database access',
        'Sarah: Start on password reset flow',
        'Team: Schedule architecture review'
      ]
    }
  ]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Create new meeting record
    const newMeeting: MeetingNote = {
      id: Date.now().toString(),
      title: currentMeeting.title || `Meeting ${new Date().toLocaleDateString()}`,
      date: new Date(),
      duration: recordingTime,
      participants: currentMeeting.participants || ['You'],
      type: currentMeeting.type || 'video',
      status: 'processing'
    };

    setPreviousMeetings(prev => [newMeeting, ...prev]);
    
    // Simulate AI processing
    setTimeout(() => {
      setPreviousMeetings(prev => prev.map(meeting => 
        meeting.id === newMeeting.id 
          ? {
              ...meeting,
              status: 'completed',
              summary: 'AI-generated summary based on the meeting discussion. Key topics covered include project updates, task assignments, and next steps.',
              keyPoints: [
                'Project status updates shared',
                'Task assignments discussed',
                'Next sprint planning scheduled'
              ],
              actionItems: [
                'Follow up on discussed items',
                'Prepare for next meeting',
                'Update project documentation'
              ]
            }
          : meeting
      ));
    }, 5000);

    setCurrentMeeting({ title: '', participants: ['You'], type: 'video' });
    setRecordingTime(0);
  };

  const addParticipant = () => {
    const participant = prompt('Enter participant name:');
    if (participant && participant.trim()) {
      setCurrentMeeting(prev => ({
        ...prev,
        participants: [...(prev.participants || []), participant.trim()]
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Recording Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="text-purple-500" size={24} />
            AI Meeting Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Meeting Setup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Meeting title"
                value={currentMeeting.title}
                onChange={(e) => setCurrentMeeting(prev => ({ ...prev, title: e.target.value }))}
                className="p-2 border rounded"
                disabled={isRecording}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMeeting(prev => ({ ...prev, type: 'video' }))}
                  className={`flex-1 p-2 rounded border ${
                    currentMeeting.type === 'video' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100'
                  }`}
                  disabled={isRecording}
                >
                  <Video size={16} className="inline mr-1" />
                  Video
                </button>
                <button
                  onClick={() => setCurrentMeeting(prev => ({ ...prev, type: 'audio' }))}
                  className={`flex-1 p-2 rounded border ${
                    currentMeeting.type === 'audio' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100'
                  }`}
                  disabled={isRecording}
                >
                  <Mic size={16} className="inline mr-1" />
                  Audio
                </button>
              </div>
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Participants</h4>
                <Button size="sm" variant="outline" onClick={addParticipant} disabled={isRecording}>
                  + Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {currentMeeting.participants?.map((participant, index) => (
                  <Badge key={index} variant="outline">{participant}</Badge>
                ))}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center gap-4 p-6 bg-gray-50 rounded-lg">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                  disabled={!currentMeeting.title?.trim()}
                >
                  <Play size={20} className="mr-2" />
                  Start Recording
                </Button>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-mono font-bold">{formatTime(recordingTime)}</span>
                  </div>
                  <Button 
                    onClick={stopRecording}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Square size={16} className="mr-2" />
                    Stop Recording
                  </Button>
                </div>
              )}
            </div>

            {isRecording && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-700">
                  🤖 AI is actively listening and will generate meeting notes, action items, and summary when recording stops.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Previous Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="text-blue-500" size={24} />
            Meeting History & AI Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previousMeetings.map(meeting => (
              <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {meeting.type === 'video' ? (
                      <Video size={20} className="text-blue-500" />
                    ) : (
                      <Mic size={20} className="text-green-500" />
                    )}
                    <div>
                      <h4 className="font-semibold">{meeting.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {meeting.date.toLocaleDateString()}
                        </span>
                        <span>{meeting.duration} min</span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {meeting.participants.length} participants
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={meeting.status === 'completed' ? 'default' : 'secondary'}
                      className={meeting.status === 'processing' ? 'animate-pulse' : ''}
                    >
                      {meeting.status}
                    </Badge>
                    {meeting.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Download size={14} className="mr-1" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>

                {meeting.status === 'completed' && (
                  <div className="space-y-3 pt-3 border-t">
                    {meeting.summary && (
                      <div>
                        <h5 className="font-medium text-sm mb-1">AI Summary</h5>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {meeting.summary}
                        </p>
                      </div>
                    )}

                    {meeting.keyPoints && meeting.keyPoints.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-1">Key Points</h5>
                        <ul className="text-sm space-y-1">
                          {meeting.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {meeting.actionItems && meeting.actionItems.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-1">Action Items</h5>
                        <ul className="text-sm space-y-1">
                          {meeting.actionItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {meeting.status === 'processing' && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Brain className="animate-spin" size={16} />
                      AI is processing the recording and generating meeting notes...
                    </div>
                  </div>
                )}
              </div>
            ))}

            {previousMeetings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No meeting recordings yet.</p>
                <p className="text-sm">Start your first AI-assisted meeting above!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
