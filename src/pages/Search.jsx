import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import ListingItem from "../components/ListingItem";
export default function Search() {
  const navigate=useNavigate()
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading,setLoading]=useState(false)
  const [listings,setListings]=useState([])
  const [showMore,setShowMore]=useState(false)
  console.log(listings)
   useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const searchTermFromUrl=urlParams.get('searchTerm')
    const typeFromUrl=urlParams.get('type');
    const parkingFromUrl=urlParams.get('parking');
    const furnishedFromUrl=urlParams.get('furnished')
    const offerFromUrl=urlParams.get('offer')
    const sortFromUrl=urlParams.get('sort')
    const orderFromUrl=urlParams.get('order')

    if(searchTermFromUrl||typeFromUrl||parkingFromUrl||furnishedFromUrl||
      offerFromUrl||sortFromUrl||orderFromUrl
    ){
      setSidebardata({
        searchTerm:searchTermFromUrl||'',
        type:typeFromUrl||'all',
        parking:parkingFromUrl==='true'?true:false,
        furnished:furnishedFromUrl==='true'?true:false,
        offer:offerFromUrl==='true'?true:false,
        sort:sortFromUrl||'created_at',
        order:orderFromUrl||'desc'
      })
    }
    const fetchListings=async()=>{
          setLoading(true)
          setShowMore(false)
          const searchQuery=urlParams.toString()
          const res=await fetch(`/api/listing/get?${searchQuery}`)
          const data=await res.json();
          if(data.length>8)
          {
            setShowMore(true )
          }
          else
          {
            setShowMore(false)
          }
          setListings(data)
          setLoading(false)
    }
    fetchListings()

   },[location.search])
  

  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (type === "radio") {
      setSidebardata((prev) => ({
        ...prev,
        type: value,
      }));
    }

    else if (id === "searchTerm") {
      setSidebardata((prev) => ({
        ...prev,
        searchTerm: value,
      }));
    }

    else if (type === "checkbox") {
      setSidebardata((prev) => ({
        ...prev,
        [id]: checked,
      }));
    }

    else if (id === "sort_order") {
      const [sort, order] = value.split("_");

      setSidebardata((prev) => ({
        ...prev,
        sort,
        order,
      }));
    }
  };
  const handleSubmit=(e)=>{
    e.preventDefault()
    const urlParams=new URLSearchParams()
    urlParams.set('searchTerm',sidebardata.searchTerm)
    urlParams.set('type',sidebardata.type)
    urlParams.set('parking',sidebardata.parking)
    urlParams.set('furnished',sidebardata.furnished)
    urlParams.set('offer',sidebardata.offer)
    urlParams.set('sort',sidebardata.sort)
    urlParams.set('order',sidebardata.order)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  const onShowMoreClick=async()=>{
      const numberOfListings=listings.length;
      const startIndex=numberOfListings;
      const urlParams=new URLSearchParams(location.search)
      urlParams.set('startIndex',startIndex)
      const searchQuery=urlParams.toString();
      const res=await fetch(`/api/listing/get?${searchQuery}`)
      const data=await res.json();
      if(data.length<9)
      {
        setShowMore(false)
      }
      setListings([...listings,...data])
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">

      <div className="w-full md:w-80 bg-white shadow-xl p-8 border-r">

        <h2 className="text-2xl font-bold text-slate-700 mb-6">
          Search Filters
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-600">
              Search Term
            </label>

            <input
              type="text"
              id="searchTerm"
              value={sidebardata.searchTerm}
              onChange={handleChange}
              placeholder="Search listings..."
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
            />
          </div>


          <div className="flex flex-col gap-3">
            <label className="font-semibold text-slate-600">
              Type
            </label>

            <div className="grid grid-cols-2 gap-3">

              {[
                { label: "Rent & Sale", value: "all" },
                { label: "Rent", value: "rent" },
                { label: "Sale", value: "sale" },
                { label: "Offer", value: "offer" },
              ].map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-2 text-gray-600 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="type"
                    value={item.value}
                    checked={sidebardata.type === item.value}
                    onChange={handleChange}
                    className="w-4 h-4 accent-slate-700"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>


          <div className="flex flex-col gap-3">
            <label className="font-semibold text-slate-600">
              Amenities
            </label>

            <div className="flex gap-6">


              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="parking"
                  checked={sidebardata.parking}
                  onChange={handleChange}
                  className="w-4 h-4 accent-slate-700"
                />
                Parking
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="furnished"
                  checked={sidebardata.furnished}
                  onChange={handleChange}
                  className="w-4 h-4 accent-slate-700"
                />
                Furnished
              </label>

            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-600">
              Sort By
            </label>

            <select
              id="sort_order"
              defaultValue="createdAt_desc"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
            >
              <option value="regularPrice_desc">
                Price high to low
              </option>

              <option value="regularPrice_asc">
                Price low to high
              </option>

              <option value="createdAt_desc">
                Latest
              </option>

              <option value="createdAt_asc">
                Oldest
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-slate-700 text-white py-3 rounded-lg uppercase font-semibold tracking-wide hover:bg-slate-800 transition duration-300 shadow-md"
          >
            Search
          </button>

        </form>
      </div>

      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-slate-700 border-b pb-4">
            Listings Results
          </h1>
          <div className="p-7 flex flex-wrap gap-4">
            {!loading&&listings.length===0&&(
              <p className="text-xl text-slate-700">No Lisings Founds!</p>
            )}
            {loading&&(<p className="text-xl text-slate-700 text-center w-full">Loading...</p>)}
            {
              !loading &&listings&&listings.map((listing)=>(
                <ListingItem key={listing._id} listing={listing}/>
              ))
            }
            {showMore&&(
              <button onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full">
              Show more
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
