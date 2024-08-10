import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

const Listing = () => {
  const param = useParams();
  const [list, setList] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

        if (data.success===false) {
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
    <div>
      {loading && <p className="text-center mt-7 text-xl font-semibold">Loading....</p>}
      {error && <p className="text-center mt-7 text-xl font-semibold">{error}</p>}
      {list.imageUrl && (
        <Swiper navigation>
          {list.imageUrl.map((url) => (
            <SwiperSlide key={url}>
              <div className="h-[550px]" style={{ background: `url(${url}) no-repeat center`, backgroundSize: 'cover' }}></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Listing;
