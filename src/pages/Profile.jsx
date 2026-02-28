import { useSelector, useDispatch } from "react-redux";
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

  const { currentUser,loading,error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess]=useState(false)
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

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

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Backend Error:", errorData);
        setUploading(false);
        return;
      }

      const updatedUser = await res.json();

      dispatch(signInSuccess(updatedUser));

      setUploading(false);
    } catch (error) {
      console.log("Catch Error:", error.message);
      setUploading(false);
    }
  };

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
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser=async()=>{
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE'
      });
      const data=await res.json()
      if(data.success===false)
      {
        dispatch(deleteUserFailure(data.message));
        return ;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignOut=async()=>{
    try {
      dispatch(signOutUserStart())
      const res=await fetch('/api/auth/signOut')
      const data=await res.json();
      if(data.success===false)
      {
        dispatch(signOutUserFailure(data.message))
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }
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
          className="border p-3 rounded-lg border-gray-300"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          className="border p-3 rounded-lg border-gray-300"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg border-gray-300"
          id="password"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "loading..." : "Update"}
        </button>

        {uploading && (
          <p className="text-center text-sm text-gray-500">
            Uploading image...
          </p>
        )}
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">
        {error?error:""}
      </p>
      <p className="text-green-600 mt-5">
        {updateSuccess?"User is updated successfully!":""}
      </p>
    </div>
  );
}
