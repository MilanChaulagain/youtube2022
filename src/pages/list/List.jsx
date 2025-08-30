"use client"
import React, { useState } from "react"
import "./list.css"
import Navbar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import { useLocation, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { DateRange } from "react-date-range"
import useFetch from "../../hooks/useFetch"
import {
  Calendar,
  DollarSign,
  Users,
  Home,
  MapPin,
  Search,
  Star,
  Heart,
  Plane,
  CheckCircle,
  RefreshCw,
  XCircle,
  ArrowRight,
  Map
} from "lucide-react"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

const List = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [destination, setDestination] = useState(location.state.destination)
  const [dates, setDates] = useState(location.state.dates)
  const [openDate, setOpenDate] = useState(false)
  const [options] = useState(location.state.options)
  const [min, setMin] = useState(undefined)
  const [max, setMax] = useState(undefined)
  const [favorites, setFavorites] = useState(new Set())

  const [url, setUrl] = useState(`/hotels?city=${destination}&min=${min || 1000}&max=${max || 15000}`)

  const { data, loading, error } = useFetch(url)

  const handleClick = () => {
    setUrl(`/hotels?city=${destination}&min=${min || 1000}&max=${max || 15000}`)
  }

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="listPage">
      <Navbar />
      <Header type="list" />

      <div className="listContainer">
        <div className="searchPanel">
          <div className="searchHeader">
            <h1>Refine your search</h1>
            <p>Find the perfect accommodation for your trip</p>
          </div>

          <div className="searchFilters">
            <div className="filterGroup">
              <label>
                <MapPin size={18} className="filterIcon" />
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City or property name"
                className="modernInput"
              />
            </div>

            <div className="filterGroup">
              <label>
                <Calendar size={18} className="filterIcon" />
                Dates
              </label>
              <div
                className="dateDisplay"
                onClick={() => setOpenDate(!openDate)}
              >
                {`${format(dates[0].startDate, "MMM dd")} - ${format(dates[0].endDate, "MMM dd")}`}
              </div>
              {openDate && (
                <div className="datePickerWrapper">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    minDate={new Date()}
                  />
                </div>
              )}
            </div>

            <div className="filterGroup">
              <label>
                <DollarSign size={18} className="filterIcon" />
                Price range
              </label>
              <div className="priceRangeInputs">
                <input
                  type="number"
                  onChange={(e) => setMin(e.target.value)}
                  placeholder="Min"
                  className="modernInput"
                />
                <span className="rangeSeparator">
                  <ArrowRight size={16} />
                </span>
                <input
                  type="number"
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="Max"
                  className="modernInput"
                />
              </div>
            </div>

            <div className="filterGroup">
              <label>
                <Users size={18} className="filterIcon" />
                Guests & Rooms
              </label>
              <div className="guestSummary">
                {options.adult} adults • {options.children} children • {options.room} rooms
              </div>
            </div>

            <button className="searchButton" onClick={handleClick}>
              <Search size={18} />
              Update results
            </button>
          </div>
        </div>

        <div className="resultsSection">
          <div className="resultsHeader">
            <h2>
              Stays in <span className="highlight">{destination}</span>
            </h2>
            <p className="resultsCount">{data?.length || 0} properties found</p>
          </div>

          {loading ? (
            <div className="loadingState">
              <div className="loadingSpinner"></div>
              <p>Discovering amazing stays...</p>
            </div>
          ) : error ? (
            <div className="errorState">
              <XCircle size={48} className="errorIcon" />
              <p>We couldn't load properties. Please try again.</p>
              <button onClick={handleClick} className="retryButton">
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          ) : data && data.length > 0 ? (
            <div className="hotelsGrid">
              {data.map((hotel) => (
                <div className="hotelCard" key={hotel._id}>
                  <div className="hotelImageContainer">
                    <img
                      src={hotel.photos[0] || "/placeholder-hotel.jpg"}
                      alt={hotel.name}
                      className="hotelImage"
                    />
                    <button
                      className={`favoriteButton ${favorites.has(hotel._id) ? "active" : ""}`}
                      onClick={() => toggleFavorite(hotel._id)}
                    >
                      <Heart size={18} fill={favorites.has(hotel._id) ? "currentColor" : "none"} />
                    </button>
                    {hotel.featured && (
                      <div className="featuredBadge">
                        <Star size={12} fill="currentColor" />
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="hotelDetails">
                    <div className="hotelInfo">
                      <h3>{hotel.name}</h3>
                      <div className="location">
                        <MapPin size={14} />
                        <span>{hotel.city}</span>
                      </div>
                      <div className="amenities">
                        {hotel.distance && (
                          <span>
                            <Map size={12} />
                            {hotel.distance}m from center
                          </span>
                        )}
                        {hotel.free_airport_taxi && (
                          <span>
                            <Plane size={12} />
                            Free airport taxi
                          </span>
                        )}
                        {hotel.free_cancellation && (
                          <span>
                            <CheckCircle size={12} />
                            Free cancellation
                          </span>
                        )}
                      </div>
                      <p className="description">{hotel.desc?.substring(0, 120)}...</p>
                    </div>
                    <div className="hotelPricing">
                      <div className="rating">
                        <div className="ratingScore">
                          <Star size={14} fill="currentColor" />
                          {hotel.rating || "8.9"}
                        </div>
                        <span className="reviews">{hotel.review_count || "24"} reviews</span>
                      </div>
                      <div className="price">
                        <span className="amount">Rs. {hotel.cheapestPrice}</span>
                        <span className="perNight">/ night</span>
                      </div>
                      <button
                        className="viewButton"
                        onClick={() => navigate(`/hotels/${hotel._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <Home size={48} className="emptyIcon" />
              <h3>No properties match your search</h3>
              <p>Try adjusting your filters or search in a different area</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default List