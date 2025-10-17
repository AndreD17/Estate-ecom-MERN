import { useState } from "react";

export default function CreateListing() {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    sale: false,
    rent: false,
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    imageUrls: [],
  });

  
  // ✅ Handle input changes
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

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

      // ✅ Merge new images with existing ones
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

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.imageUrls.length === 0) {
      alert("Please upload at least one image before submitting");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        coverImage: formData.imageUrls[0], // ✅ first image as cover
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create listing");
        setLoading(false);
        return;
      }

      alert("Listing created successfully!");
      console.log("Created Listing:", data);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
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
        />

        <textarea
          placeholder="Description"
          className="border p-3 rounded-lg"
          id="description"
          required
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Address"
          className="border p-3 rounded-lg"
          id="address"
          required
          onChange={handleChange}
        />

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4">
          {[
            { id: "sale", label: "Sell" },
            { id: "rent", label: "Rent" },
            { id: "parking", label: "Parking spot" },
            { id: "furnished", label: "Furnished" },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={item.id}
                className="w-5 h-5"
                onChange={handleChange}
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
          />
          <span>Offer</span>
        </div>

        {/* Numeric inputs */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "bedrooms", label: "Beds", min: 1, max: 10 },
            { id: "bathrooms", label: "Baths", min: 1, max: 5 },
            { id: "regularPrice", label: "Regular Price" },
            { id: "discountedPrice", label: "Discounted Price" },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                className="w-full p-3 border rounded-lg"
                type="number"
                id={item.id}
                min={item.min}
                max={item.max}
                required
                onChange={handleChange}
              />
              <p>{item.label}</p>
            </div>
          ))}
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
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </main>
  );
}
