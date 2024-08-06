import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const CreatingListing = () => {
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    imageUrl: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading , setLoading] = useState(false)

  console.log(formData);

  const handleImageUpload = (e) => {
    if (file.length > 0 && file.length + formData.imageUrl.length < 7) {
      setLoading(true)
      const promises = [];
      for (let i = 0; i < file.length; i++) {
        promises.push(storageImage(file[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrl: formData.imageUrl.concat(urls),
          });
          setImageUploadError(false);
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          setImageUploadError("Image Upload Error");
          setLoading(true)
        });
    } else {
      setImageUploadError("The first Image cover max(6)");
      setLoading(true)
    }
  };

  const storageImage = async (file) => {
    return new Promise((resolve, reject) => {
      const store = getStorage(app);
      const fileName = new Date().getTime() + file.name; // Changed to getTime to avoid potential duplicate filenames
      const storageRef = ref(store, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
  };
  

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center text-3xl font-semibold mt-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 mt-14 gap-4  ">
          <input placeholder="Name" className="border p-3 rounded-lg" />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
          />
          <input placeholder="Address" className="border p-3 rounded-lg" />

          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" className="w-4" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-4" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-4" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-4" />
              <span>Offer</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-4" />
              <span>Rant</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2 items-center ">
              <input
                type="number"
                className="rounded-lg border  p-2"
                max={10}
                min={1}
              />
              <p>Bads </p>
            </div>
            <div className="flex gap-2 items-center ">
              <input
                type="number"
                className="rounded-lg border  p-2"
                max={10}
                min={1}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center ">
              <input
                type="number"
                className="rounded-lg border  p-2"
                max={10}
                min={1}
              />
              <p>Regular Price</p>
              <span>( $ / month )</span>
            </div>
            <div className="flex gap-2 items-center ">
              <input
                type="number"
                className="rounded-lg border  p-2"
                max={10}
                min={1}
              />
              <p>Discount Price</p>
              <span>( $ / month )</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 mt-14 gap-4   ">
          <div className="flex flex-col gap-4">
            <div className="font-semibold">
              <p>
                Image Upload :{" "}
                <span className="text-gray-600 ">
                  The first Image cover max(6)
                </span>{" "}
              </p>{" "}
            </div>

            <div className="flex gap-2">
              <input
                type="file"
                className="p-2 border border-gray-700 rounded-lg"
                onChange={(e) => setFile(e.target.files)}
                multiple
              />
              <button
                type="button"
                onClick={handleImageUpload}
                className="border border-green-600 text-green-600 rounded-lg p-3 uppercase hover:shadow-lg"
              >
                {loading ? 'Uploading':'Upload'}
              </button>
            </div>
            <p className="text-red-600 text-sm">{imageUploadError}</p>

            {formData.imageUrl.length > 0 &&
              formData.imageUrl.map((url,index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button  type='button'

                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75' onClick={()=>handleDeleteImage(index)}>
                    delete
                  </button>

                </div>
              ))}

            <button className="bg-gray-700 p-3 rounded-lg text-white">
              Create New Listing
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default CreatingListing;
