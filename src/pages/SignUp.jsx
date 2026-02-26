import { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom'
export default function SignUp() {
  const [formData,setFormData]=useState({})
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()
  const handleChange=(e)=>{
  setFormData({
    ...formData,
    [e.target.id]:e.target.value,
  })
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      
   setLoading(true)
    const res=await fetch('/api/auth/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData)
    });
    const data=await res.json();
    console.log(data)
    if(data.success===false){
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false)
    setError(null)
    navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }
  console.log(formData)
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Username"
            id="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          />

          <input
            onChange={handleChange}
            type="email"
            placeholder="Email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          />

          <input
            onChange={handleChange}
            type="password"
            placeholder="Password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            {loading?'Loading...':'Sign up'}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link to={"/sign-in"}>
          <span className="text-indigo-600 hover:underline cursor-pointer">
            Sign In
          </span>
          </Link>
        </p>
      </div>
      {error&&<p className='text-red-700 mt-5'>{error}</p>}
    </div>
  );
}
 