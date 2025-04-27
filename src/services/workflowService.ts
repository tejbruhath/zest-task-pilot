
import { supabase } from '@/integrations/supabase/client';

export type Workflow = {
  id: string;
  name: string;
  description?: string;
  taskCount?: number;
  completionPercentage?: number;
};

export type WorkflowCreate = Omit<Workflow, 'id' | 'taskCount' | 'completionPercentage'>;
export type WorkflowUpdate = Partial<WorkflowCreate>;

export async function createWorkflow(workflow: WorkflowCreate): Promise<Workflow> {
  const { data, error } = await supabase
    .from('workflows')
    .insert({
      name: workflow.name,
      description: workflow.description
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    taskCount: 0,
    completionPercentage: 0
  };
}

export async function getWorkflows(): Promise<Workflow[]> {
  const { data, error } = await supabase
    .from('workflows')
    .select();

  if (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }

  const workflowsWithTasks = await Promise.all(data.map(async (workflow) => {
    // Get tasks for this workflow
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('status')
      .eq('workflow_id', workflow.id);

    if (tasksError) {
      console.error("Error fetching tasks for workflow:", tasksError);
      return {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        taskCount: 0,
        completionPercentage: 0
      };
    }

    const taskCount = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const completionPercentage = taskCount > 0 
      ? Math.round((completedCount / taskCount) * 100) 
      : 0;

    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      taskCount,
      completionPercentage
    };
  }));

  return workflowsWithTasks;
}

export async function updateWorkflow(id: string, updates: WorkflowUpdate): Promise<Workflow> {
  const { data, error } = await supabase
    .from('workflows')
    .update({
      name: updates.name,
      description: updates.description
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description
  };
}

export async function deleteWorkflow(id: string): Promise<void> {
  const { error } = await supabase
    .from('workflows')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting workflow:", error);
    throw error;
  }
}
