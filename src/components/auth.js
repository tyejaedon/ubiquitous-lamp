import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TokenChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // If no token, force login
        return;
      }

      try {
        const response = await axios.get("/api/auth/check-token", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          console.log("Token is valid");
        }
      } catch (error) {
        console.error("Token expired or invalid:", error.response?.data?.message);
        localStorage.removeItem("token"); // Remove expired token
        navigate("/login"); // Redirect to login
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default TokenChecker;
