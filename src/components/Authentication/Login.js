import React ,{ useEffect, useRef , useState } from 'react';
import { useAuth } from "../contexts/AuthProvider"
import { Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate();
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const showErrorToast = (message) => {
    toast.error(`🦄 ${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
};

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/DashBoard");
  } catch (error) {
      setLoading(false);
      let errorMessage = 'Failed to login. Please try again.';
      switch (error.code) {
          case 'auth/invalid-email':
              errorMessage = 'Invalid email format.';
              break;
          case 'auth/user-disabled':
              errorMessage = 'This user has been disabled.';
              break;
          case 'auth/user-not-found':
            errorMessage = 'User not found.';
              break;
          case 'auth/wrong-password':
              errorMessage = 'Invalid credentials.';
              break;
          default:
            errorMessage = 'Failed to login. Please try again.';
              break;
      }

      setError(errorMessage);
      showErrorToast(errorMessage);
  } finally {
      setLoading(false);
  }
}


  return (
    
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white flex flex-col justify-center px-6 py-12 lg:px-8 rounded-md  min-w-full">     
      <ToastContainer/>
        <div className="mx-auto min-w-3.5 max-w-lg"> 
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>
        <div className="mt-10 mx-auto w-full max-w-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  ref={emailRef}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Logging ..." : "Log In"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center">{error && <p style={{ color: 'red' }}>{error}</p>}</p>
          <p className="mt-10 text-center text-sm text-gray-500">
            Does not have an Account?{' '}
            <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
