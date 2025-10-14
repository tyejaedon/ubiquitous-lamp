import React, { useState, useEffect } from "react";
import axios from "axios";

const DonationProgress = () => {
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(10000); // Default goal in case API fails
  const [loading, setLoading] = useState(true);

  // Fetch donation data from API
  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const response = await axios.get("/api/donation-progress");
        const { donation_total, goal } = response.data;

        setDonatedAmount(donation_total);
        setGoalAmount(goal);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donation progress:", error);
        setLoading(false);
      }
    };

    fetchDonationData();

    // Refresh donation progress every 10 seconds
    const interval = setInterval(fetchDonationData, 10000);

    return () => clearInterval(interval);
  }, []);

  // Calculate donation progress percentage
  const donationPercentage = goalAmount > 0 ? Math.min((donatedAmount / goalAmount) * 100, 100) : 0;

  if (loading) return <p>Loading donation progress...</p>;

  return (
    <div className="donation-progress-container">
      <h2 className="progress-title">Live Donation Progress</h2>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${donationPercentage}%` }}></div>
      </div>
      <p className="progress-text">
        KES {donatedAmount.toLocaleString()} raised out of KES {goalAmount.toLocaleString()}
      </p>
    </div>
  );
};

export default DonationProgress;
