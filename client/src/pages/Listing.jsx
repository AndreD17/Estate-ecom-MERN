import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';
import {useSelector} from "react-redux"
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';


export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const [contact, setContact] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  console.log(currentUser._id, listing?._id);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listings/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong</p>}

      {listing && !loading && !error && (
        <div className="my-3 mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            navigation
            pagination={{ clickable: true }}
            effect="fade"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop
            slidesPerView={1}
          >
            {listing.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="h-[550px] md:h-[450px] rounded-xl bg-center bg-cover"
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md  bg-slate-100 p-2'>
              Link Copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name}- ${''}
              {listing.offer
                ? listing.discountedPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / Month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              <span>{listing.address}</span>
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-center text-white p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {
                listing.offer && (
                  <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>${+listing.regularPrice - +listing.discountedPrice} OFF</p>
                )
              }
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description- {' '}</span>
              {listing.description}
            </p>
            <ul className='flex flex-wrap text-green-900 text-sm font-semibold gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking > 1 ?  'Parking Spot Available' : 'No Parking Spot'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={() => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>Contact Landlord</button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}
