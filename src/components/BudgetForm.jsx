import React, { useState, useEffect } from 'react';
import { supabase } from '/services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import SearchUser from './SearchUser';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const BudgetForm = ({ budgetId, closeModal, budgetData }) => {
  const [totalAmount, setTotalAmount] = useState(''); // Spending limit
  const [title, setTitle] = useState('Edit Title'); // Budget title
  const [frequency, setFrequency] = useState('Month'); // Default to Month
  const [type, setType] = useState('Personal'); // Budget type - personal or group?
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isGroupSelected, setIsGroupSelected] = useState(false); // Tie it to type
  const [selected, setSelected] = useState('Month'); // Tie it to frequency
  const [isEditingAmount, setIsEditingAmount] = useState(false); // State for title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false); // State for title editing
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user session and details
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const fetchedUser = session?.user; // Get the user from the session
      setUser(fetchedUser); // Set the user state

      // Check if user is available
      if (fetchedUser) {
        // Fetch user profile data from your profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('displayname, username')
          .eq('id', fetchedUser.id) // Use fetchedUser.id to get profile data
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setDisplayName(data.displayname);
          setUsername(data.username);
        }
      } else {
        // Redirect to signup or another page if user is not logged in
        navigate('/signup');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      if (budgetId) {
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('id', budgetId)
          .single();

        if (error) {
          console.error('Error fetching budget details:', error);
          return;
        }

        setTotalAmount(data.total_amount);
        setTitle(data.title);
        setFrequency(data.frequency);
        setType(data.budget_type);
        setIsGroupSelected(data.budget_type === 'group');
        setSelected(data.frequency);
      }
    };

    fetchBudgetDetails();
  }, [budgetId]);

  const handlePersonalClick = () => {
    setIsGroupSelected(false);
    setType('personal'); // Set budget type to 'Group'
  };

  const handleGroupClick = () => {
    setIsGroupSelected(true);
    setType('group'); // Set budget type to 'Group'
  };

  const handleToggle = (value) => {
    setSelected(value);
    setFrequency(value); // Update frequency based on selection
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError('You must be logged in to create a budget.');
      return;
    }
  
    const budgetData = {
      user_id: user.id, // Use the user's ID
      total_amount: totalAmount,
      title: title,
      budget_type: type,
      frequency: frequency,
    };
  
    let operation;
    if (budgetId) {
      // Update existing budget
      const { error } = await supabase
        .from('budgets')
        .update(budgetData)
        .eq('id', budgetId);
      
      if (error) {
        setError(error.message);
        setSuccess(null);
        return;
      }
      setSuccess('Budget updated successfully!');
    } else {
      // Create a new budget entry
      const { data, error } = await supabase
        .from('budgets')
        .insert([budgetData]);
  
      if (error) {
        setError(error.message);
        setSuccess(null);
        return;
      }
      setSuccess('Budget created successfully!');
    }
  
    // Reset form fields
    setTotalAmount('');
    setTitle('Edit Title'); // Reset to default title
    closeModal(); // Close the modal after successful operation
  };
  

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTitle('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() === '') {
      setTitle('Edit Title'); // Reset if the title is empty
    }
  };


  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
        <div className="w-full max-w-sm p-4 bg-white border border-gray-300 rounded-lg shadow sm:p-8">
          <h5 className="mb-4 text-5xl font-bold text-blue-500 cursor-pointer hover:text-gray-300 duration-500">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                required
                className="border-b border-gray-300 outline-none"
                autoFocus
                style={{ width: 'auto', maxWidth: '100%', fontSize: 'inherit' }} // Ensure it doesn't expand excessively
              />
            ) : (
              <span onClick={handleTitleClick}>{title}</span>
            )}
          </h5>
          
            <div className="w-full border-b border-gray-900 opacity-30"></div>
            <p className="text-sm font-light text-gray-400 pb-10">By <span>{displayName}</span> (<span>{username}</span>)</p>
            <div className="flex items-baseline text-gray-900 mb-5">
              <span className="text-3xl font-semibold">€</span>
              {isEditingAmount ? (
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                onBlur={() => setIsEditingAmount(false)} // Exit edit mode on blur
                autoFocus // Automatically focus the input when in edit mode
                required
                className="text-5xl font-bold tracking-tight w-20 text-gray-900 border-b border-gray-300 outline-none"
/>
            ) : (
              <span
                onClick={() => setIsEditingAmount(true)} // Enter edit mode on click
                className="text-5xl font-bold tracking-tight cursor-pointer"
              >
                {totalAmount || 0}
              </span>
            )}
            <span className="ms-1 text-xl font-normal text-gray-500">/{frequency.toLowerCase()}</span>
          </div>
          <div className="w-full border-b border-gray-900 opacity-30"></div>

          <div className='flex flex-row mb-10 mt-5'>
            {['Day', 'Week', 'Month'].map((option) => (
              <button
                key={option}
                type="button"
                className={`${
                  selected === option ? 'bg-blue-500 duration-500' : 'bg-gray-300 '
                } text-white  font-medium rounded-lg text-xs px-2 py-1 text-center me-2 mb-5`}
                onClick={() => handleToggle(option)}
              >
                {option}
              </button>
            ))}
          </div>

            {/* Button for Personal */}
            <button
              type="button"
              className={`text-white font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2 ${!isGroupSelected ? 'bg-blue-500 duration-500' : 'bg-gray-300 text-gray-500'}`}
              onClick={handlePersonalClick}
              
            >
              Personal
            </button>

            {/* Button for Group */}
            <button
              type="button"
              className={`text-white font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2 ${isGroupSelected ? 'bg-blue-500 duration-500 ' : 'bg-gray-300 text-gray-500 '}`}
              onClick={handleGroupClick}
              disabled
            >
              Group
            </button>

            {/* Conditional rendering of search and user list */}
            {isGroupSelected && (
              <div className='mt-3'>
                <div>
                  <label htmlFor="add-guests" className='font-semibold'>Add users</label>
                  <div className="w-full border-b border-gray-900 opacity-30"></div>
                  <div>
                    <SearchUser />
                    <button type="button" className="text-white bg-blue-500  focus:outline-none  font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2">Add +</button>
                  </div>
                  <ul className="list-none p-0 m-0">
                    <li className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
                      <span>Jack @bogchamp</span>
                      <PersonRemoveIcon className='text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200' />
                    </li>
                    <li className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
                      <span>Tomás @pisschamp</span>
                      <PersonRemoveIcon className='text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200' />
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center mt-2"
            >
              Create
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </div>
        </div>
      </div>
    </form>
  );
};

export default BudgetForm;
