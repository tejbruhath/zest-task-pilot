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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Task, TaskStatus, Priority } from '@/components/tasks/TaskCard';
import { Calendar, List as ListIcon, Plus, Search, Filter, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createTask, getTasks, updateTaskStatus, deleteTask, updateTask } from '@/services/taskService';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Load tasks from database
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const loadedTasks = await getTasks();
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);
  
  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });
  
  // Task operations
  const handleAddTask = async (newTask: Task) => {
    try {
      const createdTask = await createTask(newTask);
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
      const result = await updateTask(updatedTask.id, updatedTask);
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

  const handleFormSubmit = (task: Task) => {
    if (editingTask) {
      handleUpdateTask(task);
    } else {
      handleAddTask(task);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
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
                <DialogTitle>{editingTask ? 'Edit task' : 'Create a new task'}</DialogTitle>
              </DialogHeader>
              <TaskForm 
                onSubmit={handleFormSubmit}
                initialValues={editingTask || undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Priority</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPriorityFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* View Mode Toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <ListIcon size={16} />
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('calendar')}
              className="rounded-none"
            >
              <Calendar size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Task Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Tasks'}
            {priorityFilter !== 'all' && ` - ${priorityFilter} priority`}
            {statusFilter !== 'all' && ` - ${statusFilter} status`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Loading tasks...</div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {viewMode === 'list' ? (
                  filteredTasks.length > 0 ? (
                    <TaskList 
                      tasks={filteredTasks} 
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No tasks found with the current filters.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Calendar view coming soon!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="today">
                {viewMode === 'list' ? (
                  <TaskList 
                    tasks={filteredTasks.filter(task => {
                      const today = new Date();
                      const taskDate = new Date(task.dueDate);
                      return taskDate.toDateString() === today.toDateString();
                    })} 
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Calendar view coming soon!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="week">
                {viewMode === 'list' ? (
                  <TaskList 
                    tasks={filteredTasks.filter(task => {
                      const today = new Date();
                      const endOfWeek = new Date();
                      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
                      const taskDate = new Date(task.dueDate);
                      return taskDate >= today && taskDate <= endOfWeek;
                    })} 
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Calendar view coming soon!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="month">
                {viewMode === 'list' ? (
                  <TaskList 
                    tasks={filteredTasks.filter(task => {
                      const today = new Date();
                      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                      const taskDate = new Date(task.dueDate);
                      return taskDate >= today && taskDate <= endOfMonth;
                    })} 
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Calendar view coming soon!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
