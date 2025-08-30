// Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const dropdownRef = useRef();

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleProfileClick = () => navigate("/profile");
  // Add handler for My Booking
  const handleMyBookingClick = () => navigate("/bookings");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const menus = [
    {
      title: "Discover",
      items: [
        { label: "Travellers' Choice", path: "/travellers-choice" },
        { label: "Travel Stories", path: "/travel-stories" },
      ],
    },
    {
      title: "Trips",
      items: [
        { label: "View my trips", path: "/trips" },
        { label: "Start a new trip", path: "/trips" },
        { label: "Create a trip with AI", path: "/trips" },
      ],
    },
    {
      title: "Review",
      items: [
        { label: "Write a review", path: "/write-review" },
        { label: "View all reviews", path: "/reviews" },
      ],
    },
    {
      title: "Blog",
      items: [
        { label: "Write a Blog", path: "/write-blog" },
        { label: "View Blog", path: "/blog" },
      ],
    },
  ];

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo">yatraNepal</span>
        </Link>

        <nav className="navCenter">
          {menus.map((menu) => (
            <div
              key={menu.title}
              className={`navItemDropdown ${openMenu === menu.title ? "open" : ""}`}
            >
              <button className="navItemButton" onClick={() => toggleMenu(menu.title)}>
                {menu.title}
              </button>
              <div className="dropdownMenu">
                {menu.items.map((item) => (
                  <Link key={item.label} to={item.path} className="dropdownItem">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {user ? (
          <div className="navProfileWrapper" ref={dropdownRef}>
            <div className="navUserDisplay" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.img ? (
                <img src={user.img} alt="Profile" className="navUserAvatar" />
              ) : (
                <div className="navUserIcon">{getInitial(user.username)}</div>
              )}
            </div>
            {dropdownOpen && (
              <div className="navDropdown">
                {/* Updated My Booking button with handler */}
                <button onClick={handleMyBookingClick}>My Booking</button>
                <button onClick={handleProfileClick}>View Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton" onClick={handleRegisterClick}>
              Register
            </button>
            <button className="navButton" onClick={handleLoginClick}>
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;