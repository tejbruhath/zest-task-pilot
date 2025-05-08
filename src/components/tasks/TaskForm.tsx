
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Task, Priority, TaskStatus } from './TaskCard';
import { getWorkflows } from '@/services/workflowService';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  initialValues?: Partial<Task>;
}

const taskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().default(''),
  dueDate: z.date().optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  workflow: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export const TaskForm = ({ onSubmit, initialValues }: TaskFormProps) => {
  const [workflows, setWorkflows] = useState<{ id: string; name: string }[]>([]);
  
  useEffect(() => {
    async function loadWorkflows() {
      try {
        const workflowData = await getWorkflows();
        setWorkflows(workflowData.map(w => ({ id: w.id, name: w.name })));
      } catch (error) {
        console.error('Error loading workflows:', error);
      }
    }
    
    loadWorkflows();
  }, []);
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      dueDate: initialValues?.dueDate,
      priority: initialValues?.priority || 'medium',
      status: initialValues?.status || 'pending',
      workflow: initialValues?.workflow || undefined,
      tags: initialValues?.tags || [],
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    const newTask: Task = {
      id: initialValues?.id || Math.random().toString(36).substring(2, 11),  // Temporary ID
      title: values.title,   // Required field
      description: values.description || "", // Ensure description is always a string
      dueDate: values.dueDate || new Date(),
      priority: values.priority,
      status: values.status,
      workflow: values.workflow,
      tags: values.tags,
    };
    
    onSubmit(newTask);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="workflow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workflow</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workflows.map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.name}>
                        {workflow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full">
          {initialValues?.id ? 'Update Task' : 'Add Task'}
        </Button>
      </form>
    </Form>
  );
};
