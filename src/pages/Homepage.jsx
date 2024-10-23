import React, { useState, useEffect } from 'react';
import { supabase } from '/services/supabaseClient';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import BudgetForm from '../components/BudgetForm';
import Modal from '../components/Modal';
import BudgetList from '../components/BudgetList';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [displayname, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showEditButtons, setShowEditButtons] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const fetchedUser = session?.user;

      if (fetchedUser) {
        setUser(fetchedUser);

        // Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('displayname, username')
          .eq('id', fetchedUser.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setDisplayName(data.displayname);
          setUsername(data.username);
        }
      } else {
        navigate('/signup');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleToggleForm = () => {
    setShowBudgetForm(!showBudgetForm);
  };

  const toggleEditButtons = () => {
    setShowEditButtons(prev => !prev);
  };

  // Function to set editing budget
  const handleEdit = (budgetId, budgetData) => {
    setEditingBudgetId(budgetId);
    setBudgetData(budgetData);
    setShowBudgetForm(true);
  };

  return (
    <div>
      <section className='min-h-screen flex flex-col items-center'>
        <div className="flex flex-row pt-6">
          <button onClick={handleToggleForm} className="flex items-center inset-0">
            {showBudgetForm ? (
              <CancelIcon className="text-red-500 transition-transform duration-300 z-50" fontSize="large" />
            ) : (
              <AddCircleIcon className="text-blue-500 transition-transform duration-300" fontSize="large" />
            )}
          </button>

          <Modal isVisible={showBudgetForm} onClose={handleToggleForm}>
            <BudgetForm
              budgetId={editingBudgetId}
              budgetData={budgetData}
              closeModal={handleToggleForm}
            />
          </Modal>
        </div>

        <AppRegistrationIcon className={showEditButtons ? 'text-blue-500' : 'text-gray-400'} onClick={toggleEditButtons} />

        <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center items-center'>
          <BudgetList showEditButtons={showEditButtons} onEdit={handleEdit} />
        </main>
      </section>
    </div>
  );
};

export default Homepage;
