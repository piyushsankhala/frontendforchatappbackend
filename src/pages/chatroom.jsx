import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchwithrefreshtoken";
import { useParams, useNavigate } from "react-router-dom";

export default function Chatroom() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const { id: recieverId } = useParams();
  const navigate = useNavigate();
  const [currentuser, setCurrentUser] = useState({});

  const fetchchat = async () => {
    try {
      const response = await fetchWithRefresh("http://localhost:3000/api/chat/acesschat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recieverid: recieverId }),
      });

      if (!response.ok) throw new Error("Failed to fetch chats");
      const data = await response.json();
      setChats(data.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetchWithRefresh("http://localhost:3000/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recieverId, content: message }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setMessage("");
      fetchchat();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const logout = async () => {
    try {
      const res = await fetchWithRefresh("http://localhost:3000/api/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        navigate("/login");
      } else {
        console.error("Failed to logout:", res.statusText);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await fetchWithRefresh("http://localhost:3000/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch current user");
      const data = await response.json();
      setCurrentUser(data.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    fetchchat();
    getCurrentUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-xl border border-white/30 text-white p-6 rounded-3xl shadow-2xl animate-fade-in flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Chat Room</h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 max-h-[450px] overflow-y-auto space-y-3 bg-white/10 p-4 rounded-xl border border-white/20 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
          {chats.messages?.length > 0 ? (
            chats.messages.map((msg) => {
              const isCurrentUser = msg.sender === currentuser._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow text-sm sm:text-base ${
                      isCurrentUser
                        ? "bg-white text-purple-800 rounded-br-none"
                        : "bg-purple-600 text-white rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-white/80">No messages yet.</p>
          )}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-white transition"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-white text-purple-800 font-semibold rounded-xl shadow hover:bg-purple-100 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
