import React, { useState } from 'react';
import PublicIcon from '@mui/icons-material/Public';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from '/services/supabaseClient';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ general: '', password: [] });
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate(); // Initialize navigate hook

    const validateFields = () => {
        const passwordErrors = [];
        if (password !== confirmPassword) {
            passwordErrors.push('Passwords do not match.');
        }
        if (password.length < 6) {
            passwordErrors.push('Password must be at least 6 characters long.');
        }
        return passwordErrors;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({ general: '', password: [] });

        const validationErrors = validateFields();
        if (validationErrors.length > 0) {
            setErrors({ password: validationErrors, general: '' });
            setIsLoading(false);
            return;
        }

        try {
            const { user, session, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                setErrors({ general: error.message, password: [] });
                console.error('Sign-up error:', error);
            } else {
                // User signed up successfully, redirect to the homepage
                console.log('Sign up successful:', user);
                console.log('Session:', session);
                navigate('/setup'); // go to user profile 
            }
        } catch (err) {
            console.error('Unexpected error during sign-up:', err);
            setErrors({ general: 'An unexpected error occurred. Please try again later.', password: [] });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <section className="text-black">
                <div className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
                    <a href="/" className="flex items-center mb-6 text-2xl font-bold">
                       
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-500 to-blue-500 font-bold">Cashew</span>
                    </a>
                    <div className="w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-200 dark:border-gray-300">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Create an account</h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSignUp}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:placeholder-gray-400"
                                        placeholder="name@company.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                                    <input
                                        type="password"
                                        name="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-300 dark:placeholder-gray-400"
                                    />
                                </div>

                                {errors.password.length > 0 && (
                                    <div className="text-gray-500 text-sm">
                                        <div className="text-red-500">
                                            <h3 className="font-semibold text-lg">Uh oh!</h3>
                                        </div>
                                        {errors.password.map((error, index) => (
                                            <div key={index}>{error}</div>
                                        ))}
                                    </div>
                                )}
                                {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            required
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-600 dark:text-gray-600">I accept the <a href="#" className="font-medium hover:underline dark:text-primary-500">Terms and Conditions</a></label>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full text-black px-5 py-2.5 text-center border border-sky-500 rounded-lg font-semibold hover:bg-gradient-to-r from-sky-400 via-sky-500 to-blue-500 hover:text-white hover:scale-105 items-center justify-center duration-300 ${isLoading ? 'opacity-50' : ''}`}>
                                        {isLoading ? 'Creating account...' : 'Create account'}
                                    </button>
                                </div>
                            </form>
                            <p className="text-sm font-light text-gray-600 dark:text-gray-600 text-center">
                                Already have an account? <Link to="/signin" className="font-medium hover:underline dark:text-primary-500">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
