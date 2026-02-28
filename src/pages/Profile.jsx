import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { supabase } from "../supabase";
import { signInSuccess } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

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
        console.log(error);
        setUploading(false);
        return;
      }

      
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ avatar: imageUrl }),
      });

      const updatedUser = await res.json();

      dispatch(signInSuccess(updatedUser));

      setUploading(false);

    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4">

        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input type="text"
        placeholder="username"
        defaultValue={currentUser.username} 
        className="border p-3 rounded-lg border-gray-300 " id="username"/>
        
        <input type="email"
        placeholder="email"
        defaultValue={currentUser.username} 
        className="border p-3 rounded-lg border-gray-300 " id="email"/>
        
        <input type="password"
        placeholder="password"
        defaultValue={currentUser.username} 
        className="border p-3 rounded-lg border-gray-300 " id="password"/>
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 
        disabled:opacity-80">Update</button>
        {uploading && (
          <p className="text-center text-sm text-gray-500">
            Uploading image...
          </p>
        )}

      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer ">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
