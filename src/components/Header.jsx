import React from 'react';
import { useAuth } from '/services/AuthListener'; // Adjust the path to where AuthListener is located
import { supabase } from '/services/supabaseClient';

const Header = () => {
  const { user, loading } = useAuth(); // Get the user and loading state from AuthContext

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while session is being fetched
  }

  return (
    <header className="bg-gray-800 text-white p-1">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Cashew
        </h1>

        <nav>
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li>
                  <a href="/" className="hover:text-gray-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/profile" className="hover:text-gray-300">
                    Profile
                  </a>
                </li>
                <li>
                  <button onClick={handleSignOut} className="hover:text-gray-300">
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/" className="hover:text-gray-300">Home</a>
                </li>
                <li>
                  <a href="/about" className="hover:text-gray-300">Dev notes</a>
                </li>
                <li>
                  <a href="/login" className="hover:text-gray-300">Log In</a>
                </li>
                <li>
                  <a href="/signup" className="hover:text-gray-300">Sign Up</a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
