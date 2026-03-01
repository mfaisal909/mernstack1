import { useState } from "react";
import { supabase } from "../supabase";
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
export default function CreateListing() {
  const {currentUser}=useSelector(state=>state.user)
  const navigate=useNavigate()
  const [files,setFiles]=useState([])
  const [formData,setFormData]=useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularPrice:50,
    discountPrice:0,
    offer:false,
    parking:false,
    furnished:false,
  })
  console.log(formData)
  const [imageUrls,setImagesUrls]=useState([])
  const [uploading,setUploading]=useState(false);
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)
  
  const handleImageSubmit=async(e)=>{
    if(files.length===0)
    {
      setError("Please select at latest 1 images");
      return ;
    }
    if(files.length>6)
    {
      setError("Maximum 6 images allowed");
      return ;
    }
    setUploading(true);
    setError(null)
      try {
        const uploadPromises=files.map((file)=>storeImage(file))
        const urls = await Promise.all(uploadPromises)
        setImagesUrls(urls)
        setFormData((prev)=>({
          ...prev,
          imageUrls:urls,
        }))
      } catch (err) {
        console.error(err)
        setError("Image upload fail (2MB max per image)")
      }
      setUploading(false)
    };
  
  const storeImage=async(file)=>{
    if(file.size>2*1024*1024)
    {
      throw new Error("File size must be less than 2MB")
    }
    const fileName=`${Date.now()} - ${file.name}`;
    const {error}=await supabase.storage
    .from("avatars")
    .upload(fileName,file);

    if(error)
    {
      throw error 
    }
    const {data} =supabase.storage
    .from("avatars")
    .getPublicUrl(fileName)
    return data.publicUrl
  }

    const handleDeleteImage = async (url) => {
    try {

      const fileName = url.split("/").pop();

      const { error } = await supabase.storage
        .from("avatars")
        .remove([fileName]);

      if (error) {
        throw error;
      }

      setImagesUrls((prev) => prev.filter((img) => img !== url));

    } catch (err) {
      console.error(err);
      setError("Failed to delete image");
    }
  };
  const handleChange=(e)=>{
    const {id,value,type,checked}=e.target;
    if(type==="checkbox")
    {
      setFormData({
        ...formData,
        [id]:checked,
      })
    }else{
      setFormData({
        ...formData,
        [id]:value,
      })
    }
  if (id === "sale" || id === "rent") {
    setFormData({
      ...formData,
      type: id,
    });
  }
if(e.target.id==="parking"||e.target.id==="furnished" ||e.target.value==="offer"){
  setFormData({
    ...formData,
    [e.target.id]:e.target.checked
  })
}
if(e.target.type==="number"||e.target.type==="text"||e.target.type==="textarea"){
  setFormData({
    ...formData,
    [e.target.id]:e.target.value
  })
}
  };
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
       if(formData.imageUrls.length<1) 
       {
        return setError("You must upload at least one image")
       }
        if(+formData.regularPrice<+formData.discountPrice)
        {
          return setError('Discount price must be lower than regular price')
        }
      setLoading(true)
      setError(false)
      const res=await fetch('/api/listing/create',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          ...formData,
          userRef:currentUser._id
        })
      })
      const data=await res.json();
      setLoading(false)
      if(data.success===false)
      {
        setError(data.message)
      }
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return ( 
    <main className="p-6 max-w-6xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Create a Listing
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex flex-col gap-6 flex-1">
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Property Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter property name"
                maxLength="62"
                minLength="1"
                required
                onChange={handleChange}
                value={formData.name}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Write property description..."
                required
                onChange={handleChange}
                value={formData.description}
                rows="4"
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter full address"
                required
                onChange={handleChange}
                value={formData.address}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
              />
            </div>

          
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Sell", id: "sale" },
                { label: "Rent", id: "rent" },
                { label: "Parking", id: "parking" },
                { label: "Furnished", id: "furnished" },
                { label: "Offer", id: "offer" },
              ].map((item) => (
                <label key={item.id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={
                      item.id === "sale" || item.id === "rent"
                        ? formData.type === item.id
                        : formData[item.id] ?? false
                    }
                    onChange={handleChange}
                  />
                  {item.label}
                </label>
              ))}
            </div>
        
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beds
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  id='bedrooms'
                  required
                  onChange={handleChange}
                  value={formData.bedrooms}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baths
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  id='bathrooms'
                  required
                  onChange={handleChange}
                  value={formData.bathrooms}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Price
                </label>
                <input
                  type="number"
                  min="50"
                  id='regularPrice'
                  required
                  onChange={handleChange}
                  value={formData.regularPrice}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>
               {formData.offer&&(
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  min=""
                  id='discountPrice'
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />
              </div>
          )}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-6">
            
            <div>
              <p className="font-semibold text-gray-800">
                Images
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (First image will be cover • Max 6)
                </span>
              </p>

              <div className="flex gap-4 mt-4">
                <input
                  onChange={(e)=>setFiles([...e.target.files])}
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleImageSubmit}
                  disabled={uploading}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200 shadow-md"
                >
                  {uploading?"Uploading...":"Upload"}
                </button>
              </div>
              {error && (<p className="text-red-600 mt-2 text-sm">{error}</p>)}
            </div>
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">

                    <img
                      src={url}
                      alt="listing"
                      className="h-24 w-full object-cover rounded-lg"
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded-md hover:bg-red-700"
                    >
                      X
                    </button>

                  </div>
                ))}
              </div>
            )}

            <button
            disabled={loading||uploading}
      
              className="mt-6 bg-slate-800 text-white p-4 rounded-xl uppercase tracking-wide hover:bg-slate-900 transition duration-200 shadow-lg"
            >
              {loading?"Creating....":"Create listing"}
            </button>
              {error&&<p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}