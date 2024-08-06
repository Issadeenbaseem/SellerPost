import React from "react";

const CreatingListing = () => {
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
              />
              <button className="border border-green-600 text-green-600 rounded-lg p-3 uppercase hover:shadow-lg">
                Upload
              </button>
            </div>

            <button className="bg-gray-700 p-3 rounded-lg text-white" >Create New Listing</button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default CreatingListing;
