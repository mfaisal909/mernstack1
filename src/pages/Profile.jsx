import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { supabase } from "../supabase";
import {
  signInSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  /* ================= Upload Image ================= */

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);

      const fileName = Date.now() + "-" + file.name;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (error) {
        console.log("Upload Error:", error.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const res = await fetch(
        `/api/user/update/${currentUser?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ avatar: imageUrl }),
        }
      );

      const updatedUser = await res.json();

      if (!res.ok) {
        console.log(updatedUser.message);
        setUploading(false);
        return;
      }

      dispatch(signInSuccess(updatedUser));
      setUploading(false);
    } catch (error) {
      console.log(error.message);
      setUploading(false);
    }
  };

  /* ================= Update Profile ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `/api/user/update/${currentUser?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  /* ================= Delete User ================= */

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `/api/user/delete/${currentUser?._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  /* ================= Sign Out ================= */

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/signOut", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  /* ================= Show Listings (FIXED 401) ================= */

  const handleShowListings = async () => {
    try {
      setShowListingError(false);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `/api/user/listings/${currentUser._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListing(data);
    } catch (error) {
      console.log(error);
      setShowListingError(true);
    }
  };

  /* ================= UI ================= */
  const handleListingDelete = async (listingId) => {
  try {
    const res = await fetch(
      `/api/listing/delete/${listingId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
      return;
    }

    setUserListing((prev) =>
      prev.filter((listing) => listing._id !== listingId)
    );

  } catch (error) {
    console.log(error.message);
  }
};

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={currentUser?.avatar || "/default-avatar.png"}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser?.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        {uploading && (
          <p className="text-blue-600 text-center">
            Uploading image...
          </p>
        )}

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 rounded-lg text-center uppercase"
        >
          Create Listing
        </Link>
      </form>

      {/* Delete & SignOut */}
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>

        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>

      {/* Errors */}
      <p className="text-red-700 mt-5">{error}</p>
      <p className="text-green-600 mt-5">
        {updateSuccess ?"User updated successfully!":""}
      </p>

      
      <button
        onClick={handleShowListings}
        className="text-green-600 w-full mt-5"
      >
        Show Listings
      </button>

      <p className="text-red-700 mt-3">
        {showListingError ?"Error loading listings":""}
      </p>

      {userListing.length > 0 &&(
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
       {userListing.map((listing) => (
          <div key={listing._id} className="border rounded-lg p-3 flex justify-between 
          items-center gap-4">
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing"
                className="h-16 w-16 object-contain rounded-lg"
              />
            </Link>
            <Link className="text-slate-700 font-semibold hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700
              hover:cursor-pointer uppercase">Delete</button>
              <button className="text-green-600 hover:cursor-pointer uppercase">Edit</button>
            </div>
          </div>
        ))}
        </div>)}
    </div>
  );
}
