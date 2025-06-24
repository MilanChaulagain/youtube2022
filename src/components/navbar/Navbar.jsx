import React, { useContext, useState, useRef, useEffect } from 'react';
import "./navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const handleLoginClick = () => navigate('/login');
  const handleRegisterClick = () => navigate('/register');

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfileClick = () => navigate("/profile");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo">yatraNepal</span>
        </Link>
        
        {user ? (
          <div className="navProfileWrapper" ref={dropdownRef}>
            <div
              className="navUserDisplay"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.img ? (
                <img src={user.img} alt="Profile" className="navUserAvatar" />
              ) : (
                <div className="navUserIcon">{getInitial(user.username)}</div>
              )}
            </div>
            {dropdownOpen && (
              <div className="navDropdown">
                <button onClick={handleProfileClick}>View Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton" onClick={handleRegisterClick}>Register</button>
            <button className="navButton" onClick={handleLoginClick}>Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;