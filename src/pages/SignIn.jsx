import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const {loading,error}=useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            onChange={handleChange}
            type="email"
            placeholder="Email"
            id="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          <input
            onChange={handleChange}
            type="password"
            placeholder="Password"
            id="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 shadow-md disabled:opacity-70"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>

        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{' '}
          <Link
            to="/sign-up"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
