import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateState, setUpdateState] = useState(false);
  // console.log(formData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }));
        });
      }
    );
  };

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateState(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json(); // Await the JSON response
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      console.log('Delete successful:', data); // Log success for debugging
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.error('Delete error:', error.message); // Log error for debugging
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async() =>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signOut');
      const data = res.json();
      if(data.success === false)
      {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          className="object-cover rounded-full h-24 w-24 cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
          alt="Profile"
        />
        <p>
          {fileError ? (
            <span className="text-red-700 text-center">
              Error FIle Upload..
            </span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-slate-700">upload ... {filePer}%</span>
          ) : filePer === 100 ? (
            <span className="text-green-700">File Upload Success ....</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="User name"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handelChange}
        />
        <input
          id="email"
          type="text"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handelChange}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handelChange}
        />
        <button
          disabled={loading}
          className="uppercase text-white bg-slate-600 p-3 rounded-lg hover:bg-slate-700 disabled:opacity-80"
        >
          {loading ? "Loading.." : "Update"}
        </button>
        <div className="flex justify-between">
          <span className="text-red-500 cursor-pointer" onClick={handleDelete}>
            Delete
          </span>
          <span className="text-red-500 cursor-pointer" onClick={handleSignOut}> Sign Out</span>
        </div>
        <p className="text-green-700">{error ? error : ""}</p>
        <p className="text-green-700">
          {updateState ? "Updated Success Fully .... " : ""}
        </p>
      </form>
    </div>
  );
};

export default Profile;
