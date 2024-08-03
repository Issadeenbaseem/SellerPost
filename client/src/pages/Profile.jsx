import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar||currentUser.avatar}
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
          type="text"
          placeholder="User name"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Password"
          className="border p-3 rounded-lg"
        />
        <button className="uppercase text-white bg-slate-600 p-3 rounded-lg hover:bg-slate-700">
          update
        </button>
        <div className="flex justify-between">
          <span className="text-red-500 cursor-pointer">Delete</span>
          <span className="text-red-500 cursor-pointer">Sign In</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
