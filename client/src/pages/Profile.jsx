import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getGravatar } from "../utils/gravator";
import { app } from "../firebase";
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserSuccess, deleteUserStart,
  signOutUserStart, signOutUserSuccess, signOutUserFailure
} from "../redux/user/userSlice";
import { Link} from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Listing from "../../../backend/models/listing.model";



export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false); 
  const [showListingError, setShowListingError] = useState(false);
  const [deleteListingError, setDeleteListingError] = useState(false);
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const [userListings, setUserListings] = useState([]);


  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });
  const [userUpdated, setUserUpdated] = useState(false);
  const defaultAvatar =
    "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80";

  const avatarSrc =
    avatarUrl || currentUser?.avatar || getGravatar(currentUser?.email) || defaultAvatar;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id || currentUser.user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        credentials: 'include', 
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl || currentUser.avatar,
        }),
      });

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUserUpdated(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleFileUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const res = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarUrl(res.data.url);
      console.log("Uploaded:", res.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <p className="text-center mt-10">
        You must be signed in to view your profile.
      </p>
    );
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await  fetch(`/api/user/delete/${currentUser._id || currentUser.user._id}`, {
        method: 'DELETE'
      })
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
      alert(data.message)
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout')
      const data = await res.json();
      if(data.success === false ){
        dispatch(signOutUserFailure(data.message))
        alert(data.message)
        return;
      }
      dispatch(signOutUserSuccess(data));
      alert("Signed out successfully");
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }
  
  const handleShowListing = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id || currentUser.user._id}`)
      const data = await res.json(); 
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true)     
    }
  }

  const handleDeleteListing = async (listingId) => {
      try {
          const res = await fetch(`/api/listings/delete/${listingId}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if(data.success === false){
          console.log(data.message);
          return
          
        }
        setUserListings((prev) => prev.filter((listing)=> listing._id != listingId));
        
      } catch (error) {
        console.log(error.message);
        setDeleteListingError(true);
        
      }
    }
  return (
    <div className="p-2 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleFileChange}
          hidden
        />

        {/* Avatar */}
        <img
          src={avatarSrc}
          alt="profile"
          className="rounded-full h-28 w-28 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()} 
        />

        {file && (
          <button
            disabled={uploading}
            type="button"
            onClick={handleFileUpload}
            className="bg-blue-600 text-white rounded-lg p-2 mt-3 hover:opacity-90"
          >
            {uploading ? "Uploading..." : "Upload Avatar"}
          </button>
        )}

        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        
         {/* 🔹 Password field with show/hide toggle */}
             <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="border p-3 rounded-lg w-full"
                  id="password"
                  onChange={handleChange}
                  />
                  <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 cursor-pointer text-sm text-grey-600 hover:text-gray-800"
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                  </div>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white rounded-lg p-3 uppercase text-center hover:opacity-95 " to={"/create-listing"}>
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{userUpdated ? 'User is updated successfully!' : ''}</p>
      <button onClick={handleShowListing} className="text-green-700 w-full ">Show Listings</button>
      <p className="text-red-700">{showListingError ? 'Error showing listing' : ''}</p>
      
        {userListings &&
         userListings.length > 0 &&
         <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold ">Your Listings</h1>
            {userListings.map((listing) => (
         <div 
          key={listing._id} 
         className="border cover rounded-lg p-3 flex justify-between items-center gap-4"
            >
            {/* Group image and name together */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link to={`/listing/${listing._id}`}>
                <img 
                  src={listing.imageUrls[0]} 
                  alt="listing cover" 
                  className="h-16 w-16 object-contain"
                />
              </Link>

              <Link 
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold hover:underline truncate block w-full"
              >
                <p className="truncate">{listing.name}</p>
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col items-center flex-shrink-0">
              <button onClick={()=>handleDeleteListing(listing._id)} className="text-red-700 uppercase">Delete</button>
              <Link to={`/Update-Listing/${listing._id}`}>
                 <button  className="text-green-700 uppercase">Edit</button>
              </Link>
            </div>
          </div>
        ))}
       </div>}   
      </div>
    );
  }

