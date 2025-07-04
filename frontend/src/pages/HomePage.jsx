import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../auth/useChat";
import { useAuth } from "../auth/useAuth";
import { FaSpinner } from "react-icons/fa";
import { X } from "lucide-react";
import { formatMessageTime } from "../lib/utils"
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  const {
    messages,
    selectedUser,
    isMessagesLoading,
    getMessages,
    sendMessages,
    subToMessages,
    unsubFromMessages,
  } = useChat();


  const { authUser, onlineUsers } = useAuth();

  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }

    subToMessages();

    return () => unsubFromMessages();
  }, [selectedUser, getMessages, subToMessages, unsubFromMessages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDiscardImage = () => {
    setImage(null);
    setPreviewUrl("");
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !image) return;

    const messageData = {};
    if (newMessage.trim()) messageData.text = newMessage.trim();

    if (image) {
      try {
        const base64Image = await convertToBase64(image);
        messageData.image = base64Image;
      } catch (error) {
        console.error("Image conversion failed:", error);
        return;
      }
    }

    try {
      await sendMessages(messageData);
      setNewMessage("");
      setImage(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex h-[calc(100vh-4rem)] p-4 gap-4">
      {/* Sidebar */}
      <Sidebar />
      {/* Chat Section */}
      <div className="flex-1 bg-base-100 rounded-xl shadow p-4 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 border-b pb-3 mb-4">
              <img
                src={
                  selectedUser.profilePic ||
                  `https://i.pravatar.cc/150?u=${selectedUser._id}`
                }
                alt={selectedUser.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-lg font-semibold">
                  {selectedUser.username}
                </div>
                <div
                  className={`text-sm ${onlineUsers.includes(selectedUser._id)
                    ? "text-green-500"
                    : "text-gray-400"
                    }`}
                >
                  {onlineUsers.includes(selectedUser._id)
                    ? "Active"
                    : "Offline"}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
              {isMessagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <FaSpinner className="animate-spin text-xl" />
                </div>
              ) : (
                [...messages]
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((msg, index) => {
                    const isOwnMessage = msg.senderId === authUser._id;
                    const senderUser = isOwnMessage ? authUser : selectedUser;
                    const bubbleStyle = isOwnMessage
                      ? "bg-primary text-white rounded-tl-xl rounded-bl-xl"
                      : "bg-gray-200 text-gray-900 rounded-tr-xl rounded-br-xl";

                    return (
                      <div
                        key={index}
                        className={`flex gap-2 items-end ${isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        ref={index === messages.length - 1 ? messageEndRef : null}
                      >
                        {!isOwnMessage && (
                          <img
                            src={
                              senderUser.profilePic ||
                              `https://i.pravatar.cc/150?u=${senderUser._id}`
                            }
                            alt={senderUser.username}
                            className="w-8 h-8 rounded-full ring-2 ring-white"
                          />
                        )}

                        <div className="flex flex-col max-w-xs">
                          <div className={`p-3 rounded-xl shadow-sm ${bubbleStyle}`}>
                            {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
                            {msg.image && (
                              <img
                                src={msg.image}
                                alt="sent"
                                className="mt-2 rounded max-w-full max-h-48 object-cover"
                              />
                            )}
                          </div>
                          <span className="text-xs text-gray-400 mt-1 ml-1">
                            {formatMessageTime(msg.createdAt)}
                          </span>
                        </div>

                        {isOwnMessage && (
                          <img
                            src={
                              authUser.profilePic ||
                              `https://i.pravatar.cc/150?u=${authUser._id}`
                            }
                            alt={authUser.username}
                            className="w-8 h-8 rounded-full ring-2 ring-white"
                          />
                        )}
                      </div>
                    );
                  })
              )}
            </div>


            {/* Form */}
            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
              {previewUrl && (
                <div className="relative max-w-[200px]">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="rounded-md shadow"
                  />
                  <button
                    type="button"
                    onClick={handleDiscardImage}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <label
                  htmlFor="image-upload"
                  className="btn btn-square btn-sm bg-base-200 hover:bg-base-300 border border-gray-300"
                  title="Attach image"
                >
                  📷
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-gray-500 text-center m-auto">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
