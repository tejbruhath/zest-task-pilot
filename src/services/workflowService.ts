
import { supabase } from "@/integrations/supabase/client";

export async function getWorkflows() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }

  return data || [];
}

export async function createWorkflow(name: string, description: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("workflows")
    .insert({
      name,
      description,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating workflow:", error);
    throw error;
  }

  return data;
}
