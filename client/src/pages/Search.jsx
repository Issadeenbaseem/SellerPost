import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItems from "./ListingItems";

const Search = () => {
  const navigate = useNavigate();
  const [loading,setLoading] =useState(false)
  const [listing,setListing] = useState([])

console.log(listing)

  const initialState = {
    type: "all",
    searchTerm: "",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  };

  const [sidebarData, setSidebarData] = useState(initialState);

  useEffect(()=>{
    const useParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = useParams.get('searchTerm');
    const sortUrl = useParams.get('sort');
    const orderUrl = useParams.get('order');
    const furnishedUrl = useParams.get('furnished');
    const typeFromUrl = useParams.get('type');
    const offerUrl = useParams.get('url');
    const parkingUrl = useParams.get('parking');


    if (
        searchTermFromUrl ||
        typeFromUrl ||
        parkingUrl ||
        furnishedUrl ||
        offerUrl ||
        sortUrl ||
        orderUrl
      ) {
        setSidebarData({
          searchTerm: searchTermFromUrl || '',
          type: typeFromUrl || 'all',
          parking: parkingUrl === 'true' ? true : false,
          furnished: furnishedUrl === 'true' ? true : false,
          offer: offerUrl === 'true' ? true : false,
          sort: sortUrl || 'created_at',
          order: orderUrl || 'desc',
        });
      }
      const fetchFilterData = async() =>{
            setLoading(true)
            const searchQuery = useParams.toString();
            const data = await fetch(`/api/listing/get?${searchQuery}`);
            setLoading(false)
            const res = await data.json()
            setListing(res)
      }
      fetchFilterData()
  },[location.search])

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebarData({ ...sidebarData, type: id });
    } else if (id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: value });
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setSidebarData({ ...sidebarData, [id]: checked });
    } else if (id === "sort_order") {
      const [sort = "created_at", order = "desc"] = value.split("_");
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const useParams = new URLSearchParams();
    useParams.set("searchTerm", sidebarData.searchTerm);
    useParams.set("parking", sidebarData.parking);
    useParams.set("order", sidebarData.order);
    useParams.set("furnished", sidebarData.furnished);
    useParams.set("offer", sidebarData.offer);

    const searchQuery = useParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleOnSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              onChange={handleChange}
              value={sidebarData.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="radio"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              id="sort_order"
              className="border rounded-lg p-3"
              value={`${sidebarData.sort}_${sidebarData.order}`}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
            {loading && <>
                <h3 className="text-center text-slate-700 font-semibold"> Loading........</h3>

            </>}
         
         {!loading && listing.length === 0 && <>
           
        <h3 className="text-center text-slate-700 font-semibold"> Listing not Found........</h3>
          
         </>}
         {!loading && listing && listing.map((e)=>(
                        <ListingItems key={e._id} props={e}/>
         ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
