import React from "react";

const AboutUs = () => {
  return (
    <section className="about-container">
      <div className="about-content">
        <h2 className="about-title">About Change Mtaa Initiative</h2>
        <p className="about-description">
          <strong>Change Mtaa Initiative CBO</strong> is a non-profit, community-based organization 
          dedicated to addressing the challenges affecting our society at the grassroots level. 
          Our mission is to eradicate poverty and drive positive social changes.
        </p>

        <div className="about-list">
          <h3>Our Focus Areas:</h3>
          <ul>
            <li>Education of children in skills training.</li>
            <li>Economic empowerment and awareness against HIV/AIDS and drug abuse among youths.</li>
            <li>
              Creating a platform for members to share views on policy changes, 
              promote leadership advocacy, and ensure responsible use of public resources.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
