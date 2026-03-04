import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import {useSelector} from 'react-redux'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaBed, FaBath, FaParking, FaChair, FaMapMarkerAlt } from 'react-icons/fa'
import Contact from './Contact'

SwiperCore.use([Navigation])

export default function Listing() {

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [contact,setContact]=useState(false)
  const params = useParams()
  const currentUser=useSelector((state)=>state.user)
  console.log(currentUser._id,listing?.userRef)
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)

        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json()

        if (data.success === false) {
          setError(true)
          setLoading(false)
          return
        }

        setListing(data)
        setError(false)
        setLoading(false)

      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.listingId])

  return (
    <main>

      {loading && (
        <p className='text-center my-7 text-2xl'>Loading...</p>
      )}

      {error && (
        <p className='text-center my-7 text-2xl text-red-600'>
          Something went wrong
        </p>
      )}

      {listing && !loading && !error && (
        <div className='relative'>

          {/* 🔵 IMAGE SLIDER */}
          <Swiper navigation className='h-[600px] w-full'>
            {listing.imageUrls?.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  style={{
                    background: `url(${url}) center no-repeat`,
                   backgroundSize: 'cover', height: '100%',width:'100%s'
                  }}
                >
                   <div className="bg-black/30 h-full w-full"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 🔵 TITLE + PRICE */}
          <div className='p-5 flex flex-col gap-4'>

            <h1 className='text-3xl font-bold'>
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice
                : listing.regularPrice}
              {listing.type === 'rent' && ' / month'}
            </h1>

            {/* 🔵 ADDRESS */}
            <p className='flex items-center gap-2 text-gray-600'>
              <FaMapMarkerAlt className='text-green-600' />
              {listing.address}
            </p>

            {/* 🔵 BUTTONS */}
            <div className='flex gap-4'>
              {listing.type === 'rent' && (
                <span className='bg-red-700 text-white px-3 py-1 rounded-md'>
                  For Rent
                </span>
              )}

              {listing.offer && (
                <span className='bg-green-600 text-white px-3 py-1 rounded-md'>
                  $
                  {listing.regularPrice - listing.discountPrice}
                  {' '}discount
                </span>
              )}
            </div>

            {/* 🔵 DESCRIPTION */}
            <p className='text-gray-700 leading-relaxed'>
              <span className='font-semibold text-black'>
                Description -{' '}
              </span>
              {listing.description}
            </p>

            {/* 🔵 FEATURES */}
            <ul className='flex gap-6 text-green-700 font-semibold flex-wrap'>

              <li className='flex items-center gap-1'>
                <FaBed />
                {listing.bedrooms} Beds
              </li>

              <li className='flex items-center gap-1'>
                <FaBath />
                {listing.bathrooms} Baths
              </li>

              <li className='flex items-center gap-1'>
                <FaParking />
                {listing.parking ? 'Parking' : 'No Parking'}
              </li>

              <li className='flex items-center gap-1'>
                <FaChair />
                {listing.furnished ? 'Furnished' : 'Not Furnished'}
              </li>

            </ul>
            {currentUser&&listing.userRef!==currentUser._id
            && !contact &&(
                      <div className="flex justify-center">
  <button onClick={()=>setContact(true)} className="bg-slate-700 text-white 
              rounded-lg uppercase hover:opacity-95 
              px-6 py-2 text-sm font-semibold 
              w-fit items-center">
    Contact landlord
  </button>
</div>
            )}
            {contact && <Contact listing={listing}/>}

          </div>

        </div>
      )}

    </main>
  )
}  