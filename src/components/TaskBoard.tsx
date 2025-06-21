
import React, { useState } from 'react';
import { Plus, Calendar, User, CheckCircle, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeEmail: string;
  dueDate: string;
  dueTime: string;
  status: 'todo' | 'inprogress' | 'done';
  points: number;
}

interface TaskBoardProps {
  onPointsEarned: (points: number) => void;
  user: any;
  workspace: any;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ onPointsEarned, user, workspace }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design new landing page',
      description: 'Create mockups for the new product landing page',
      assignee: 'Sarah Chen',
      assigneeEmail: 'sarah@company.com',
      dueDate: '2024-12-25',
      dueTime: '14:00',
      status: 'inprogress',
      points: 50
    },
    {
      id: '2',
      title: 'Implement user authentication',
      description: 'Set up login and registration functionality',
      assignee: 'Mike Johnson',
      assigneeEmail: 'mike@company.com',
      dueDate: '2024-12-22',
      dueTime: '16:30',
      status: 'todo',
      points: 75
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all endpoints for the REST API',
      assignee: 'Alex Rodriguez',
      assigneeEmail: 'alex@company.com',
      dueDate: '2024-12-20',
      dueTime: '10:00',
      status: 'done',
      points: 40
    }
  ]);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    assigneeEmail: '',
    dueDate: '',
    dueTime: '',
    points: 25
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-red-100 border-red-200' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-yellow-100 border-yellow-200' },
    { id: 'done', title: 'Done', color: 'bg-green-100 border-green-200' }
  ];

  const moveTask = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'done' && task.status !== 'done') {
          onPointsEarned(task.points);
          toast({
            title: "Task Completed! 🎉",
            description: `You earned ${task.points} points for completing "${task.title}"`,
          });
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const sendTaskEmail = (task: Task) => {
    // Mock email sending - in real app this would call your backend
    console.log('Sending task email to:', task.assigneeEmail);
    console.log('Task details:', {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      workspace: workspace.name
    });
    
    toast({
      title: "Email Sent! 📧",
      description: `Task notification sent to ${task.assigneeEmail}`,
    });
  };

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      assigneeEmail: newTask.assigneeEmail,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      status: 'todo',
      points: newTask.points
    };
    
    setTasks(prev => [...prev, task]);
    
    // Send email if assignee email is provided
    if (newTask.assigneeEmail) {
      sendTaskEmail(task);
    }
    
    setNewTask({ 
      title: '', 
      description: '', 
      assignee: '', 
      assigneeEmail: '', 
      dueDate: '', 
      dueTime: '', 
      points: 25 
    });
    setShowNewTaskForm(false);
    
    toast({
      title: "Task Created!",
      description: "New task has been added to the board",
    });
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Task Board</h2>
        <Button 
          onClick={() => setShowNewTaskForm(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Plus size={20} className="mr-2" />
          Add Task
        </Button>
      </div>

      {showNewTaskForm && (
        <Card className="mb-6 border-purple-200">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder="Task title *"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md h-20"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Assignee name"
                value={newTask.assignee}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                placeholder="Assignee email (for notifications)"
                value={newTask.assigneeEmail}
                onChange={(e) => setNewTask(prev => ({ ...prev, assigneeEmail: e.target.value }))}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="time"
                value={newTask.dueTime}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueTime: e.target.value }))}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Points: {newTask.points}</label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={newTask.points}
                onChange={(e) => setNewTask(prev => ({ ...prev, points: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addTask}>Create Task</Button>
              <Button variant="outline" onClick={() => setShowNewTaskForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map(column => (
          <div key={column.id} className="space-y-4">
            <div className={`rounded-lg p-4 ${column.color}`}>
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className="text-sm text-gray-600">
                {tasks.filter(task => task.status === column.id).length} tasks
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <Card key={task.id} className="border-l-4 border-l-purple-400 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">{task.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User size={14} />
                          {task.assignee}
                        </div>
                        {task.assigneeEmail && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail size={14} />
                            {task.assigneeEmail}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        {task.dueTime && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={14} />
                            {task.dueTime}
                          </div>
                        )}
                        <Badge variant="secondary">{task.points} points</Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        {task.status !== 'todo' && (
                          <button
                            onClick={() => moveTask(task.id, 'todo')}
                            className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            To Do
                          </button>
                        )}
                        {task.status !== 'inprogress' && (
                          <button
                            onClick={() => moveTask(task.id, 'inprogress')}
                            className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200"
                          >
                            In Progress
                          </button>
                        )}
                        {task.status !== 'done' && (
                          <button
                            onClick={() => moveTask(task.id, 'done')}
                            className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded flex items-center gap-1 hover:bg-green-200"
                          >
                            <CheckCircle size={12} />
                            Done
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
