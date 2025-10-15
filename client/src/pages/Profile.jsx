import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getGravatar } from "../utils/gravator";
import { app } from "../firebase";
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserSuccess, deleteUserStart} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();


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
      alert("Profile updated successfully");
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
      alert("Upload failed, check console");
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
      alert("Account deleted successfully");
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
      
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
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{userUpdated ? 'User is updated successfully!' : ''}</p>
    </div>
  );
}