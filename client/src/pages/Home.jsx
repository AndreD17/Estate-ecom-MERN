import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listings/get?offer=true&limit=4'),
          fetch('/api/listings/get?type=rent&limit=4'),
          fetch('/api/listings/get?type=sale&limit=4')
        ]);

        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json()
        ]);

        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Andre Real Estate is the best place to find your next perfect place to live and call home.
          <br /> We have a wide range of properties for you to choose from.
        </p>
        <Link to="/search" className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Click to find your perfect home...
        </Link>
      </div>

      {/* Swiper Section */}
      {offerListings.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          navigation
          pagination={{ clickable: true }}
          effect="fade"
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
        >
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* Offers */}
        {offerListings.length > 0 && (
          <div>
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
              <Link to="/search?offer=true" className="text-sm text-blue-600 hover:underline">
                Show more offers
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rentListings.length > 0 && (
          <div>
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-slate-600">Places for Rent</h2>
              <Link to="/search?type=rent" className="text-sm text-blue-600 hover:underline">
                Show more places for rent
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Sale */}
        {saleListings.length > 0 && (
          <div>
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-slate-600">Places for Sale</h2>
              <Link to="/search?type=sale" className="text-sm text-blue-600 hover:underline">
                Show more places for sale
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
