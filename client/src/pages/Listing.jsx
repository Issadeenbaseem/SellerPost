import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {  FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare, } from "react-icons/fa";
import { set } from "mongoose";
import ContactForm from "../components/ContactForm";

const Listing = () => {
  const param = useParams();
  const [list, setList] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageClick ,setMessageClick] = useState(false)
 
  const {currentUser} = useSelector((state)=>state.user);


  console.log(currentUser._id)

  useEffect(() => {
    SwiperCore.use([Navigation]);
  }, []);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/listing/get/${param.id}`);
        const data = await res.json();

        if (data.success === false) {
          setError("Failed to load the listing.");
        } else {
          setList(data);
        }
      } catch (err) {
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [param.id]);

  return (
    <main>
      {loading && (
        <p className="text-center mt-7 text-xl font-semibold">Loading....</p>
      )}
      {error && (
        <p className="text-center mt-7 text-xl font-semibold">{error}</p>
      )}
      {list.imageUrl && (
        <Swiper navigation>
          {list.imageUrl.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${url}) no-repeat center`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="max-w-4xl mt-9 mx-auto flex flex-col gap-3 ">
        <p className="text-2xl font-semibold">
          {list.name} - $ {list.offer ? list.discountPrice : list.regularPrice}
          {list.type === "rent" && " / month"}
        </p>
        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {list.address}
            </p>
            <div className='flex gap-4 mt-6'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {list.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {list.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+list.regularPrice - +list.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800  mt-6'>
              <span className='font-semibold text-black'>Description - </span>
              {list.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6  mb-5'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {list.bedrooms > 1
                  ? `${list.bedrooms} beds `
                  : `${list.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {list.bathrooms > 1
                  ? `${list.bathrooms} baths `
                  : `${list.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {list.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {list.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {
                currentUser && currentUser._id !== list.userRef && !messageClick &&(
                    <button className="bg-slate-700 text-white p-3 rounded-lg mb-5 hover:opacity-85" onClick={()=>setMessageClick(true)}>Sent Message to land Owner </button>
                )
            }

            {
                currentUser && messageClick&&(
                    <>
                       <ContactForm listing={list}/>
                    </>
                )
            }



      </div>
      
    </main>
  );
};

export default Listing;
