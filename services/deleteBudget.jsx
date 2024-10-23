import { supabase } from './supabaseClient';

export async function deleteBudget(budgetId) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId);

  if (error) {
    console.error('Error deleting budget:', error);
    return { success: false, error };
  }

  return { success: true };
};

export async function editBudget(budgetId) {
  const { error } = await supabase
    .from('budgets')
    .update()
    .eq('id', budgetId);

  if (error) {
    console.error('Error updating budget:', error);
    return { success: false, error };
  }

  return { success: true };
};
