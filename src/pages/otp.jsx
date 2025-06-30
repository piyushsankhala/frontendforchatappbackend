import react from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";


export default function Otp() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || "");
  const [password] = useState(location.state?.password || "");
  const [otp, setOtp] = useState("");

  const verifyAndRegister = async (e) => {
    e.preventDefault();

    // Step 1: Verify OTP
    const verifyRes = await fetch("https://chatappbackend-fwrn.onrender.com/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const verifyData = await verifyRes.json();

    if (verifyRes.ok) {
      // Step 2: Register the user after successful OTP
      const regRes = await fetch("https://chatappbackend-fwrn.onrender.com/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const regData = await regRes.json();

      if (regRes.status === 201) {
        alert("✅ Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert("❌ " + regData.message);
      }
    } else {
      alert("❌ " + verifyData.message);
    }
  };

 
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] p-4">
            <div className="w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 text-white p-10 rounded-3xl shadow-2xl animate-fade-in transition-all duration-500">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8">
                    Verify Your OTP
                </h2>
                
                    
                    <div>
                        <input
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            required
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-white/30 text-white placeholder-white/80 outline-none focus:ring-2 focus:ring-white transition"
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={verifyAndRegister}
                        className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
                    >
                        Verify OTP
                    </button>
                
            </div>
        </div>
    )
        
    
}
