import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { getGravatar } from "../utils/gravator";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultAvatar =
    "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80";

  const avatarSrc =
    avatarUrl || currentUser?.avatar || getGravatar(currentUser?.email) || defaultAvatar;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select an image first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file); // 👈 must match multer field name

    try {
      const res = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarUrl(res.data.url); // save uploaded image url
      console.log("Uploaded:", res.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, check console");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <p className="text-center mt-10">
        You must be signed in to view your profile.
      </p>
    );
  }

  return (
    <div className="p-2 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
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
          onClick={() => fileRef.current.click()} // click triggers file input
        />

        {file && (
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg p-2 mt-3 hover:opacity-90"
          >
            {loading ? "Uploading..." : "Upload Avatar"}
          </button>
        )}

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
