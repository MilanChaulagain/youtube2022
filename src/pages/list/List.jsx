"use client"
import React from "react"
import { useState } from "react"
import "./list.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useLocation, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { DateRange } from "react-date-range"
import useFetch from "../../hooks/useFetch"
import { Calendar, DollarSign, Users, Home, MapPin, Search } from "lucide-react"

const List = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [destination, setDestination] = useState(location.state.destination)
  const [dates, setDates] = useState(location.state.dates)
  const [openDate, setOpenDate] = useState(false)
  const [options] = useState(location.state.options)
  const [min, setMin] = useState(undefined)
  const [max, setMax] = useState(undefined)

  const [url, setUrl] = useState(`/hotels?city=${destination}&min=${min || 1000}&max=${max || 15000}`)

  const { data, loading, error, refetch } = useFetch(url)

  const handleClick = () => {
    setUrl(`/hotels?city=${destination}&min=${min || 1000}&max=${max || 15000}`)
    refetch()
  }

  return (
    <div className="list-page">
      <Navbar />
      <Header type="list" />

      <div className="container">
        <div className="search-container">
          <h2>Find your perfect stay</h2>

          <div className="search-form">
            <div className="search-row">
              <div className="search-group">
                <div className="search-icon">
                  <MapPin size={18} />
                </div>
                <div className="search-input-wrapper">
                  <label>Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                  />
                </div>
              </div>

              <div className="search-group">
                <div className="search-icon">
                  <Calendar size={18} />
                </div>
                <div className="search-input-wrapper">
                  <label>Check-in & Check-out</label>
                  <div className="date-picker-trigger" onClick={() => setOpenDate(!openDate)}>
                    {`${format(dates[0].startDate, "MMM dd, yyyy")} - ${format(dates[0].endDate, "MMM dd, yyyy")}`}
                  </div>
                  {openDate && (
                    <div className="date-picker-dropdown">
                      <DateRange onChange={(item) => setDates([item.selection])} minDate={new Date()} ranges={dates} />
                    </div>
                  )}
                </div>
              </div>

              <div className="search-group">
                <div className="search-icon">
                  <DollarSign size={18} />
                </div>
                <div className="search-input-wrapper price-inputs">
                  <label>Price Range</label>
                  <div className="price-range">
                    <input type="number" onChange={(e) => setMin(e.target.value)} placeholder="Min" />
                    <span className="price-separator">-</span>
                    <input type="number" onChange={(e) => setMax(e.target.value)} placeholder="Max" />
                  </div>
                </div>
              </div>

              <div className="search-group">
                <div className="search-icon">
                  <Users size={18} />
                </div>
                <div className="search-input-wrapper">
                  <label>Guests</label>
                  <div className="guests-summary">
                    {options.adult} adults · {options.children} children · {options.room} rooms
                  </div>
                </div>
              </div>
            </div>

            <button className="search-button" onClick={handleClick}>
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>

        <div className="results-container">
          <div className="results-header">
            <h2>{destination} accommodations</h2>
            <p>{data?.length || 0} properties found</p>
          </div>

          <div className="results-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Finding the best stays for you...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>Sorry, we couldn't fetch the available properties. Please try again.</p>
              </div>
            ) : data && data.length > 0 ? (
              data.map((item) => (
                <div className="hotel-card" key={item._id}>
                  <div className="hotel-image">
                    <img src={item.photos[0] || "/placeholder.svg?height=200&width=300"} alt={item.name} />
                    {item.featured && <span className="featured-tag">Featured</span>}
                  </div>
                  <div className="hotel-content">
                    <div className="hotel-info">
                      <h3>{item.name}</h3>
                      <div className="hotel-location">
                        <MapPin size={14} />
                        <span>{item.city}</span>
                      </div>
                      <div className="hotel-features">
                        {item.distance && (
                          <span className="feature">
                            <span className="feature-value">{item.distance}m</span> from center
                          </span>
                        )}
                        {item.free_airport_taxi && <span className="feature">Free airport taxi</span>}
                        {item.free_cancellation && <span className="feature">Free cancellation</span>}
                      </div>
                      <p className="hotel-description">{item.desc?.substring(0, 100)}...</p>
                    </div>
                    <div className="hotel-pricing">
                      <div className="rating-container">
                        <div className="rating-text">
                          <span>{item.rating_text || "Excellent"}</span>
                          <span className="reviews-count">{item.review_count || "24"} reviews</span>
                        </div>
                        <div className="rating-score">{item.rating || "8.9"}</div>
                      </div>
                      <div className="price-container">
                        <span className="price">Rs.{item.cheapestPrice}</span>
                        <span className="price-note">per night</span>
                      </div>
                      <button
                        className="view-deal-button"
                        onClick={() => navigate(`/hotels/${item._id}`)}
                      >
                        View Deal
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <Home size={48} />
                <h3>No properties found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default List
