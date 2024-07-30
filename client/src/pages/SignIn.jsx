import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [loading,setLoading] = useState(false);
  const [err,setErr] =useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
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
        console.log(data);
        setLoading(false)
        navigate('/')
      } else {
        const errorData = await res.json();
        console.error('Sign-in failed:', errorData.message);
        setLoading(false)
        setErr(errorData.message)
      }
    } catch (err) {
      console.error('Error:', err);
      setLoading(false)
      setErr(err)
      setFormData({})
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center font-semibold my-8 text-3xl'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} method='POST'>
       
        <input
          className='rounded-lg border p-3'
          placeholder='email'
          id='email'
          onChange={handleChange}
        />
        <input
          className='rounded-lg border p-3'
          placeholder='password'
          type='password'
          id='password'
          onChange={handleChange}
        />
        <button className='bg-slate-700 rounded-lg shadow-md text-white uppercase p-3 hover:opacity-95'>
          {loading ?'Loading....':'Sign In'}
        </button>
      </form>
      <div className='mt-5 flex gap-3'>
        <p>Do not Have an account?</p>
        <Link to={'/sign-up'} className='text-blue-800'>
          Sign Up
        </Link>
      </div>
      <p className='text-red-600 text-sm'>{err ? 'Error:' :''}{err}</p>
    </div>
  );
};
