import React from "react";
import SignupSection from "../components/login";
import change from "../assets/change.jpeg";
import manager1 from "../assets/manager1.jpeg";
import manager2 from "../assets/manager2.jpg";
import manager3 from "../assets/manager3.jpeg";

const boardMembers = [
  { name: "John Doe", role: "Founder & CEO", image: manager1 },
  { name: "Jane Smith", role: "Finance Director", image: manager2 },
  { name: "Michael Lee", role: "Operations Manager", image: manager3 },
];

const AccountabilityPage = () => {
  return (
    <div className="accountability-container">
      {/* Why Donate Section */}
      <div className="flex-container">
      <section className="why-donate">
        <h1 className="section-title">Why Should You Donate?</h1>
        <p className="donate-text">
          Your donation creates real change. Whether it's feeding the hungry, educating children, or providing medical aid, your contribution transforms lives.
        </p>
        <div className="signup-image">
        <img
          src={change}
          alt="Make an Impact"
          className="impact-image"
        />
      </div>
      </section>

      {/* Signup/Login Section */}
      <section className="accountability-system">
        <h2 className="section-title">Our Dynamic Accountability System</h2>
        <p className="accountability-text">
          We provide a **transparent tracking system** where donors can see how their money is used. Every donation is tracked, ensuring it reaches the right cause.
        </p>
        <SignupSection />
        
      </section>
        </div>

      {/* Achievements Section */}
      <section className="achievements">
        <h2 className="section-title">Donor Achievements & Accolades</h2>
        <p>Earn badges as you contribute more!</p>
        <div className="badges">
          <div className="badge">🌟 Bronze Donor (First Donation)</div>
          <div className="badge">🥈 Silver Donor ($500 Donated)</div>
          <div className="badge">🥇 Gold Donor ($1000+ Donated)</div>
        </div>
      </section>

      {/* Board of Managers Section */}
      <section className="board-managers">
        <h2 className="section-title">Meet Our Leadership Team</h2>
        <div className="managers-grid">
          {boardMembers.map((member, index) => (
            <div key={index} className="manager-card">
              <img src={member.image} alt={member.name} className="manager-img" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AccountabilityPage;
