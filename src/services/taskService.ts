
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, Priority } from '@/components/tasks/TaskCard';

export type TaskCreate = Omit<Task, 'id'>;
export type TaskUpdate = Partial<Task>;

export async function createTask(task: TaskCreate): Promise<Task> {
  // Convert frontend Task format to database format
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate?.toISOString(),
      workflow_id: task.workflow ? undefined : null // Will need to lookup workflow ID by name
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error);
    throw error;
  }

  // Convert database format back to frontend Task format
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    priority: data.priority as Priority,
    status: data.status as TaskStatus,
    dueDate: data.due_date ? new Date(data.due_date) : new Date(),
    workflow: task.workflow, // We don't get this back from the database directly
    tags: task.tags
  };
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}

export async function updateTask(id: string, updates: TaskUpdate): Promise<Task> {
  // Convert frontend Task format to database format
  const dbUpdates: any = {};
  
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.description) dbUpdates.description = updates.description;
  if (updates.priority) dbUpdates.priority = updates.priority;
  if (updates.status) dbUpdates.status = updates.status;
  if (updates.dueDate) dbUpdates.due_date = updates.dueDate.toISOString();
  
  const { data, error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error);
    throw error;
  }

  // Convert database format back to frontend Task format
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    priority: data.priority as Priority,
    status: data.status as TaskStatus,
    dueDate: data.due_date ? new Date(data.due_date) : new Date(),
    workflow: updates.workflow, // We don't get this back from the database directly
    tags: updates.tags
  };
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      workflows (name)
    `);

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }

  return data.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority as Priority,
    status: task.status as TaskStatus,
    dueDate: task.due_date ? new Date(task.due_date) : new Date(),
    workflow: task.workflows?.name,
    tags: [] // We'll need to fetch tags separately or join in the query
  }));
}
