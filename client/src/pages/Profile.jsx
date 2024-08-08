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
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateState, setUpdateState] = useState(false);
  const [list, setList] = useState([]);

  const [listingError, setListingError] = useState(false);
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
      console.log("Delete successful:", data); // Log success for debugging
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.error("Delete error:", error.message); // Log error for debugging
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signOut");
      const data = res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  const handleShowListing = async (e) => {
    try {
      setListingError(true);
      const res = await fetch(`/api/user/userListings/${currentUser._id}`);

      const data = await res.json();

      setList(data);

      if (data.status === 304) {
        setFileError(false);
      } else {
        setListingError(data.message);
      }

      setFileError(false);
    } catch (error) {
      setListingError(error);
    }
  };

  const handleListDelete = async (listId) => {
     try {

      const res = await fetch(`/api/listing/delete/${listId}`, {
        method: 'DELETE',
      });

      const data =  await  res.json()
      console.log(data)

      setList((e)=>(e.filter((listing)=>listing._id !== listId )))
      
     } catch (error) {
      
     }
  };

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
        <Link
          to={"/create-listing"}
          className="bg-green-700 p-3 text-white text-center rounded-lg uppercase hover:opacity-95"
        >
          Create List
        </Link>
        <div className="flex justify-between">
          <span className="text-red-500 cursor-pointer" onClick={handleDelete}>
            Delete
          </span>
          <span className="text-red-500 cursor-pointer" onClick={handleSignOut}>
            {" "}
            Sign Out
          </span>
        </div>
        <p className="text-green-700">{error ? error : ""}</p>
        <p className="text-green-700">
          {updateState ? "Updated Success Fully .... " : ""}
        </p>
        <p className="text-green-700 w-full text-center ">{listingError}</p>

        <p
          className="text-green-700 w-full text-center cursor-pointer"
          onClick={handleShowListing}
        >
          Show User Listings
        </p>

        {list &&
          list.length > 0 &&
          list.map((list) => (
            <div
              className="border p-3 rounded-lg shadow-lg flex justify-around items-center"
              key={list._id}
            >
              <Link to={`/listing/${currentUser._id}`}>
                {" "}
                <div className="flex items-center gap-10">
                <img
                  className="h-20 w-20 object-cover"
                  src={list.imageUrl[0]}
                />
                <p className="font-semibold ">{list.name}</p>
                </div>
               
              </Link>

              <div className="flex gap-3">
                <Link to={`/edit-listing/${list._id}`} className="text-green-700">
                  Edit
                </Link>
                <button
                  onClick={() => handleListDelete(list._id)}
                  className="text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </form>
    </div>
  );
};

export default Profile;
