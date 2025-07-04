import React, { useEffect, useState } from "react";
import { useChat } from "../auth/useChat";
import { useAuth } from "../auth/useAuth";
import { FaSpinner } from "react-icons/fa";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChat();
  const { authUser, onlineUsers } = useAuth();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const onlineCount = onlineUsers.filter((id) => id !== authUser?._id).length;

  return (
    <div className="w-72 h-full bg-base-200 rounded-2xl p-4 shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm font-medium">Show online users</span>
        </label>
        <span className="text-xs text-gray-500">({onlineCount} online)</span>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
        {isUsersLoading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-xl text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-10">
            {showOnlineOnly ? "No users are online." : "No users found."}
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              const isSelected = selectedUser?._id === user._id;

              return (
                <li
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className={`flex items-center gap-3 p-3 rounded-xl shadow transition cursor-pointer
                    ${isSelected ? "bg-primary text-primary-content" : "bg-base-100 hover:bg-base-300"}`}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || `https://i.pravatar.cc/150?u=${user._id}`}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold truncate max-w-[150px]">{user.username}</span>
                    <span className={`text-xs ${isOnline ? "text-green-600" : "text-gray-400"}`}>
                      {isOnline ? "Active now" : "Offline"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
