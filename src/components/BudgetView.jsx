import React, { useState, useEffect } from 'react';
import { supabase } from '/services/supabaseClient';
import { useParams } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import TagsInput from './TagsInput';
import EuroIcon from '@mui/icons-material/Euro';
import TitleIcon from '@mui/icons-material/Title';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';


export default function BudgetView() {
    const [user, setUser] = useState(null);
    const [budget, setBudget] = useState(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { budgetId } = useParams();
    const [isNewExpenseSelected, setIsNewExpenseSelected] = useState(false);
    const [amount, setAmount] = useState(''); // Keep this as a string for user input
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState(null);
    const [editingExpenseId, setEditingExpenseId] = useState(null); // Track which expense is being edited
    const predefinedTags = ['food', 'transport', 'utilities', 'entertainment', 'health', 'travel', 'education', 'misc'];
    const [expenses, setExpenses] = useState([]); // Declare state for expenses
    const [totalExpenses, setTotalExpenses] = useState(0); // State to store total expenses
  
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;
    
            const fetchedUser = session?.user;
            if (fetchedUser) {
                setUser(fetchedUser);
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('displayname, username')
                    .eq('id', fetchedUser.id)
                    .single();
    
                if (profileError) throw profileError;
    
                setUsername(profileData.username);
    
                // Fetch the budget using the ID from the URL
                const { data, error: budgetError } = await supabase
                    .from('budgets')
                    .select('*')
                    .eq('id', budgetId)
                    .single();
    
                
                
                if (budgetError) {
                    setError('Error fetching budget data.');
                    console.error(budgetError);
                } else {
                    setBudget(data);
                }
            }
        };
    
        fetchUserData();
    }, [budgetId]);
    

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const { data: expenses, error } = await supabase
                    .from('expenses')
                    .select('*, profiles(displayname)')
                    .eq('budget_id', budgetId);
    
                if (error) {
                    console.error('Error fetching expenses:', error);
                    setError('Error fetching expenses.');
                    return;
                }
    
                const normalizedExpenses = expenses.map((expense) => ({
                    ...expense,
                    tags: Array.isArray(expense.tags) ? expense.tags : (expense.tags ? JSON.parse(expense.tags) : []),
                }));
    
                setExpenses(normalizedExpenses);
                calculateTotals(normalizedExpenses);
            } catch (err) {
                console.error(err);
                setError('An unexpected error occurred while fetching expenses.');
            }
        };
    
        fetchExpenses();
        
}, []);
    
          // Function to calculate total and average expenses
          const calculateTotals = (expenses) => {
            const total = expenses.reduce((acc, expense) => acc + expense.amount, 0); // Sum of all expense amounts
            
        
            setTotalExpenses(total); // Set total in state
    

      };

      if (error) return <p>{error}</p>;
      if (!budget) return <p>Loading...</p>;

    const handleNewExpenseClick = () => {
        setIsNewExpenseSelected(prev => !prev);
        // Reset fields when creating a new expense
        setAmount(''); // Keep amount as string for user input
        setDescription('');
        setTags([]);
        setEditingExpenseId(null); // Reset editing state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in to create an expense.');
            return;
        }

        // Validate required fields
        if (!amount || !description || !budgetId) {
            setError('Amount, description, and budget must be provided.');
            setSuccess(null);
            return;
        }

        // Ensure amount is a valid number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            setError('Amount must be a valid number.');
            setSuccess(null);
            return;
        }

        // Check if we are editing or creating a new expense
        const operation = editingExpenseId
            ? supabase.from('expenses').update({
                user_id: user.id,
                amount: parsedAmount, // Send the number for the DB
                description,
                date: new Date().toISOString(),
                budget_id: budgetId,
                tags,
            }).eq('id', editingExpenseId)
            : supabase.from('expenses').insert([{
                user_id: user.id,
                amount: parsedAmount, // Send the number for the DB
                description,
                date: new Date().toISOString(),
                budget_id: budgetId,
                tags,
            }]);

        const { error } = await operation;

        if (error) {
            setError(error.message);
            setSuccess(null);
        } else {
            setSuccess(editingExpenseId ? 'Expense updated successfully!' : 'Expense created successfully!');
            setError(null);
            setAmount(''); // Reset input
            setDescription('');
            setTags([]);
            setIsNewExpenseSelected(false);
            setEditingExpenseId(null); // Reset editing state
        }
    };

    const handleEditExpense = (expense) => {
        setAmount(expense.amount.toFixed(2)); // Format for editing, keep two decimal places
        setDescription(expense.description);
        setTags(expense.tags || []);
        setEditingExpenseId(expense.id); // Set the ID of the expense being edited
        setIsNewExpenseSelected(true); // Show the form
    };

    // Format amount to two decimal places for display
    const formatAmount = (amount) => {
        return parseFloat(amount).toFixed(2);
    };



      




    return (
        <div className="flex justify-center text-center mt-10">
            
            <div className="block max-w-sm w-full p-6 bg-white border border-gray-400 rounded-lg relative" style={{ minHeight: '350px' }}>
                <Link to="/">
            <CloseIcon className='absolute top-2 right-5 text-gray-400 hover:text-gray-500 cursor-pointer' />
            </Link>
                <h5 className="mb-2 p-5 text-6xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-600 to-cyan-500 font-bold">
                    {budget.title || "Budget title"}
                </h5>
                <div className="w-full border-b border-gray-900 opacity-30"></div>
                <p className="text-sm font-light text-gray-400 pb-10">By {username}</p>
                <p className="text-xl font-bold text-gray-300 dark:text-blue-400 overflow-hidden">
                    €<span className='text-4xl'>{totalExpenses.toFixed(2)} / {formatAmount(budget.total_amount || 0)}</span>
                </p>
                <div><span className='font-light text-blue-400'>/ {budget.frequency || "Month"}</span></div>
                
                {/* New Expense Button */}
                <button 
                    onClick={handleNewExpenseClick} 
                    className="mt-10 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-3 py-1"
                >
                    New Expense +
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {/* Conditional rendering of the Expense Form */}
                {isNewExpenseSelected && (
                    <form onSubmit={handleSubmit}>
                        <div className='pt-5'>
                            <div className='text-left text-blue-500'>
                                <label htmlFor="add-title" className='font-semibold'>New Expense</label>
                                <div className="w-full border-b border-gray-900 opacity-30"></div>
                                <div>
                                    <div className="flex pb-3 pt-2">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gradient-to-r from-blue-400 via-sky-500 to-cyan-500 border border-e-0 border-gray-300 rounded-s-md">
                                            <TitleIcon className='text-white' fontSize="medium" />
                                        </span>
                                        <input
                                            type="text"
                                            className="rounded-none rounded-e-lg focus:outline-none border text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-200 border-gray-300 placeholder-gray-400"
                                            placeholder="Expense Title"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='text-left text-blue-500'>
                                <label htmlFor="add-amount" className='font-semibold'>Amount</label>
                                <div className="w-full border-b border-gray-900 opacity-30"></div>
                                <div>
                                    <div className="flex pb-3 pt-2">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gradient-to-r from-blue-400 via-sky-500 to-cyan-500 border border-e-0 border-gray-300 rounded-s-md">
                                            <EuroIcon className='text-white' fontSize="medium" />
                                        </span>
                                        <input
                                            type="text" // Use text to allow for correct decimal entry
                                            pattern="\d+(\.\d{0,2})?" // Limit to two decimal places
                                            className="rounded-none rounded-e-lg focus:outline-none border text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-200 border-gray-300 placeholder-gray-400"
                                            placeholder="€0.00"
                                            value={amount}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (/^\d*\.?\d{0,2}$/.test(newValue)) { // Validate format
                                                    setAmount(newValue);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <label htmlFor="add-guests" className='font-semibold'>Tags</label>
                            <div className="w-full border-b border-gray-900 opacity-30"></div>
                            <TagsInput predefinedTags={predefinedTags} setTags={setTags} tags={tags} /> 
                            
                            <div className='mt-10'>
                                <button type="submit" className="text-white bg-blue-500 focus:outline-none font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2">
                                    {editingExpenseId ? 'Update' : 'Add'} +
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                <div className='mt-20'>
                    <ExpenseList budgetId={budgetId} onEdit={handleEditExpense} />
                </div>
            </div>
        </div>
    );
}
