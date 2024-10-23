import React, {useState} from 'react'
import PublicIcon from '@mui/icons-material/Public';
import { Link,useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { supabase } from '/services/supabaseClient';


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize navigate hook

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
        } else {
          navigate('/profile'); // go to user profile 
        }
      };


  return (
    <div>


    <section className="text-black">
  <div className="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
      <a href="/" className="flex items-center mb-6 text-2xl font-bold">
         
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-500 to-blue-500 font-bold'>Cashew</span>  
      </a>
      <div className="w-full bg-gray-800 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-200 dark:border-gray-300 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Sign in
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                      <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:placeholder-gray-400 " placeholder="name@company.com" required/>
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                      <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-300  dark:placeholder-gray-400" required/>
                  </div>

                  <div>

                  {error && <div className="text-red-500 mb-4">{error}</div>}

                    <button
                    type="submit"
                    className="w-full text-black px-5 py-2.5 text-center border border-blue-500 rounded-lg font-semibold hover:bg-gradient-to-r from-blue-400 via-sky-500 to-blue-500 hover:text-white hover:scale-105 items-center justify-center duration-300">
                    Sign in
                    </button>



                    <div className='text-center'>
                                    <p className="text-sm font-light text-gray-600 dark:text-gray-600 pb-2 pt-5">
                                        Forgot your password? <a className="font-medium text-primary-600 hover:underline dark:text-primary-500 disabled">Click here</a>
                                    </p>
                                    <p className="text-sm font-light text-gray-600 dark:text-gray-600">
                                        Don't have an account? <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500"><span className='text-sky-500 font-bold'>Sign up</span></Link>
                                    </p>
                                    </div>
                    </div>
                </form>

              <div className="mt-4 m-auto space-y-6 md:w-10/12 lg:w-full">
        <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-500 to-blue-500 font-bold text-3xl sm:text-4xl text-black md:text-5xl">Welcome back</h1>
        <p className="text-center text-md text-gray-600 pb-2">
          The budgeting app for family, friends and you.
        </p>
        </div>
          </div>

      </div>
  </div>
</section>
      </div>

  )
}


export default SignIn;



