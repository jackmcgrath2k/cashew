import React, { useState } from 'react';
import { supabase } from '/services/supabaseClient';
import { Link } from 'react-router-dom';


export default function SearchUser() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchUsers = async (query) => {
        setLoading(true);
        setError('');

        // Prepare the search query to check for both username and @username
        const formattedQuery = query.startsWith('@') ? query.substring(1) : query;

        try {
            console.log("Searching for query:", query); // Log the search query
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, displayname')
                .or(`username.ilike.%${formattedQuery}%, displayname.ilike.%${formattedQuery}%`);

            console.log("Response from Supabase:", { data, error }); // Log response

            if (error) {
                console.error('Error searching users:', error);
                setError('Error searching users');
            } else {
                setSearchResults(data);
                console.log("Search results:", data); // Log the results
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value.trim(); // Get the trimmed input
        setSearchQuery(query);

        if (query.length > 1) { // Search when query is longer than 1 character
            searchUsers(query); // Pass the query directly
        } else {
            setSearchResults([]); // Clear results if query is too short
        }
    };

      //Clear search when options clicked
  const handleOptionClick = () => {
    setSearchQuery(''); // Clear the search input
    setSearchResults([]); // Optionally, clear the search results
  };


    return (
        <div className="relative">
            <input
                type="text"
                className="block w-full p-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-200"
                placeholder="Search for users"
                value={searchQuery}
                onChange={handleInputChange}
            />
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <li key={user.id}>
                            <Link to={`/profiles/${user.username}`} onClick={handleOptionClick}>
                            <div>
                                <p className='p-1'>
                                    <strong>{user.displayname}</strong> (@{user.username})
                                </p>
                            </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    searchQuery.length > 1 && <p className='text-gray-400 text-center'>No users found.</p> // Only show this message if the search query has more than 1 character
                )}
            </ul>
        </div>
    );
}
