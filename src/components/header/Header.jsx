import React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Home,
  Bed,
  Plane,
  CarTaxiFront,
} from "lucide-react"
import "./header.css"
import { FaMoneyBill } from "react-icons/fa"

const Header = () => {
  const location = useLocation()

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentSection = pathSegments[0] || 'home'

  const navItems = [
    { id: "home", icon: <Home className="nav-icon" />, label: "Home", href: "/" },
    { id: "stays", icon: <Bed className="nav-icon" />, label: "Stays", href: "/stays" },
    { id: "flights", icon: <Plane className="nav-icon" />, label: "Flights", href: "/flights" },
    { id: "money-exchange", icon: <FaMoneyBill className="nav-icon" />, label: "Money Exchange", href: "/money-exchange" },
    { id: "attractions", icon: <Bed className="nav-icon" />, label: "Attractions", href: "/attractions" },
    { id: "taxis", icon: <CarTaxiFront className="nav-icon" />, label: "Airport Taxis", href: "/taxis" },
  ]

  const promoContent = {
    home: {
      title: "A lifetime of discounts? It's Genius.",
      desc: "Get rewarded for your travels – unlock instant savings of 10% or more with a free yatraNepal account.",
    },
    stays: {
      title: "Find your perfect stay.",
      desc: "Browse hotels, resorts, and more at the best prices with flexible booking options.",
    },
    flights: {
      title: "Take off with the best deals.",
      desc: "Compare hundreds of airlines and get the lowest fares for your next trip.",
    },
    money_exchange: {
      title: "Travel with confidence.",
      desc: "Secure and hassle-free travel with our money exchange service.",
    },
    attractions: {
      title: "Unforgettable experiences await.",
      desc: "Discover popular attractions, tours, and hidden gems wherever you go.",
    },
    taxis: {
      title: "Ride to and from the airport hassle-free.",
      desc: "Pre-book airport taxis for stress-free travel from doorstep to departure.",
    },
  }

  const { title, desc } = promoContent[currentSection] || promoContent.home

  return (
    <div className="travel-header">
      <div className="header-container">
        <nav className="nav-container">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`nav-link ${currentSection === item.id ? "active" : "inactive"
                }`}
            >
              {item.icon}
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="promo-text">
          <h1 className="promo-title">{title}</h1>
          <p className="promo-desc">{desc}</p>
        </div>
      </div>
    </div>
  )
}

export default Header