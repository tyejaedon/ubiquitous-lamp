import React from "react";
import mpesa from "../assets/mpesa.png";
import DonationProgress from "../components/donationbar";

const DonationPage = () => {
  return (
    <div className="donation-container">
      <DonationProgress/>

      {/* Top Section - Call to Action */}
      <div className="donation-header">
        <h1>Make a Difference with M-Pesa</h1>
        <p>
          Your donation helps provide food, education, and medical care for those in need.
          Every amount counts. Support our mission today!
        </p>
      </div>

      {/* Donation Box */}
      <div className="donation-box">
        <h2>Donate via M-Pesa</h2>
        <p>Use the button below to proceed with your donation.</p>
        
        {/* M-Pesa Link */}
        <a href="https://www.safaricom.co.ke/personal/m-pesa" target="_blank" rel="noopener noreferrer">
          <button className="mpesa-btn">
            <img src={mpesa} alt="M-Pesa" className="mpesa-logo" />
            Donate via M-Pesa
          </button>
        </a>
      </div>
    </div>
  );
};

export default DonationPage;
