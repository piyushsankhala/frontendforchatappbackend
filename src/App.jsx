import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchWithRefresh } from "./utils/fetchwithrefreshtoken";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UserList from "./pages/userlist";
import Chatroom from "./pages/chatroom";
import { use } from "react";


export default function App() {
   const [currentuser, setcurrentuser] = useState(null);
   const getcurrentuser = async () => {
       try { 
         const response = await fetchWithRefresh("https://chatappbackend-fwrn.onrender.com/api/user/me", {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         });
   
         if (!response.ok) throw new Error("Failed to fetch current user");
   
         const data = await response.json();
         setcurrentuser(data.data);
         console.log("Current User:", data);
       }catch (error) {
         console.error("Error fetching current user:", error); 
       }
     }
     useEffect(() => {
       getcurrentuser();
     }, []);

  return (
    <Routes>
      <Route
  path="/"
  element={
    currentuser ? (
      <Navigate to="/users" replace />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path ="/users" element = {<UserList/>}  /> 
      <Route path ="/chat/:id" element =  {<Chatroom/>}  />
      
    </Routes>
  );
}
