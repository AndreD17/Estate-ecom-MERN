import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, [e.target.id]: e.target.checked });
    }

    if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('limit', 6);
        const searchQuery = urlParams.toString();

        const res = await fetch(`/api/listings/get?${searchQuery}`);
        const data = await res.json();

        setListings(data);
        setLoading(false);
        
        if(data.length > 8){
            setShowMore(true);
        }else{
            setShowMore(false);
        }
        setShowMore(data.length === 6);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.keys(sidebardata).forEach((key) =>
      urlParams.set(key, sidebardata[key])
    );
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    try {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', startIndex);
      urlParams.set('limit', 3);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/listings/get?${searchQuery}`);
      const data = await res.json();
     if(data.length < 9){
        setShowMore(false)
     }
      setListings([...listings, ...data]);
      setShowMore(data.length === 3);
    } catch (error) {
      console.error('Error loading more listings:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="font-semibold">Type:</label>
            {['all', 'rent', 'sale'].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={type}
                  className="w-5 h-5"
                  checked={sidebardata.type === type}
                  onChange={handleChange}
                />
                <span className="capitalize">{type}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 h-5"
                checked={sidebardata.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="font-semibold">Amenities:</label>
            {['parking', 'furnished'].map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={amenity}
                  className="w-5 h-5"
                  checked={sidebardata[amenity]}
                  onChange={handleChange}
                />
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="createdAt_asc">Date: Oldest First</option>
              <option value="createdAt_desc">Date: Newest First</option>
            </select>
          </div>

          <button className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* Listings */}
      <div className="flex-1 bg-gray-50">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">
          Listing Results:
        </h1>
        <div className="p-10 max-w-7xl mx-auto">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listings found!</p>
          )}
          {loading && (
            <p className="text-xl text-center w-full text-slate-700">Loading...</p>
          )}
          {!loading && listings.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>

              {showMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleShowMore}
                    className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
