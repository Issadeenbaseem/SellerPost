import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          className="object-cover rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          placeholder="User name"
          className="'border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Email"
          className="'border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Password"
          className="'border p-3 rounded-lg"
        />
        <button className="uppercase text-white bg-slate-600 p-3 rounded-lg hover:">update</button>
        <div className="flex justify-between">
            <span className="text-red-500 cursor-pointer">Delete</span>
            <span className="text-red-500 cursor-pointer">Sign In</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
