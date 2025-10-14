import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import pfp from "../assets/pfp.png"; // Default profile image

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',  // Add phoneNumber here
    
   
  });

  const tableHeaderStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontWeight: "bold",
  };
  
  const tableRowStyle = {
    borderBottom: "1px solid #ddd",
  };
  
  const tableCellStyle = {
    padding: "10px",
    border: "1px solid #ddd",
  };

  const statusIcons = {
    pending: "⏳", // Hourglass
    approved: "✅", // Check mark
    rejected: "❌", // Cross mark
  };

  const fetchprofile = () => {
    fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then(async (res) => {
        console.log("Response:", res);
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {

        if (!data.user) {
          throw new Error("Invalid user data");
        }
        const { user, profile } = data;
        setUser({ ...user, ...profile });
        setLoading(false);
      })
      .catch((err) => {

        console.error("Profile fetch error:", err.message);

        setLoading(false);
        navigate("/login");
      });
    }
    
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log("No token found. Redirecting to login.");

      navigate("/login");
      return;
    }
    setLoading(true); // Start loading before making the request
    fetchprofile();
   
  }, [token]);

 useEffect(() => {

    const fetchDonations = () =>{
      setToken(localStorage.getItem("token"));
      console.log("Token:", token);
    fetch("/api/donations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (!data) {
          setDonations([]);
        }
        setDonations(data);
        console.log("Donations:", data);
      })
      .catch((err) => {
        console.error("Donation fetch error:", err.message);
      });
    }
    fetchDonations();
      const interval = setInterval(fetchDonations, 5000);

      // Cleanup on unmount
      return () => clearInterval(interval);
  }, [token]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {  // file is truthy if a file is selected
      setFormData((prev) => {
        return { ...prev, profilePhoto: file };
      });
    }
  };


  const handleSave = () => {

    const jsonData = {};

    // Only add fields to the JSON if they have values (not null or undefined)
    if (formData.firstName) jsonData.firstName = formData.firstName;
    if (formData.lastName) jsonData.lastName = formData.lastName;
    if (formData.phoneNumber) jsonData.phone = formData.phoneNumber;
  
    // If there's a profile photo, append it as well
    if (formData.profilePhoto) {
      jsonData.profilePhoto = formData.profilePhoto;
    }
  
    const Datasent = new FormData();
    Datasent.append('profilePhoto',formData.profilePhoto);
    Datasent.append('JSON',JSON.stringify(jsonData))
    

  // If a profile photo is present, append it to FormData
 
    fetch("/api/profile/update", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: Datasent,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then((data) => {
        console.log("Profile update success:", data);
        setEditing(false);
        fetchprofile();
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',  // Add phoneNumber here
          profilePhoto: null,
      })})
      .catch((err) => console.error("Profile update error:", err));
  };



  if (loading) return <p>Loading...</p>;

 const total_donations = () =>{
    if(donations.length > 0){
      let total = 0;
      donations.map((donation) => {
        total += parseInt(donation.amount);
        console.log(total);
      });
      return total;
    }else{
      return 0;
    }
 }

  

    

  // Achievements system with safe fallback
  const defaultAchievements = [
    { title: "Welcome!", description: "Signed up successfully", icon: "🎉" },
    { title: "First Donation", description: "Donated for the first time", icon: "💰" },
    { title: "Generous Giver", description: "Donated over KES 1000", icon: "🏆" },
    { title: "Community Hero", description: "Donated to 5+ causes", icon: "🌟" },
    { title: "Super Donor", description: "Donated over KES 5000", icon: "🔥" },
  ];

  const achievementsList = defaultAchievements.map((ach) => ({
    ...ach,
    earned: user.achievements ? user.achievements.includes(ach.title) : false, // Lock all if achievements are null
  }));

  return (
    <div className="dashboard-container">
      {/* Profile Section */}
      <div className="profile-section">
        <img src={user.profile_image === null ? pfp : user.profile_image} alt="Profile" className="profile-photo" />


        {editing ? (
          <>
            <div className="dashboard-form-container">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="dashboard-input" placeholder="First Name" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="dashboard-input" placeholder="Last Name" />
              <input type="text" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} className="dashboard-input" placeholder="Phone Number" />
              <input type="file" onChange={handleFileChange} accept="image/*" className="dashboard-file-input" />

              <div className="dashboard-button-container">
                <button className="dashboard-save-btn" onClick={handleSave}>Save</button>
                <button className="dashboard-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>

          </>
        ) : (
          <>
            <h2>{user.first_name} {user.last_name}</h2>
            <p> <b>Phone Number: </b>  {user.phone_number}</p>
            <p> <b>Email: </b> {user.email}</p>
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
            
          </>

        )}
        <button className="logout-btn" onClick={() => {
        localStorage.clear();
          navigate("/login");
        }}>Logout</button>
      </div>

      {/* Donations Section */}
      <div className="donations-section">
  <h2>Your Donations</h2>
  {donations.length ?(
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={tableHeaderStyle}>Organization</th>
              <th style={tableHeaderStyle}>Amount ($)</th>
              <th style={tableHeaderStyle}>Usage of Funds</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} style={tableRowStyle}>
                <td style={tableCellStyle}>{donation.organisation_name}</td>
                <td style={tableCellStyle}>${donation.amount}</td>
                <td style={tableCellStyle}>{donation.usage_of_funds}</td>
                <td style={tableCellStyle}>{new Date(donation.donated_at).toLocaleDateString()}</td>
                <td style={{ ...tableCellStyle, fontWeight: "bold" }}>
                  {statusIcons[donation.status] || "❓ Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
    <p>No donations made yet.</p>
  )}
  <h3>Total Donated: KES {total_donations()}</h3>
</div>


      {/* Achievements Section */}
      <div className="achievements-section">
        <h2>Your Achievements</h2>
        <div className="achievements-grid">
          {achievementsList.map((ach, index) => (
            <div
              key={index}
              className={`achievement-card ${ach.earned ? "earned" : "locked"}`}
            >
              <span className="achievement-icon">{ach.icon}</span>
              <h3>{ach.title}</h3>
              <p>{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
