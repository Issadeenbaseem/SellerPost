import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItems = ({ props }) => {
  return (
    <>
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
        <Link to={`/listing/${props._id}`}>
          <img
            src={
              props.imageUrl && props.imageUrl.length > 0
                ? props.imageUrl[0]
                : "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
          <div className="p-3 flex flex-col gap-2 w-full">
            <p className="truncate text-lg font-semibold text-slate-700">
              {props.name}
            </p>
            <div className="flex items-center gap-1">
              <MdLocationOn className="h-4 w-4 text-green-700" />
              <p className="text-sm text-gray-600 truncate w-full">
                {props.address}
              </p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {props.description}
            </p>
            <p className="text-slate-500 mt-2 font-semibold ">
              $
              {props.offer
                ? props.discountPrice
                  ? props.discountPrice.toLocaleString("en-US")
                  : "0"
                : props.regularPrice
                ? props.regularPrice.toLocaleString("en-US")
                : "0"}
              {props.type === "rent" && " / month"}
            </p>
            <div className="text-slate-700 flex gap-4">
              <div className="font-bold text-xs">
                {props.bedrooms > 1
                  ? `${props.bedrooms} beds `
                  : `${props.bedrooms} bed `}
              </div>
              <div className="font-bold text-xs">
                {props.bathrooms > 1
                  ? `${props.bathrooms} baths `
                  : `${props.bathrooms} bath `}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default ListingItems;
