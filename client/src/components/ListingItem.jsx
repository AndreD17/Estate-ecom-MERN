import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full h-full flex flex-col">
      <Link to={`/listing/${listing._id}`} className="flex flex-col flex-1">
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="h-52 w-full object-cover hover:scale-105 transition-transform duration-300 rounded-t-lg"
        />
        <div className="p-3 flex flex-col flex-1 justify-between gap-2">
          <div>
            <p className="text-lg font-semibold text-slate-700 truncate">
              {listing.name}
            </p>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              <MdLocationOn className="text-green-700" />
              <p className="truncate w-full">{listing.address}</p>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {listing.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-slate-700 font-semibold">
              ${listing.regularPrice.toLocaleString()}
              {listing.type === 'rent' && <span className="text-sm"> / month</span>}
            </p>
            <div className="flex gap-3 text-sm text-slate-600">
              <p>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </p>
              <p>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
