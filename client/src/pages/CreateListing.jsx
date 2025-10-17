import React from 'react';

export default function CreateListing() {
  return (
    <main className="p-3 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-6 flex-1">
          {/* Text fields */}
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={65}
            minLength={10}
            required
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />

          <textarea
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          {/* Checkboxes */}
          <div>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'sale', label: 'Sell' },
                { id: 'rent', label: 'Rent' },
                { id: 'parking', label: 'Parking spot' },
                { id: 'furnished', label: 'Furnished' },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input type="checkbox" id={item.id} className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 items-center mt-3">
              <input type="checkbox" id="offer" className="w-5 h-5" />
              <span>Offer</span>
            </div>
          </div>

          {/* Numeric inputs — 2 per line */}
          <div className="grid grid-cols-2 gap-4">
            {/* Beds */}
            <div className="flex items-center gap-2">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>

            {/* Baths */}
            <div className="flex items-center gap-2">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="5"
                required
              />
              <p>Baths</p>
            </div>

            {/* Regular Price */}
            <div className="flex flex-row items-center gap-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                required
              />
              <div>
                <p>Regular price</p>
                <span className="text-xs text-gray-500">($ / month)</span>
              </div>
            </div>

            {/* Discounted Price */}
            <div className="flex items-center gap-4">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountedPrice"
                required
              />
              <div>
                <p>Discounted price</p>
                <span className="text-xs text-gray-500">($ / month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-500 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>

          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
