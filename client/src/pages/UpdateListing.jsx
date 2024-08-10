import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: "50",
    discountPrice: "50",
    bathrooms: "1",
    bedrooms: "1",
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imageUrl: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      const id = params.id;

      const listingData = await fetch(`/api/listing/get/${id}`);

      const data = await listingData.json();

      setFormData(data);
    };

    fetchList();
  }, []);

  const handleImageUpload = (e) => {
    if (file.length > 0 && file.length + formData.imageUrl.length < 7) {
      setLoading(true);
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
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          setImageUploadError("Image Upload Error");
          setLoading(false); // Fixed to setLoading(false) on error
        });
    } else {
      setImageUploadError("The first Image cover max(6)");
      setLoading(false); // Fixed to setLoading(false) when file validation fails
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

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrl.length < 1)
      return setError("Need to upload minimum one image");
    if (formData.regularPrice > formData.discountPrice)
      return setError("Discount price must less then the regular price");

    try {
      setLoadingForm(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();

      console.log(data)

      navigate(`/listing/${data._id}`);

      if (data.success === "true") {
        setLoadingForm(false);
        setError(false);
      } else {
        setLoadingForm(false); // Fixed to setLoadingForm(false) on error
        setError(true);
      }

      console.log(data);
    } catch (error) {
      setLoadingForm(false); // Fixed to setLoadingForm(false) on error
      setError(error.message);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center text-3xl font-semibold mt-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 mt-14 gap-4">
          <input
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.description}
            id="description"
            type="textarea"
          />
          <input
            placeholder="Address"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.address}
            id="address"
            type="text"
          />

          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-4"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-4"
                id="parking"
                value={formData.parking}
                onChange={handleChange}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-4"
                id="furnished"
                value={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-4"
                id="offer"
                value={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-4"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2 items-center ">
              <input
                type="number"
                className="rounded-lg border p-2"
                max={10}
                min={1}
                id="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center ">
              <input
                type="number"
                className="rounded-lg border p-2"
                max={10}
                min={1}
                id="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center ">
              <input
                type="number"
                className="rounded-lg border p-2"
                max={100000000}
                min={0}
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p>Regular Price</p>
              <span>( $ / month )</span>
            </div>
            {formData.offer ? (
              <div className="flex gap-2 items-center ">
                <input
                  type="number"
                  className="rounded-lg border p-2"
                  max={100000000}
                  min={50}
                  id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p>Discount Price</p>
                <span>( $ / month )</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 mt-14 gap-4">
          <div className="flex flex-col gap-4">
            <div className="font-semibold">
              <p>
                Image Upload :{" "}
                <span className="text-gray-600">
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
                {loading ? "Uploading" : "Upload"}
              </button>
            </div>
            <p className="text-red-600 text-sm">{imageUploadError}</p>
            <p className="text-red-600 text-sm">{error}</p>

            {formData.imageUrl.length > 0 &&
              formData.imageUrl.map((url, index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                    onClick={() => handleDeleteImage(index)}
                  >
                    delete
                  </button>
                </div>
              ))}

            <button className="bg-gray-700 p-3 rounded-lg text-white">
              Edit Listing
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
