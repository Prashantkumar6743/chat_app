import React, { useRef, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { Pencil } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuth();

  const [formData, setFormData] = useState({
    username: authUser?.username || '',
    email: authUser?.email || '',
    profilePic: authUser?.profilePic || '',
  });

  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setEditing(false);
  };

  const formatJoinDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
        <p className="text-lg">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-200 rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-primary">
            <img
              src={formData.profilePic || '/default-user.png'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {editing && (
            <div className="mt-2 flex justify-center">
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-primary hover:underline flex items-center gap-1 text-sm"
              >
                <Pencil size={16} />
                Change photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {!editing ? (
            <>
              <h2 className="text-2xl font-bold mt-4">{authUser.username}</h2>
              <p className="text-gray-500">{authUser.email}</p>

              <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-400">
                <span className={authUser.isActive ? "text-success" : "text-error"}>
                  {authUser?.isActive ? 'Active now' : 'Offline'}
                </span>
                <span>Joined {formatJoinDate(authUser?.createdAt)}</span>
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input input-bordered mt-4 w-full"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered mt-2 w-full"
              />
            </>
          )}
        </div>

        <div className="text-center mt-6">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="btn btn-success"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
