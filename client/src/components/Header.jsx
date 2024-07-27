import React from 'react'
import {FaSearch} from 'react-icons/fa'

const Header = () => {
  return (
   <header className='bg-slate-200 shadow-md'>
    <div className='flex justify-between items-center p-3 max-w-6xl mx-auto'> 
    <h1 className='flex flex-wrap text-sm sm:text-2xl font-bold'>
        <span className='text-slate-700'>Seller</span>
        <span className='text-slate-500'>Post</span>
    </h1>
    <form className='bg-slate-300 p-3 rounded-lg flex items-center'>
        <input placeholder='search ...' className='bg-transparent focus:outline-none w-24 sm:w-64'></input>
        <FaSearch className='text-slate-500'/>
    </form>
    <ul className='flex gap-4'>
        <li className='text-slate-500 hidden sm:inline font-semibold hover:underline'>Home</li>
        <li className='text-slate-500 hidden sm:inline font-semibold hover:underline'>About</li>
        <li className='text-slate-500 hidden sm:inline font-semibold hover:underline'> Sign In</li>
    </ul>
    </div>
   
   </header>
  )
}

export default Header