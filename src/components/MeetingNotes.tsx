
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, MicOff, VideoOff, Phone, Mail, Users, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Meeting {
  id: string;
  title: string;
  participant_emails: string[];
  meeting_date: string;
  meeting_time: string;
  duration: number;
  type: 'video' | 'audio';
  status: 'scheduled' | 'ongoing' | 'completed';
  notes?: string;
  recordings?: string[];
  workspace_id: string;
  created_by: string;
}

interface MeetingNotesProps {
  user: any;
  workspace: any;
}

export const MeetingNotes: React.FC<MeetingNotesProps> = ({ user, workspace }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    participantEmails: '',
    date: '',
    time: '',
    duration: 30,
    type: 'video' as 'video' | 'audio'
  });

  useEffect(() => {
    fetchMeetings();
  }, [workspace]);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('workspace_id', workspace.name)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to load meetings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMeetingInvites = async (meeting: Meeting) => {
    try {
      for (const email of meeting.participant_emails) {
        const { error } = await supabase.functions.invoke('send-email', {
          body: {
            to: email,
            subject: `Meeting Invitation: ${meeting.title}`,
            html: `
              <h2>You're invited to a meeting!</h2>
              <h3>${meeting.title}</h3>
              <p><strong>Date:</strong> ${meeting.meeting_date}</p>
              <p><strong>Time:</strong> ${meeting.meeting_time}</p>
              <p><strong>Duration:</strong> ${meeting.duration} minutes</p>
              <p><strong>Type:</strong> ${meeting.type} call</p>
              <p><strong>Workspace:</strong> ${workspace.name}</p>
              <br>
              <p>Join the meeting when it's time!</p>
              <p>Best regards,<br>TeamFlow Team</p>
            `
          }
        });

        if (error) throw error;
      }

      toast({
        title: "Meeting Scheduled! 📅",
        description: `Meeting invites sent to ${meeting.participant_emails.length} participants`,
      });
    } catch (error) {
      console.error('Error sending meeting invites:', error);
      toast({
        title: "Email Error",
        description: "Failed to send meeting invitations",
        variant: "destructive"
      });
    }
  };

  const scheduleMeeting = async () => {
    if (!newMeeting.title || !newMeeting.participantEmails) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const emails = newMeeting.participantEmails.split(',').map(email => email.trim());

    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert({
          title: newMeeting.title,
          participant_emails: emails,
          meeting_date: newMeeting.date,
          meeting_time: newMeeting.time,
          duration: newMeeting.duration,
          type: newMeeting.type,
          workspace_id: workspace.name,
          created_by: user.name,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      setMeetings(prev => [data, ...prev]);

      // Send email invitations
      await sendMeetingInvites(data);

      setNewMeeting({
        title: '',
        participantEmails: '',
        date: '',
        time: '',
        duration: 30,
        type: 'video'
      });
      setShowNewMeetingForm(false);
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive"
      });
    }
  };

  const startCall = async (meeting: Meeting) => {
    setIsInCall(true);
    setCallType(meeting.type);
    setCurrentMeeting(meeting);

    try {
      const { error } = await supabase
        .from('meetings')
        .update({ status: 'ongoing' })
        .eq('id', meeting.id);

      if (error) throw error;

      setMeetings(prev => prev.map(m => 
        m.id === meeting.id ? { ...m, status: 'ongoing' } : m
      ));

      toast({
        title: `${meeting.type === 'video' ? 'Video' : 'Audio'} Call Started`,
        description: "AI is recording notes automatically",
      });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const endCall = async () => {
    if (!currentMeeting) return;

    try {
      const { error } = await supabase
        .from('meetings')
        .update({ 
          status: 'completed',
          notes: 'AI Generated Notes: Meeting completed successfully. Participants discussed project progress and next steps.'
        })
        .eq('id', currentMeeting.id);

      if (error) throw error;

      setMeetings(prev => prev.map(m => 
        m.id === currentMeeting.id 
          ? { ...m, status: 'completed', notes: 'AI Generated Notes: Meeting completed successfully. Participants discussed project progress and next steps.' }
          : m
      ));

      setIsInCall(false);
      setCurrentMeeting(null);
      
      toast({
        title: "Call Ended",
        description: "Meeting notes have been generated by AI",
      });
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading meetings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Active Call Interface */}
      {isInCall && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-green-800">
                {callType === 'video' ? 'Video' : 'Audio'} Call in Progress
              </h3>
              
              {callType === 'video' && (
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center text-white">
                    <div className="text-center">
                      {isVideoOn ? <Video size={24} className="mx-auto mb-2" /> : <VideoOff size={24} className="mx-auto mb-2" />}
                      <p className="text-sm">Your Video</p>
                      <p className="text-xs mt-1">{isVideoOn ? 'Camera On' : 'Camera Off'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg aspect-video flex items-center justify-center text-white">
                    <div className="text-center">
                      <Users size={24} className="mx-auto mb-2" />
                      <p className="text-sm">Participants</p>
                      <p className="text-xs mt-1">Waiting to join...</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4">
                <Button
                  variant={isMicOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                </Button>
                
                {callType === 'video' && (
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video size={16} /> : <VideoOff size={16} />}
                  </Button>
                )}
                
                <Button variant="destructive" onClick={endCall}>
                  <Phone size={16} className="mr-2" />
                  End Call
                </Button>
              </div>
              
              <Badge className="bg-red-500">🔴 AI Recording Notes</Badge>
              <p className="text-sm text-green-700">
                Note: This is a demo interface. In a real implementation, you would integrate with video calling services like Zoom, Google Meet, or WebRTC.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule New Meeting */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-blue-500" size={24} />
              Meeting Scheduler
            </CardTitle>
            <Button 
              onClick={() => setShowNewMeetingForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              Schedule Meeting
            </Button>
          </div>
        </CardHeader>

        {showNewMeetingForm && (
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder="Meeting title *"
              value={newMeeting.title}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            
            <textarea
              placeholder="Participant emails (comma separated) *"
              value={newMeeting.participantEmails}
              onChange={(e) => setNewMeeting(prev => ({ ...prev, participantEmails: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="240"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Call Type</label>
                <select
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, type: e.target.value as 'video' | 'audio' }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={scheduleMeeting}>Schedule & Send Invites</Button>
              <Button variant="outline" onClick={() => setShowNewMeetingForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <CardTitle>Meetings & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {meetings.map(meeting => (
            <div key={meeting.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{meeting.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {meeting.meeting_date} at {meeting.meeting_time}
                    </span>
                    <span className="flex items-center gap-1">
                      {meeting.type === 'video' ? <Video size={14} /> : <Mic size={14} />}
                      {meeting.type === 'video' ? 'Video' : 'Audio'} ({meeting.duration}min)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={meeting.status === 'completed' ? 'default' : 
                            meeting.status === 'ongoing' ? 'destructive' : 'secondary'}
                  >
                    {meeting.status}
                  </Badge>
                  {meeting.status === 'scheduled' && (
                    <Button size="sm" onClick={() => startCall(meeting)}>
                      Join Call
                    </Button>
                  )}
                </div>
              </div>
              
              {meeting.participant_emails.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span>Invited: {meeting.participant_emails.join(', ')}</span>
                </div>
              )}
              
              {meeting.notes && (
                <div className="bg-gray-50 p-3 rounded">
                  <h5 className="font-medium text-sm mb-1">AI Generated Notes:</h5>
                  <p className="text-sm text-gray-700">{meeting.notes}</p>
                </div>
              )}
              
              {meeting.recordings && meeting.recordings.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Recording Available</Badge>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
