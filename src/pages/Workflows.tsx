
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Task, TaskStatus } from '@/components/tasks/TaskCard';
import { Plus, TrendingUp, Dumbbell, ShoppingCart, User } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for tasks
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
  {
    id: '4',
    title: 'Buy groceries',
    description: 'Get items for the week',
    dueDate: new Date('2025-04-30'),
    priority: 'medium',
    status: 'pending',
    workflow: 'Grocery',
    tags: ['shopping', 'personal'],
  },
  {
    id: '5',
    title: 'Call mom',
    dueDate: new Date('2025-04-29'),
    priority: 'medium',
    status: 'completed',
    workflow: 'Personal',
    tags: ['family'],
  },
];

type WorkflowType = 'Productivity' | 'Fitness' | 'Grocery' | 'Personal';

const workflowIcons = {
  Productivity: <TrendingUp className="h-5 w-5" />,
  Fitness: <Dumbbell className="h-5 w-5" />,
  Grocery: <ShoppingCart className="h-5 w-5" />,
  Personal: <User className="h-5 w-5" />,
};

const Workflows = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType>('Productivity');
  
  // Filter tasks based on selected workflow
  const workflowTasks = tasks.filter(task => task.workflow === selectedWorkflow);
  
  // Task operations
  const handleAddTask = (newTask: Task) => {
    // Force the workflow to be the currently selected one
    const taskWithWorkflow = {
      ...newTask,
      workflow: selectedWorkflow,
    };
    
    setTasks([...tasks, taskWithWorkflow]);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a new task in {selectedWorkflow}</DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSubmit={handleAddTask} 
              initialValues={{ workflow: selectedWorkflow }}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['Productivity', 'Fitness', 'Grocery', 'Personal'] as WorkflowType[]).map((workflow) => {
          const workflowCount = tasks.filter(t => t.workflow === workflow).length;
          const workflowCompleted = tasks.filter(t => t.workflow === workflow && t.status === 'completed').length;
          const completionPercentage = workflowCount > 0 ? Math.round((workflowCompleted / workflowCount) * 100) : 0;
          
          return (
            <Card 
              key={workflow} 
              className={`cursor-pointer hover:border-primary transition-colors ${selectedWorkflow === workflow ? 'border-primary' : ''}`}
              onClick={() => setSelectedWorkflow(workflow)}
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`p-3 rounded-full workflow-tab ${workflow.toLowerCase()}`}>
                  {workflowIcons[workflow]}
                </div>
                <div>
                  <h3 className="font-medium">{workflow}</h3>
                  <p className="text-sm text-muted-foreground">
                    {workflowCount} tasks ({completionPercentage}% done)
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full workflow-tab ${selectedWorkflow.toLowerCase()}`}>
              {workflowIcons[selectedWorkflow]}
            </div>
            {selectedWorkflow} Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <TaskList 
                tasks={workflowTasks} 
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <TaskList 
                tasks={workflowTasks.filter(task => task.status !== 'completed')}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <TaskList 
                tasks={workflowTasks.filter(task => task.status === 'completed')}
                onStatusChange={handleStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Workflows;
