import React, { useEffect, useState, useMemo } from 'react';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonIcon from '@mui/icons-material/Person';
import { supabase } from '/services/supabaseClient';
import { useNavigate } from 'react-router-dom';

function ProfileSetUp() {
    const [displayname, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [profileCreated, setProfileCreated] = useState(false); // State to track profile creation
    const navigate = useNavigate(); // Initialize useNavigate

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const userSession = await supabase.auth.getSession();

    if (!userSession.data.session) {
        console.warn('No user is logged in.');
        setLoading(false);
        return;
    }

    // Check if the username is already taken
    const { data: existingUsernames, error: fetchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username);

    if (fetchError) {
        console.error('Error checking username:', fetchError);
        setLoading(false);
        return;
    }

    // Check if any usernames were returned
    if (existingUsernames && existingUsernames.length > 0) {
        setErrorMessage('Username is already taken.');
        setLoading(false);
        return;
    }

    // If username is available, insert the new profile
    const { error } = await supabase
        .from('profiles')
        .insert([{
            id: userSession.data.session.user.id,
            displayname,
            username,
        }]);

    if (error) {
        console.error('Error creating profile:', error);
        setLoading(false);
    } else {
        console.log('Profile created successfully!');
        setProfileCreated(true); // Set profile created state to true
    }

    setLoading(false);
};

    // Redirect to profile when profile is created
    useEffect(() => {
      if (profileCreated) {
          navigate('/profile'); // Redirect to /profile
      }
  }, [profileCreated, navigate]);




  return (
    <div>
      <div className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 '>
        <section className='min-h-[40vh] flex flex-col justify-center items-center'>
          <h1 className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-500 to-blue-500 font-bold text-5xl sm:text-6xl md:text-7xl pb-5'>
            So... Who are you?
          </h1>
          <form onSubmit={handleProfileSubmit}>
            <div className="flex pb-3 pt-8">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gradient-to-r from-blue-400 via-sky-500 to-blue-500 border border-e-0 border-gray-300 rounded-s-md">
                <PersonIcon className='text-white' fontSize="medium" />
              </span>
              <input
                type="text" className="rounded-none rounded-e-lg focus:outline-none border text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-200 border-gray-300 placeholder-gray-400"
                placeholder="Daniel Bryan"
                value={displayname}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="flex pb-3">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 border border-e-0 border-gray-300 rounded-s-md">
                <AlternateEmailIcon className='text-white' fontSize="medium" />
              </span>
              <input
                type="text" className="rounded-none rounded-e-lg focus:outline-none border text-gray-900 block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-200 border-gray-300 placeholder-gray-400"
                placeholder="@bryandanielson"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                
              />
            </div>
            
            <div>
           <button
          type="submit"
                                
            className='w-full text-black px-5 py-2.5 text-center border border-sky-500 rounded-lg font-semibold hover:bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 hover:text-white hover:scale-105 items-center justify-center duration-300'>
           Create
       </button>
     </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ProfileSetUp;
