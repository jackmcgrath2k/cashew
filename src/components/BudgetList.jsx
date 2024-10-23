import React, { useState, useEffect } from 'react';
import { supabase } from '/services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteBudget } from '/services/deleteBudget';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

export default function BudgetList({ showEditButtons, onEdit }) {
    const [user, setUser] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [username, setUsername] = useState('');
    const [displayname, setDisplayName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const fetchedUser = session?.user;

            if (fetchedUser) {
                setUser(fetchedUser);

                // Fetch user profile data to get username and displayname
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles') 
                    .select('displayname, username')
                    .eq('id', fetchedUser.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching user profile:', profileError);
                } else {
                    setUsername(profileData.username);
                    setDisplayName(profileData.displayname);
                }

                // Fetch user budgets
                const { data: budgetsData, error: budgetsError } = await supabase
                    .from('budgets')
                    .select('*')
                    .eq('user_id', fetchedUser.id); 

                if (budgetsError) {
                    console.error('Error fetching user budgets:', budgetsError);
                } else {
                    setBudgets(budgetsData);
                }
                const budgetChannel = supabase
                .channel('schema-db-changes')
                .on('postgres_changes', {
                  event: '*', // Listen for all changes (INSERT, UPDATE, DELETE)
                  schema: 'public',
                  table: 'budgets',
                }, (payload) => {
                  console.log('Change received!', payload);
                  // Update budgets based on the event
                  if (payload.eventType === 'INSERT') {
                    // Add new budget
                    setBudgets((currentBudgets) => [...currentBudgets, payload.new]);
                  } else if (payload.eventType === 'UPDATE') {
                    // Update existing budget
                    setBudgets((currentBudgets) =>
                      currentBudgets.map((budget) =>
                        budget.id === payload.new.id ? payload.new : budget
                      )
                    );
                  } else if (payload.eventType === 'DELETE') {
                    // Remove deleted budget
                    setBudgets((currentBudgets) =>
                      currentBudgets.filter((budget) => budget.id !== payload.old.id)
                    );
                  }
                })
                .subscribe();
      
              // Clean up subscription on component unmount
              return () => {
                budgetChannel.unsubscribe();
              };
            

            } else {
                navigate('/signup');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleDelete = async (budgetId) => {
        const { success, error } = await deleteBudget(budgetId);

        if (success) {
            setBudgets((prev) => prev.filter((budget) => budget.id !== budgetId));
        } else {
            alert('Failed to delete budget: ' + error.message);
        }
    };

    const handleEdit = (budget) => {
        onEdit(budget.id, budget); // Call the onEdit function passed from Homepage
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6 p-4 relative">
            {budgets.map((budget) => (
                <div key={budget.id} className="flex flex-col justify-center">
                    {showEditButtons && (
                        <div>
                            <ModeEditIcon onClick={() => handleEdit(budget)} className='text-gray-400 hover:text-blue-500 duration-500 cursor-pointer mb-3 mx-3' />
                            <DeleteIcon onClick={() => handleDelete(budget.id)} className='text-gray-400 hover:text-red-500 duration-500 cursor-pointer mb-3 mx-3' />
                        </div>
                    )}
                    <Link to={`/budget/${budget.id}`} className="block max-w-sm w-full p-6 bg-white border border-gray-400 rounded-lg shadow transition-transform transform hover:scale-105">
                        <h5 className="mb-2 p-2 text-4xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-600 to-cyan-500 font-bold">
                            {budget.title || "Budget title"}
                        </h5>
                        <div className="w-full border-b border-gray-900 opacity-30"></div>
                        <p className="text-sm font-light text-gray-400 pb-10">By {username}</p>
                        <p className="text-xl font-bold text-gray-300 dark:text-blue-400 overflow-hidden">
                            €<span className='text-5xl'>{budget.total_amount || "0"}</span><span className='font-light'>/ {budget.frequency || "Month"}</span>
                        </p>
                    </Link>
                </div>
            ))}
        </div>
    );
}
