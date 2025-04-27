
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Task, TaskStatus } from '@/components/tasks/TaskCard';
import { Plus, TrendingUp, Calendar, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the Q2 marketing project proposal',
    dueDate: new Date('2025-05-15'),
    priority: 'high',
    status: 'pending',
    workflow: 'Productivity',
    tags: ['work', 'marketing'],
  },
  {
    id: '2',
    title: 'Weekly team meeting',
    dueDate: new Date('2025-05-01'),
    priority: 'medium',
    status: 'pending',
    workflow: 'Productivity',
    tags: ['meeting', 'work'],
  },
  {
    id: '3',
    title: 'Gym session',
    description: 'Upper body workout',
    dueDate: new Date('2025-04-28'),
    priority: 'low',
    status: 'pending',
    workflow: 'Fitness',
    tags: ['health', 'personal'],
  },
];

const Dashboard = () => {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks);
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
  
  // Calculate task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const todaysTasks = tasks.filter(t => {
    const today = new Date();
    const taskDate = new Date(t.dueDate);
    return taskDate.toDateString() === today.toDateString();
  }).length;
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
  
  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setIsTaskFormOpen(false);
    toast.success('Task created successfully!');
  };
  
  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
    
    toast.success(`Task ${status === 'completed' ? 'completed' : 'updated'}!`);
  };
  
  const handleEditTask = (id: string) => {
    toast('Edit task functionality will be implemented in the next version');
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a new task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleAddTask} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} completed
            </p>
            <Progress value={completionRate} className="h-2 mt-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{todaysTasks}</div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{highPriorityTasks}</div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
      
      {/* Tasks Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Your tasks for today</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList
              tasks={tasks.filter(t => {
                const today = new Date();
                const taskDate = new Date(t.dueDate);
                return taskDate.toDateString() === today.toDateString();
              })}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
            <CardDescription>Smart recommendations for your day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm">
                <span className="font-semibold">Prioritize:</span> You have 2 high priority tasks due this week
              </p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Reminder:</span> Schedule a break after your team meeting
              </p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Productivity Tip:</span> Your most productive hours are between 9am - 11am
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>Tasks due in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={tasks.filter(t => {
              const today = new Date();
              const nextWeek = new Date();
              nextWeek.setDate(today.getDate() + 7);
              const taskDate = new Date(t.dueDate);
              return taskDate > today && taskDate <= nextWeek;
            })}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
