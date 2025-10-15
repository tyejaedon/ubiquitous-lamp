import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignupSection = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    setToken(token);
  }
}, []);
  // State for error message
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await fetch("https://tyjaedon.me/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      setToken(data.token); // Update token state

      // Redirect to dashboard after signup
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      {/* Right Side - Form Section */}
      <div className="signup-form">
        <h2>Join the Change</h2>
        <p className="signup-text">
          Sign up to track your donations, see impact stories, and earn contribution badges.
        </p>

        {error && <p className="error-message">{error}</p>}

        {token ? <h2 className="thank-you">signup successful, thank you for joining the Initiative</h2> : <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        
        
}

       {token ? "" : <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
}
      </div>
    </div>
  );
};

export default SignupSection;
