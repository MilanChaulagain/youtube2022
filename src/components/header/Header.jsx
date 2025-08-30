import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Bed, Plane, Menu } from "lucide-react";
import "./header.css";
import {
  FaLocationArrow,
  FaMoneyBill,
  FaPersonBooth,
  FaCalendarAlt,
  FaLightbulb,
} from "react-icons/fa";
import { id } from "date-fns/locale";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentSection = pathSegments[0]?.toLowerCase() || 'home';

  const navItems = [
    { id: "home", icon: <Home className="nav-icon" />, label: "Home", href: "/" },
    { id: "places", icon: <FaLocationArrow className="nav-icon" />, label: "Places", href: "/places" },
    { id: "stays", icon: <Bed className="nav-icon" />, label: "Stays", href: "/stays" },
    { id: "flights", icon: <Plane className="nav-icon" />, label: "Flights", href: "/flights" },
    { id: "money-exchange", icon: <FaMoneyBill className="nav-icon" />, label: "Money Exchange", href: "/money-exchange" },
    { id: "touristguide", icon: <FaPersonBooth className="nav-icon" />, label: "Tourist Guide", href: "/touristguide" },
    {
      id: "more",
      label: "More",
      submenu: [
        { id: "events", icon: <FaLightbulb className="nav-icon" />, label: "Events", href: "/events" },
        { id: "calendar", icon: <FaCalendarAlt className="nav-icon" />, label: "Nepali Calendar", href: "/calendar" },
      ]
    }
  ];

  const promoContent = {
    home: {
      title: "A lifetime of discounts? It's Genius.",
      desc: "Get rewarded for your travels – unlock instant savings of 10% or more with a free yatraNepal account.",
    },
    places: {
      title: "Discover the best places to visit in Nepal.",
      desc: "Explore top destinations, hidden gems, and local favorites with personalized recommendations.",
    },
    stays: {
      title: "Find your perfect stay.",
      desc: "Browse hotels, resorts, and more at the best prices with flexible booking options.",
    },
    flights: {
      title: "Take off with the best deals.",
      desc: "Compare hundreds of airlines and get the lowest fares for your next trip.",
    },
    "money-exchange": {
      title: "Save on every exchange.",
      desc: "Get rewarded for your exchanges – unlock instant savings of 10% or more with a free MoneyExchange account.",
    },
    touristguide: {
      title: "Explore Nepal like a local.",
      desc: "Get personalized recommendations for your next trip.",
    },
    events: {
      title: "Never miss an event in Nepal.",
      desc: "Get updates on local festivals, concerts, and cultural celebrations.",
    },
    calendar: {
      title: "Check Nepali Calendar and Events.",
      desc: "Explore Nepali events and cultural highlights in one place.",
    },
    traveltips: {
      title: "Essential travel tips for Nepal.",
      desc: "From safety to etiquette – be well-prepared before you go.",
    },
    culture: {
      title: "Immerse in Nepali culture.",
      desc: "Understand traditions, cuisine, and customs across the country.",
    },
  };

  const { title, desc } = promoContent[currentSection] || promoContent.home;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setOpenDropdown(null);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleMouseEnter = (id) => {
    if (!isMobile) {
      setOpenDropdown(id);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpenDropdown(null);
    }
  };

  return (
    <div className="travel-header">
      <div className="header-container">
        {isMobile && (
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <Menu size={28} className="nav-icon" />
            <span className="nav-text">Menu</span>
          </button>
        )}

        <nav className={`nav-container ${isMenuOpen ? "open" : ""}`}>
          {navItems.map((item) =>
            item.submenu ? (
              <div
                key={item.id}
                className={`nav-dropdown ${openDropdown === item.id ? "active" : ""}`}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="dropdown-label"
                  onClick={() => isMobile && toggleDropdown(item.id)}
                >
                  <span className={`nav-link ${currentSection === item.id ? "active" : "inactive"}`}>
                    {item.icon || <span className="nav-icon-placeholder" />}
                    <span className="nav-text">{item.label}</span>
                  </span>
                  <span className="dropdown-arrow"></span>
                </div>
                <div className={`dropdown-content ${openDropdown === item.id ? "show" : ""}`}>
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.id}
                      to={sub.href}
                      className={`nav-link ${currentSection === sub.id ? "active" : "inactive"}`}
                      onClick={toggleMenu}
                    >
                      {sub.icon}
                      <span className="nav-text">{sub.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.id}
                to={item.href}
                className={`nav-link ${currentSection === item.id ? "active" : "inactive"}`}
                onClick={isMobile ? toggleMenu : undefined}
              >
                {item.icon}
                <span className="nav-text">{item.label}</span>
              </Link>
            )
          )}
        </nav>

        <div className="promo-text">
          <h1 className="promo-title">{title}</h1>
          <p className="promo-desc">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default Header;