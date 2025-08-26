import React from 'react' 
import { FaSearch } from 'react-icons/fa'
import {Link} from 'react-router-dom';
import {useSelector } from 'react-redux';
import { getGravatar } from '../utils/gravator';



export default function Header() {
 const { currentUser } = useSelector(state => state.user);


 
  // Default avatar URL
  const defaultAvatar = "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80";

  // Choose avatar: user.avatar -> gravatar from email -> default
  const avatarSrc = currentUser?.avatar || getGravatar(currentUser?.email) || defaultAvatar;

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <Link to="/">
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className="text-slate-800">Andre & Co </span>{" "}
            <span className="text-slate-700">Real-Estate</span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex item-center'>
            <input type='text' placeholder= "Search..." 
            className='bg-transparent focus:outline-none w-24 sm:w-64' 
             />
            <FaSearch className="text-slate-600" />
        </form>
         <ul className='flex gap-4 items-center'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to="/">Home</Link>
          </li>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to="/about">About</Link>
          </li>
          <li>
            {currentUser ? (
              <Link to="/profile">
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={avatarSrc}
                  alt='profile'
                />
              </Link>
            ) : (
              <Link to="/sign-in" className='text-slate-700 hover:underline'>
                Sign In
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}