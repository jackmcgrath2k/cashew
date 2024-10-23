import { React, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import About from './pages/About';
import { supabase } from '/services/supabaseClient';
import SignUp from './components/SignUp';
import ProfileSetUp from './components/ProfileForm';
import UserProfile from './components/UserProfile';
import Header from './components/Header';
import { AuthProvider } from '/services/AuthListener';
import SignIn from './components/SignIn';
import BudgetView from './components/BudgetView';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes in the session state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthProvider>
    <BrowserRouter>
    <Header />
      <Routes>
        {/* Redirect to different pages based on session state */}

          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/setup" element={<ProfileSetUp />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/budget/:budgetId" element={<BudgetView />}/>
          </>

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;