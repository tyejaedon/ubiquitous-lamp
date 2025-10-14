import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Change Mtaa Initiative is dedicated to making a positive impact in communities by supporting local projects and empowering individuals.</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p><Link to="/events">Events</Link></p>
          <p><Link to="/donations">Donations</Link></p>
          <p><Link to="/accountability">Accountability</Link></p>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@changemtaa.org</p>
          <p>Phone: +254 700 123 456</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <p>© {new Date().getFullYear()} Change Mtaa Initiative. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
