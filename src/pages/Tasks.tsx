
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { Task, TaskStatus, Priority } from '@/components/tasks/TaskCard';
import { Calendar, List as ListIcon, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
