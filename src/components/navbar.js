import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect } from "react";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState("Login");
  const [token, setToken] = useState(null);
  const [path, setPath] = useState(token ? "/dashboard" : "/login");
  
  const user = JSON.parse(localStorage.getItem("user")) || {};


 

  useEffect(() => {
    const checkAuth = () => {

      const storedToken = localStorage.getItem("token");
      
      setToken(storedToken);
      if (storedToken) {
        setIsAuthenticated(true);
        setContent("Dashboard");
        setPath(user === "admin" ? "/admin_dashboard" : "/dashboard");
      } else {
        setIsAuthenticated(false);
        setContent("Login");
        setPath("/login");
      }
    };

    // Run checkAuth initially
    checkAuth();

    // Listen for changes in localStorage
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Optional: Polling for token changes (if storage event doesn't trigger)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user, token]);


  return (
    <nav className="navbar">
        <div className="flex">

      
        <img src={logo} alt="Logo" className="logo" />
      <h1 className="title">Change Mtaa Initiative</h1>
      </div>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰ {/* Hamburger icon */}
      </div>
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
      <div className="close-btn" onClick={() => setMenuOpen(false)}>✖</div>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link></li>
        <li><Link to="/accountability" onClick={() => setMenuOpen(false)}>Accountability</Link></li>
        <li><Link to="/donations" onClick={() => setMenuOpen(false)}>Donations</Link></li>
        {isAuthenticated ? (
          <li><Link to= {path} onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
        ) : (
          <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
