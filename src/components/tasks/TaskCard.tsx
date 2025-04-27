
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Menu, Loader2 } from 'lucide-react';
import { updateTaskStatus } from '@/services/taskService';
import { toast } from 'sonner';

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  status: TaskStatus;
  tags?: string[];
  workflow?: string;
};

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const TaskCard = ({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) => {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const isCompleted = task.status === 'completed';
  
  const priorityClasses = {
    high: 'high-priority',
    medium: 'medium-priority',
    low: 'low-priority'
  };
  
  const priorityText = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };
  
  const priorityColors = {
    high: 'bg-task-high text-white',
    medium: 'bg-task-medium text-white',
    low: 'bg-task-low text-white'
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleStatusChange = async (checked: boolean) => {
    try {
      setIsUpdating(true);
      const newStatus = checked ? 'completed' : 'pending';
      
      // Update in DB
      await updateTaskStatus(task.id, newStatus as TaskStatus);
      
      // Then update UI
      onStatusChange(task.id, newStatus as TaskStatus);
      
      toast.success(`Task ${checked ? 'completed' : 'marked as pending'}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={cn(
      'task-card',
      priorityClasses[task.priority],
      isCompleted && 'completed'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={handleStatusChange}
            disabled={isUpdating}
          />
          <div>
            <h3 className={cn(
              "font-medium text-lg mb-1",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {isUpdating ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {task.title}
                </span>
              ) : (
                task.title
              )}
            </h3>
            {task.description && (
              <p className="text-muted-foreground text-sm mb-2">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(task.dueDate)}
              </Badge>
              
              <Badge className={cn("flex items-center gap-1", priorityColors[task.priority])}>
                <Clock size={14} />
                {priorityText[task.priority]}
              </Badge>
              
              {task.workflow && (
                <Badge variant="secondary">{task.workflow}</Badge>
              )}
              
              {task.tags?.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task.id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
