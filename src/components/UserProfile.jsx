import React, { useEffect, useState } from 'react';
import { supabase } from '/services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DeleteIcon from '@mui/icons-material/Delete';



const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [displayname, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState(''); // Store original display name
  const [originalUsername, setOriginalUsername] = useState(''); // Store original username
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
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
          setOriginalDisplayName(data.displayname);
          setOriginalUsername(data.username);
        }
      } else {
        navigate('/signup'); // Redirect if no user is logged in
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    setDisplayName(''); // Clear input
    setUsername('');    // Clear input
    setIsEditing(true); // Enable editing mode
    setErrorMessage(''); // Clear error message
  };

  const handleSave = async () => {
    // Validate input fields
    if (!displayname.trim() || !username.trim()) {
      setErrorMessage('Both fields are required.'); // Set error message
      return; // Exit early if validation fails
    }

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ displayname, username })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
      } else {
        setIsEditing(false); // Exit editing mode
        setErrorMessage(''); // Clear error message on successful save
      }
    }
  };

  const handleCancel = () => {
    setDisplayName(originalDisplayName); // Reset to original value
    setUsername(originalUsername); // Reset to original value
    setIsEditing(false); // Exit editing mode
    setErrorMessage(''); // Clear error message
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?');
    if (confirmDelete) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else if (user) {
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);
          
 
        if (deleteError) {
          console.error('Error deleting profile:', deleteError);
        } else {
          navigate('/'); // Redirect to home after deletion
        }
      }
    }
  };



  if (!user) {
    return <div>Loading...</div>; // Show loading message
  }
  return (
    <div className="user-profile">

      <div className="dark:bg-navy-800 shadow-xl rounded-lg relative mx-auto flex h-full w-full max-w-[550px] flex-col items-center bg-white bg-cover bg-clip-border p-4 dark:text-white">
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: 'url("https://i.ibb.co/FWggPq1/banner.png")' }}
      >

      </div>

      <div className="mt-16 flex flex-col items-center">
        {isEditing ? (
          <div className="flex pb-3">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-600 border border-e-0 border-gray-300 rounded-s-md">
            <PersonIcon className='text-white' fontSize="small" />
          </span>
          <input className="rounded-none rounded-e-lg focus:outline-none border text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-200 border-gray-300 placeholder-gray-400 "
                placeholder="Name"
              type="text" 
              value={displayname} 
              onChange={(e) => setDisplayName(e.target.value)} 
            />
            </div>
          ) : (
            
            <h1 className='text-blue-600 text-xl font-bold'>{displayname}</h1>
          )}

{isEditing ? (
            <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-600 border border-e-0 border-gray-300 rounded-s-md">
              <AlternateEmailIcon className='text-white' fontSize="small" />
            </span>
            <input className="rounded-none rounded-e-lg focus:outline-none border text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-200 border-gray-300 placeholder-gray-400"
                placeholder="@username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            </div>
          ) : (
            <p className="text-gray-500 text-base font-normal">{username}</p>
          )}
        
      </div>

      <div className="mt-6 mb-3 flex gap-4 md:gap-14">


        <div className="flex flex-col items-center justify-center">
          <h3 className="text-blue-600 text-2xl font-bold">N/A</h3>
          <p className="text-gray-500 text-sm font-normal">Friends</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h3 className="text-blue-600 text-2xl font-bold">N/A</h3>
          <p className="text-gray-500 text-sm font-normal">Following</p>
        </div>
      </div>
      <div className="profile-actions">
      {errorMessage && <p className="text-red-500 text-center justify-center">{errorMessage}</p>} {/* Display error message */}
  <div className="flex flex-row gap-2">
    {isEditing ? (
      <>
        
        <button
          type="button"
          onClick={handleSave}
          className="py-2 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-400 rounded-full border border-gray-200"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="py-2 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-400 rounded-full border border-gray-200"
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          type="button"
          onClick={handleEdit}
          className="py-2 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-400 rounded-full border border-gray-200"
        >
          Edit Profile
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="py-2 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-400 rounded-full border border-gray-200"
        >
          Delete Account
        </button>
      </>
    )}
  </div>
</div>

    </div>
    </div>
  );
};

export default UserProfile;
