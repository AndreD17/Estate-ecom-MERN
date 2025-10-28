import { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import {useNavigate, useParams} from "react-router-dom"
export default function UpdateListing() {
  
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, seterror] = useState([])
  const [imageUploadError, setImageUploadError] = useState("");

 const params = useParams();

useEffect(() => {
  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/get/${params.listingId}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        ...data
      }));
    } catch (error) {
      console.error("Error fetching listing:", error);
    }
  };

  fetchListing();
}, [params.listingId]);
 
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type:"rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  
  console.log(formData);
  
  const handleChange = (e) =>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer' ){
      setFormData({
        ...formData,
        [e.target.id]:e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type == 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  }

  // ✅ Handle multiple image uploads
  const handleImageSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select images to upload");
      return;
    }

    if (files.length > 6) {
      alert("You can upload a maximum of 6 images");
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      alert("You can only have a total of 6 images");
      return;
    }

    try {
      setUploading(true);
      setImageUploadError("");

      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append("files", files[i]);
      }

      const res = await fetch("/api/upload/multiple", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (!res.ok) {
        setImageUploadError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      console.log("Uploaded URLs:", data.urls);

      const newUrls = [...formData.imageUrls, ...data.urls];
      setFormData((prev) => ({ ...prev, imageUrls: newUrls }));

      setUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setImageUploadError("Image upload failed, please try again");
      setUploading(false);
    }
  };

  // ✅ Delete image from preview & formData
  const handleDeleteImage = (index) => {
    const updatedUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, imageUrls: updatedUrls }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if(formData.imageUrls < 1) return seterror('You must upload at least one image');
        if (+formData.discountedPrice >= +formData.regularPrice) return seterror("Discounted price must be lower than regular price");
        setLoading(true)
        seterror(false)
        const res = await fetch(`/api/listings/update/${params.listingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body:JSON.stringify({
            ...formData,
            userRef: currentUser._id ||  currentUser.user._id
          }),
        });
        const data = await res.json();
        console.log('Created listing response:', data);
        setLoading(false)
        if(data.success === false ){
          seterror(data.message)
        }
        navigate(`/listing/${data._id}`)
        
      } catch (error) {
        seterror(error.message)
        setLoading(false)
      }
    }
    return (
      <main className="p-3 max-w-xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Update Listing
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Text inputs */}
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          
        <div className="flex flex-wrap gap-4">
          {/* Sale */}
          <div className="flex items-center gap-2">
          <input
            type="radio"
            id="sale"
            name="type"
            value="sale"
            className="w-5 h-5 accent-blue-600" 
            onChange={handleChange}
            checked={formData.type === "sale"}
            required
          />
          <span>Sell</span>
        </div>

          <div className="flex p-3 items-center gap-3">
            <input
            type="radio"
            id="rent"
            name="type"
            value="rent"
            className="w-5 h-5 accent-blue-600"
            onChange={handleChange}
            checked={formData.type === "rent"}
            />
          <span>Rent</span>
          </div>
        </div>
            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              {[
                { id: "parking", label: "Parking spot" },
                { id: "furnished", label: "Furnished" },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={item.id}
                    className="w-5 h-5"
                    onChange={handleChange}   
                    checked={formData[item.id] || false }   
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 items-center mt-3">
              <input
                type="checkbox"
                id="offer"
                className="w-5 h-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
              
            </div>

            {/* Numeric inputs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bedrooms */}
          <div className="flex flex-col">
          <label htmlFor="bedrooms" className="font-medium text-gray-700 text-sm mb-1">
            Beds
            </label>
            <input
            className="w-32 p-2 text-sm border border-gray-300 rounded-md"
            type="number"
            id="bedrooms"
            min="1"
            max="10"
            required
            onChange={handleChange}
            value={formData.bedrooms}
          />
        </div>

        {/* Bathrooms */}
        <div className="flex flex-col">
        <label htmlFor="bathrooms" className="font-medium text-gray-700 text-sm mb-1">
          Baths
        </label>
        <input
          className="w-32 p-2 text-sm border border-gray-300 rounded-md"
          type="number"
          id="bathrooms"
          min="1"
          max="5"
          required     
          onChange={handleChange}
          value={formData.bathrooms}
        />
      </div>

      {/* Regular Price */}
      <div className="flex flex-col">
        <label htmlFor="regularPrice" className="font-medium text-gray-700 text-sm mb-1">
          Regular Price
        </label>
        <input
        className="w-32 p-2 text-sm border border-gray-300 rounded-md"
          type="number"
          id="regularPrice"
          min="50"
          max="10000000"
          required
          onChange={handleChange}
          value={formData.regularPrice}
        />
        {formData.type === "rent" && (
          <p className="text-xs text-gray-500 mt-1">($ / month)</p>
        )}
      </div>

        {/* Discounted Price — only visible when offer is checked */}
        {formData.offer && (
          <div className="flex flex-col">
            <label htmlFor="discountedPrice" className="font-medium text-gray-700 text-sm mb-1">
              Discounted Price
            </label>
            <input
              className="w-32 p-2 text-sm border border-gray-300 rounded-md"
              type="number"
              id="discountedPrice"
              min="50"
              max="10000000"
              required
              onChange={handleChange}
              value={formData.discountedPrice}
            />
            {formData.type === "rent" && (
              <p className="text-xs text-gray-500 mt-1">($ / month)</p>
            )}
              </div>
          )}
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              First image will be cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-500 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleImageSubmit}
              type="button"
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-red-600 text-sm">{imageUploadError}</p>
          )}

          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="flex flex-col items-center">
                  <img
                    src={url}
                    alt={`uploaded-${i}`}
                    className={`w-full h-24 object-cover rounded-lg ${
                      i === 0 ? "border-2 border-green-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i)}
                    className=" text-red-700 uppercase text-sm hover:opacity-75"
                  >
                    {loading ? "Deleting..." : "Delete image"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update Listing"}
        </button>
       {error && <p className="text-red-700 text-sm">{error}</p>}
      </form>
    </main>
  );
}
