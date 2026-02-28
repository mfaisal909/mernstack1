import React from "react";

export default function CreateListing() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Create a Listing
        </h1>

        <form className="flex flex-col lg:flex-row gap-10">
          
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-6 flex-1">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Property Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter property name"
                maxLength="62"
                minLength="10"
                required
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Write property description..."
                required
                rows="4"
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter full address"
                required
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
              />
            </div>

            {/* CHECKBOX SECTION */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Sell", "Rent", "Parking Spot", "Furnished", "Offer"].map(
                (item, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-slate-700"
                    />
                    <span>{item}</span>
                  </label>
                )
              )}
            </div>

            {/* NUMBER INPUTS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beds
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baths
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Price
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col flex-1 gap-6">
            
            <div>
              <p className="font-semibold text-gray-800">
                Images
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (First image will be cover • Max 6)
                </span>
              </p>

              <div className="flex gap-4 mt-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200 shadow-md"
                >
                  Upload
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 bg-slate-800 text-white p-4 rounded-xl uppercase tracking-wide hover:bg-slate-900 transition duration-200 shadow-lg"
            >
              Create Listing
            </button>

          </div>
        </form>
      </div>
    </main>
  );
}
