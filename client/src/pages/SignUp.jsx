import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export const SignUp = () => {
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
      const res = await fetch('/api/auth/sign-up', {
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
        navigate('/sign-in')
      } else {
        const errorData = await res.json();
        console.error('Sign-up failed:', errorData.message);
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
      <h1 className='text-center font-semibold my-8 text-3xl'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} method='POST'>
        <input
          className='rounded-lg border p-3'
          placeholder='username'
          id='username'
          onChange={handleChange}
        />
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
          {loading ?'Loading....':'Sign Up'}
        </button>
        
        <OAuth/>
      </form>
      <div className='mt-5 flex gap-3'>
        <p>Have an account?</p>
        <Link to={'/sign-in'} className='text-blue-800'>
          Sign in
        </Link>
      </div>
      <p className='text-red-600 text-sm'>{err ? 'Error:' :''}{err}</p>
    </div>
  );
};
