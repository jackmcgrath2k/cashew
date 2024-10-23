import React, { useState, useEffect } from 'react';
import { supabase } from '/services/supabaseClient';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import FoodIcon from '@mui/icons-material/Fastfood';
import TransportIcon from '@mui/icons-material/Commute';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import EntertainmentIcon from '@mui/icons-material/LocalMovies';
import HealthIcon from '@mui/icons-material/FitnessCenter';
import TravelIcon from '@mui/icons-material/FlightTakeoff';
import EducationIcon from '@mui/icons-material/School';
import MiscIcon from '@mui/icons-material/Category';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function ExpenseList({ onEdit }) { // Accept onEdit prop
  const { budgetId } = useParams(); // Get the budget ID from the URL
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]); // Store expenses
  const [showDeleteButtons, setShowDeleteButtons] = useState(false); // State to toggle delete buttons

  // Create a mapping of tags to icons
  const tagIcons = {
    food: <FoodIcon className='text-green-500' fontSize="small" />,
    transport: <TransportIcon className='text-blue-500' fontSize="small" />,
    utilities: <ElectricBoltIcon className='text-yellow-500' fontSize="small" />,
    entertainment: <EntertainmentIcon className='text-purple-500' fontSize="small" />,
    health: <HealthIcon className='text-teal-500' fontSize="small" />,
    travel: <TravelIcon className='text-pink-500' fontSize="small" />,
    education: <EducationIcon className='text-indigo-500' fontSize="small" />,
    misc: <MiscIcon className='text-gray-500' fontSize="small" />,
  };

  useEffect(() => {
    // Fetch initial expenses
    const fetchExpenses = async () => {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*, profiles(displayname)') // grabs all expenses and who made the expense
        .eq('budget_id', budgetId);

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      // Normalize tags for initial fetched expenses
      const normalizedExpenses = expenses.map(expense => ({
        ...expense,
        tags: Array.isArray(expense.tags) ? expense.tags : (expense.tags ? JSON.parse(expense.tags) : []),
      }));

      setExpenses(normalizedExpenses);
    };

    fetchExpenses();

    // Set up real-time subscription
    const expensesChannel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'expenses',
      },
      (payload) => {
        const newExpense = payload.new;

        // Normalize tags for the new expense
        const normalizedExpense = {
          ...newExpense,
          tags: Array.isArray(newExpense.tags)
            ? newExpense.tags
            : newExpense.tags
            ? JSON.parse(newExpense.tags)
            : [],
        };

        setExpenses((currentExpenses) => [...currentExpenses, normalizedExpense]);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'expenses',
      },
      (payload) => {
        const updatedExpense = payload.new;

        // Normalize tags for the updated expense
        const normalizedUpdatedExpense = {
          ...updatedExpense,
          tags: Array.isArray(updatedExpense.tags)
            ? updatedExpense.tags
            : updatedExpense.tags
            ? JSON.parse(updatedExpense.tags)
            : [],
        };
        setExpenses((currentExpenses) => 
          currentExpenses.map(expense => 
            expense.id === updatedExpense.id ? normalizedUpdatedExpense : expense
          )
        );
      
    
      }
      )
      
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      expensesChannel.unsubscribe(); // Unsubscribe correctly from the channel
    };
  }, [budgetId]);



  const handleDelete = async (id) => {
    // First, optimistically update the state to remove the expense
    setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));

    // Now attempt to delete the expense from Supabase
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting expense:', error);
        // Optionally, revert the optimistic update if deletion fails
        setExpenses((prevExpenses) => [...prevExpenses, { id }]);
    } else {
        console.log('Expense deleted successfully');
    }
  };

  return (
    <div className=''>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='text-5xl pb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-600 to-cyan-500 font-bold text-left'>Expenses</h2>
        <IconButton onClick={() => setShowDeleteButtons(!showDeleteButtons)}>
          <ModeIcon className="text-gray-400 hover:text-gray-500" fontSize="small" />
        </IconButton>
      </div>
      <div className="w-full border-b border-gray-900 opacity-30"></div>
      {expenses.length === 0 ? (
        <p>No expenses found for this budget.</p>
      ) : (
        <ul className='overflow-y-auto max-h-60 pt-8'>
          {expenses.map((expense) => (
            <li key={expense.id} className="mb-4">
              <div className="flex justify-between p-4 border border-gray-300 rounded-lg shadow-md relative">
                <div className="w-2/5 text-left flex flex-col">
                  <h5 className="text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-600 to-cyan-500 font-bold">{expense.description}</h5>
                  <div className='text-sm'>
                    <p className='text-gray-500'>{expense.profiles?.displayname || 'Unknown User'}</p>
                    <p className='text-gray-500'>{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className='flex justify-start mt-2'>
                    {expense.tags?.map((tag) => (
                      <span key={tag} className="flex items-center">
                        {tagIcons[tag]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-1 right-2 flex flex-col items-end tracking-wide">
                <p className='text-5xl font-light'>
  <span className='text-4xl'>€</span>{parseFloat(expense.amount).toFixed(2)}
</p>
                  {/* Show delete button if showDeleteButtons is true */}
                  {showDeleteButtons && (
                    <div>
                      <DeleteIcon 
                        onClick={() => handleDelete(expense.id)} 
                        className='mt-2 text-red-600 hover:text-red-800 cursor-pointer'
                      />
                      <EditNoteIcon
                        onClick={() => onEdit(expense)} // Call the onEdit prop with the expense
                        className='mt-2 text-sky-600 hover:text-sky-800 cursor-pointer'
                      />
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
