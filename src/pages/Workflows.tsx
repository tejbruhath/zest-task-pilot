
import React, { useState, useEffect } from 'react';
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
import { Plus, TrendingUp, Dumbbell, ShoppingCart, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { createTask, getTasks, updateTaskStatus, deleteTask, updateTask } from '@/services/taskService';
import { getWorkflows, createWorkflow } from '@/services/workflowService';

type WorkflowType = 'Productivity' | 'Fitness' | 'Grocery' | 'Personal';

const workflowIcons = {
  Productivity: <TrendingUp className="h-5 w-5" />,
  Fitness: <Dumbbell className="h-5 w-5" />,
  Grocery: <ShoppingCart className="h-5 w-5" />,
  Personal: <User className="h-5 w-5" />,
};

const Workflows = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType>('Productivity');
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Load tasks and workflows from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load workflows
        const workflowData = await getWorkflows();
        setWorkflows(workflowData);
        
        // If we have workflows, set the selected one to the first one
        if (workflowData.length > 0) {
          setSelectedWorkflow(workflowData[0].name as WorkflowType);
        }
        
        // Load tasks
        const taskData = await getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter tasks based on selected workflow
  const workflowTasks = tasks.filter(task => task.workflow === selectedWorkflow);
  
  // Task operations
  const handleAddTask = async (newTask: Task) => {
    try {
      // Force the workflow to be the currently selected one
      const taskWithWorkflow = {
        ...newTask,
        workflow: selectedWorkflow,
      };
      
      const createdTask = await createTask(taskWithWorkflow);
      setTasks([...tasks, createdTask]);
      setIsTaskFormOpen(false);
      toast.success(`Task "${newTask.title}" created successfully!`);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };
  
  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(id, status);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status } : task
      ));
      
      toast.success(`Task ${status === 'completed' ? 'completed' : 'updated'}!`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };
  
  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsTaskFormOpen(true);
    }
  };
  
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      // Ensure workflow is maintained
      const taskToUpdate = {
        ...updatedTask,
        workflow: selectedWorkflow,
      };
      
      const result = await updateTask(taskToUpdate.id, taskToUpdate);
      setTasks(tasks.map(task => task.id === updatedTask.id ? result : task));
      setIsTaskFormOpen(false);
      setEditingTask(null);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };
  
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };
  
  const handleInvite = () => {
    // In a real application, you would send an invitation email
    if (!emailInput || !emailInput.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    toast.success(`Invitation sent to ${emailInput}`);
    setEmailInput('');
    setIsInviteModalOpen(false);
  };

  const handleFormSubmit = (task: Task) => {
    if (editingTask) {
      handleUpdateTask(task);
    } else {
      handleAddTask(task);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <div className="flex gap-2">
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail size={16} />
                <span>Invite Team Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="colleague@example.com" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
                <Button onClick={handleInvite} className="w-full">Send Invitation</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isTaskFormOpen} onOpenChange={(open) => {
            if (!open) setEditingTask(null);
            setIsTaskFormOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add Task</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? 'Edit task in ' : 'Create a new task in '}{selectedWorkflow}
                </DialogTitle>
              </DialogHeader>
              <TaskForm 
                onSubmit={handleFormSubmit} 
                initialValues={editingTask || { workflow: selectedWorkflow }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">Loading workflows...</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Workflows;
