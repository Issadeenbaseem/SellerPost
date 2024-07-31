import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice.js'

export const SignIn = () => {
  const [formData, setFormData] = useState({});
  const {loading,error} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    
    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(signInSuccess(data))
        navigate('/');
      } else {
        const errorData = await res.json();
        console.error('Sign-in failed:', errorData.message);
        dispatch(signInFailure(errorData.message))
      }
    } catch (err) {
      console.error('Error:', err);
      dispatch(signInFailure('An error occurred. Please try again.'))
     
    } finally {
        dispatch(signInFailure())

    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center font-semibold my-8 text-3xl">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} method="POST">
        <input
          className="rounded-lg border p-3"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <input
          className="rounded-lg border p-3"
          placeholder="password"
          type="password"
          id="password"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 rounded-lg shadow-md text-white uppercase p-3 hover:opacity-95"
          type="submit"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-5 flex gap-3">
        <p>Do not have an account?</p>
        <Link to="/sign-up" className="text-blue-800">
          Sign Up
        </Link>
      </div>
      {error && <p className="text-red-600 text-sm">Error: {error}</p>}
    </div>
  );
};
