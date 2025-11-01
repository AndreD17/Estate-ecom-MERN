import React, { useEffect, useState } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getGravatar } from '../utils/gravator';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const defaultAvatar =
    'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid&w=740&q=80';

  const avatarSrc =
    currentUser?.avatar || getGravatar(currentUser?.email) || defaultAvatar;

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
    setMenuOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <h1 className="font-bold text-lg sm:text-xl flex flex-wrap">
            <span className="text-slate-800">Andre & Co</span>{' '}
            <span className="text-slate-700 ml-1">Real-Estate</span>
          </h1>
        </Link>

        {/* Search Bar (hidden on very small screens) */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex bg-slate-100 p-2 rounded-lg items-center w-full sm:w-72 lg:w-96 mx-4"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex gap-6 items-center">
          <li className="text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>
          <li>
            {currentUser ? (
              <Link to="/profile">
                <img
                  className="rounded-full h-9 w-9 object-cover"
                  src={avatarSrc}
                  alt="profile"
                />
              </Link>
            ) : (
              <Link to="/sign-in" className="text-slate-700 hover:underline">
                Sign In
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-slate-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-slate-100 shadow-inner flex flex-col items-center p-4 gap-4">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 p-2 rounded-lg flex items-center w-full max-w-xs"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <FaSearch className="text-slate-600" />
            </button>
          </form>

          <Link
            to="/"
            className="text-slate-700 hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-slate-700 hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          {currentUser ? (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <img
                className="rounded-full h-10 w-10 object-cover"
                src={avatarSrc}
                alt="profile"
              />
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="text-slate-700 hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
