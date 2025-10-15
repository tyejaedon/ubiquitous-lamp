import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("https://tyjaedon.me/api/admin/donations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDonations();
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch("https://tyjaedon.me/api/admin/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ donation_id: id, status: newStatus })
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation.id === id ? { ...donation, status: newStatus } : donation
          )
        );
      })
      .catch((error) => console.error("Error updating status:", error));
  };

  if (loading) return <p>Loading donations...</p>;

  return (
    <div>
      <h2>Admin Donations</h2>
      <div className="table-container">
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Donor</th>
            <th>Organization</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.id}</td>
              <td>{donation.donor_name}</td>
              <td>{donation.organisation_name}</td>
              <td>${donation.amount}</td>
              <td>{new Date(donation.donated_at).toLocaleDateString()}</td>
              <td>{donation.status}</td>
              <td>
                {donation.status !== "approved" && (
                  <button onClick={() => updateStatus(donation.id, "approved")}>
                    Approve
                  </button>
                )}
                {donation.status !== "rejected" && (
                  <button onClick={() => updateStatus(donation.id, "rejected")}>
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminDonations;
