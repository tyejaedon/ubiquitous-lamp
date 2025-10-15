import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";


const DonationModal = ({ event, onClose }) => {
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState(""); // Auto-filled if user is logged in
    const [user, setUser] = useState(null); // Assuming user state is stored
    const [organizationId, setOrganizationId] = useState(1); // Example ID
      const [token, setToken] = useState(localStorage.getItem("token"));
      
    
    useEffect(() => {
      // Fetch logged-in user data if available
      axios.get("https://tyjaedon.me/api/user",      
        {headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    },{ withCredentials: true })
        .then(response => {
          if (response.data) {
            setUser(response.data);
            setPhone(response.data.phone_number); // Auto-fill phone number
          }
        })
        .catch(error => console.log("User not logged in"));
    }, []);
    
    const handleDonate = async () => {
      try {
        const payload = {
          organization_id: organizationId,
          amount: parseFloat(amount),
        };
    
        // Add user_id only if user is logged in
        if (user) {
          payload.user_id = user.id;
          payload.phone = user.phone_number; // Send phone number
        } else {
          payload.phone = phone; // Use entered phone number
        }
    
        const response = await fetch("https://tyjaedon.me/api/donate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) throw new Error("Donation failed");
    
        alert("Donation successful!");
        setAmount(""); // Reset form
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to process donation.");
      }
    };

  

  return (
    <div className="popup-modal-overlay">
      <div className="popup-modal-content">
        <h2>Donate</h2>
        <p><strong>Organization:</strong> {event.name}</p>
        <p><strong>Cause:</strong> {event.summary}</p>
        <p><strong>Send to:</strong> +254 712 345 678</p>

        <form onSubmit={handleDonate}>
          <label>Phone Number:</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Donation Amount (KES):</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button type="submit" className="popup-submit-btn">
            Complete Donation
          </button>
        </form>

        <button className="popup-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DonationModal;
