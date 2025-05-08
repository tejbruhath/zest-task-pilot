
import { supabase } from "@/integrations/supabase/client";
import { Task, TaskStatus, Priority } from "@/components/tasks/TaskCard";

export type TaskCreate = Omit<Task, "id">;
export type TaskUpdate = Partial<Task>;

export async function createTask(task: TaskCreate): Promise<Task> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Convert frontend Task format to database format
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate?.toISOString(),
      workflow_id: task.workflow ? undefined : null, // Will need to lookup workflow ID by name
      user_id: user.id,
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
    description: data.description || "",
    priority: data.priority as Priority,
    status: data.status as TaskStatus,
    dueDate: data.due_date ? new Date(data.due_date) : new Date(),
    workflow: task.workflow, // We don't get this back from the database directly
    tags: task.tags || [],
  };
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}

export async function updateTask(
  id: string,
  updates: TaskUpdate
): Promise<Task> {
  // Convert frontend Task format to database format
  const dbUpdates: any = {};

  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate.toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .update(dbUpdates)
    .eq("id", id)
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
    description: data.description || "",
    priority: data.priority as Priority,
    status: data.status as TaskStatus,
    dueDate: data.due_date ? new Date(data.due_date) : new Date(),
    workflow: updates.workflow, // We don't get this back from the database directly
    tags: updates.tags || [],
  };
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from("tasks").select(`
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
    description: task.description || "",
    priority: task.priority as Priority,
    status: task.status as TaskStatus,
    dueDate: task.due_date ? new Date(task.due_date) : new Date(),
    workflow: task.workflows?.name,
    tags: [], // We'll need to fetch tags separately or join in the query
  }));
}

// New function to add mock tasks for the current user
export async function addMockTasks(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Common everyday mock tasks
  const mockTasks = [
    {
      title: 'Prepare for Math Test',
      description: 'Review algebra, calculus and statistics. Complete practice questions.',
      priority: 'high' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),  // 3 days from now
      user_id: user.id
    },
    {
      title: 'Get Groceries',
      description: 'Milk, eggs, bread, vegetables, fruits, and snacks for the week.',
      priority: 'medium' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),  // 1 day from now
      user_id: user.id
    },
    {
      title: 'Hit the Gym',
      description: 'Leg day - 30 min cardio, squats, lunges, and leg press.',
      priority: 'medium' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),  // 1 day from now
      user_id: user.id
    },
    {
      title: 'Read Research Papers',
      description: 'Complete reading the assigned papers for the literature review.',
      priority: 'high' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),  // 5 days from now
      user_id: user.id
    },
    {
      title: 'Clean Apartment',
      description: 'Vacuum, dust, laundry, and organize desk.',
      priority: 'low' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),  // 2 days from now
      user_id: user.id
    },
    {
      title: 'Pay Bills',
      description: 'Rent, utilities, phone, and internet bills.',
      priority: 'high' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),  // 7 days from now
      user_id: user.id
    },
    {
      title: 'Call Parents',
      description: 'Weekly catch-up call with family.',
      priority: 'medium' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),  // 2 days from now
      user_id: user.id
    },
    {
      title: 'Finish Project Report',
      description: 'Complete the final draft and send for review.',
      priority: 'high' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),  // 4 days from now
      user_id: user.id
    },
    {
      title: 'Meal Prep',
      description: 'Prepare lunches and dinners for the workweek.',
      priority: 'medium' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),  // 1 day from now
      user_id: user.id
    },
    {
      title: 'Submit Assignment',
      description: 'Final check and submit the assignment online.',
      priority: 'high' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),  // 2 days from now
      user_id: user.id
    },
    {
      title: 'Morning Meditation',
      description: 'Practice 15 minutes of mindfulness meditation.',
      priority: 'low' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),  // 1 day from now
      user_id: user.id
    },
    {
      title: 'Update Resume',
      description: 'Add recent projects and update skills section.',
      priority: 'medium' as Priority,
      status: 'pending' as TaskStatus,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),  // 5 days from now
      user_id: user.id
    }
  ];

  // Insert all mock tasks
  const { error } = await supabase.from("tasks").insert(mockTasks);

  if (error) {
    console.error("Error adding mock tasks:", error);
    throw error;
  }
}
