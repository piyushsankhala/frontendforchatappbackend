import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../utils/fetchwithrefreshtoken";

export default function UserList() {
  const [users, setusers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetchWithRefresh("https://chatappbackend-fwrn.onrender.com/api/user/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Ensure cookies are sent with the request
      });

      if (res.ok) {
        const data = await res.json();
        setusers(data.data);
      } else {
        console.error("Failed to fetch users:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startchat = async (userId) => {
    try {
      const res = await fetchWithRefresh("https://chatappbackend-fwrn.onrender.com/api/chat/createchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recieverid: userId }),
      });

      if (res.ok) {
        navigate(`/chat/${userId}`);
      } else {
        console.error("Failed to start chat:", res.statusText);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const logout = async () => {
    try {
      const res = await fetchWithRefresh("https://chatappbackend-fwrn.onrender.com/api/user/logout", {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl text-white animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Available Users</h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {users.length === 0 ? (
          <p className="text-center text-white/80">No users found.</p>
        ) : (
          <ul className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
            {users.map((user) => (
  <li
    key={user._id}
    onClick={() => startchat(user._id)}
    className="relative p-4 bg-white/30 rounded-xl hover:bg-white/40 cursor-pointer transition duration-200 text-white font-medium"
  >
    {user.email}

    {user.messageindicator && (
      <span className="absolute top-2 right-4 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
    )}
  </li>
))}

          </ul>
        )}
      </div>
    </div>
  );
}
