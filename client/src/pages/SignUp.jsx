import React from 'react'
import {Link} from 'react-router-dom'

export const SignUp     = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-center font-semibold my-8 text-3xl '>Sign Up</h1>
    <form className='flex flex-col gap-4 '>
        <input className='rounded-lg border p-3' placeholder='username' id='username'/>
        <input className='rounded-lg border p-3' placeholder='email'  id='email'/>
        <input className='rounded-lg border p-3' placeholder='password' id='password' />
        <button className='bg-slate-700 rounded-lg shadow-md text-white uppercase p-3 hover:opacity-95'>Sign Up</button>
    </form>
    <div className='mt-5 flex gap-3' >
        <p>Have an account ?</p>
        <Link to={'/sign-in'} className='text-blue-800'>sign in</Link>
    </div>
    </div>
  )
}
