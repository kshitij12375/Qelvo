import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react';
import "../ui/ProfilePage.css"

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    }

  }


  return (
    <div>


      <div className='headers'>
        <h1>Profile</h1>
        <p>Your profile information</p>
      </div>
      <div className='pic'>


        <img className='pics' src={selectedImage || authUser.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8yCap-OFEzeJLnZAtzinq6qTDowXUNgKJpzN66oAneVnkpNz8hOoJcQ&s=10"} />
        <label htmlFor='avtar-upload'>
          <Camera />
          <input id="avtar-upload" type='file' accept='image/*' onChange={handleImageUpload} disabled={isUpdatingProfile} />
        </label>


      </div>

      <p className='tx1'> {isUpdatingProfile ? ("Loading ...") : ("Click the camera icon to update your photo")}</p>

      <div className='details'>

        <User />
        <h4>Full Name</h4>
        <p>{authUser.fullName}</p>

        <Mail />
        <h4>Email</h4>
        <p>{authUser.email}</p>




      </div>

      <div className='account-info'>
        <div className='tx3'><span>Member Since</span>  <span>{authUser.createdAt?.split("T")[0]}</span></div>
        <div className='txt'><span>Account Status</span> <span>Active</span></div>
      </div>

    </div>


  )
}

export default ProfilePage
