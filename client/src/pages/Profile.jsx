import React from 'react'
import { useSelector } from 'react-redux';
import { getGravatar } from '../utils/gravator';

export default function Profile() {
  const { currentUser} = useSelector((state) => state.user);


  const defaultAvatar = "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80";

  const avatarSrc = currentUser?.avatar || getGravatar(currentUser?.email) || defaultAvatar;

  if (!currentUser) {
    return <p className="text-center mt-10">You must be signed in to view your profile.</p>;
  }


  return (
    <div className='p-2 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'
      >Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={avatarSrc} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer
        self-center mt-2' />
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg ' />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>

      </form>
      <div className='flex justify-between mt-5' >
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
