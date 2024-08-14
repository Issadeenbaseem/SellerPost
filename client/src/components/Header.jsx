import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [search,setSearch] = useState('');

  const navigate = useNavigate();
 

  const handleSubmit = (e) =>{
    e.preventDefault();
    const urlSearchParam = new URLSearchParams(window.location.search)
    urlSearchParam.set('searchTerm',search);
    const searchQuery = urlSearchParam.toString();
    navigate(`/search?${searchQuery}`)
  }
   
  useEffect(()=>{
    const urlSearchTerm = new URLSearchParams(window.location.search);
    const urlTerm = urlSearchTerm.get('searchTerm')
    if(urlSearchTerm){
      setSearch(urlTerm)
    }
  },location.search)

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center p-3 max-w-6xl mx-auto">
        <h1 className="flex flex-wrap text-sm sm:text-2xl font-bold">
          <span className="text-slate-700">Seller</span>
          <span className="text-slate-500">Post</span>
        </h1>
        <form className="bg-slate-300 p-3 rounded-lg flex items-center">
          <input
            placeholder="search ..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={search}
            onChange={(e)=>{
               setSearch(e.target.value)
            }}       
          ></input>
          <FaSearch onClick={handleSubmit}  className="text-slate-500" />
        </form>
        <ul className="flex gap-4">
          <li className="text-slate-500 hidden sm:inline font-semibold hover:underline">
            Home
          </li>
          <li className="text-slate-500 hidden sm:inline font-semibold hover:underline">
            About
          </li>

          <Link to='/profile'>
          {currentUser ? (
            <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />
          ) : (
            <li className="text-slate-500 hidden sm:inline font-semibold hover:underline">
              {" "}
              Sign In
            </li>
          )}
          </Link>

      
        </ul>
      </div>
    </header>
  );
};

export default Header;
