import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import {
  ArrowLeft,
  ArrowRight,
  X,
  MapPin,
  Star,
  Calendar,
  Users,
  Plane,
  Check,
  Bed,
  Wifi,
  Coffee,
  Dumbbell,
  ParkingCircle,
  Utensils
} from "lucide-react";

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error } = useFetch(`/hotels/${id}`);
  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const calculateNights = () => {
    if (!dates?.[0]) return 1;
    const start = new Date(dates[0].startDate);
    const end = new Date(dates[0].endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();

  const calculateTotalPrice = () => {
    if (!data) return null;
    const pricePerNight = data.cheapestPrice ? Number(data.cheapestPrice) : 0;
    if (!dates || !options) return pricePerNight;
    const numberOfRooms = Number(options.room) || 1;
    return pricePerNight * numberOfRooms * nights;
  };

  const totalPrice = calculateTotalPrice();

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;
    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0 ? (data?.photos?.length || 1) - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === (data?.photos?.length || 1) - 1 ? 0 : slideNumber + 1;
    }
    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="hotel-page">
      <Navbar />
      <Header type="list" />
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading hotel details...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <X size={48} className="error-icon" />
          <p>Something went wrong loading this hotel!</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
      ) : (
        <div className="hotel-container">
          {open && data.photos && (
            <div className="image-slider">
              <X
                size={32}
                className="close-button"
                onClick={() => setOpen(false)}
              />
              <div
                className="nav-button left"
                onClick={() => handleMove("l")}
              >
                <ArrowLeft size={32} />
              </div>
              <div className="slider-content">
                <img
                  src={data.photos[slideNumber]}
                  alt={data.name}
                  className="slider-image"
                />
              </div>
              <div
                className="nav-button right"
                onClick={() => handleMove("r")}
              >
                <ArrowRight size={32} />
              </div>
            </div>
          )}
          <div className="hotel-content">
            <div className="hotel-header">
              <div className="title-section">
                <h1 className="hotel-title">{data.name}</h1>
                <div className="rating-badge">
                  <Star size={16} fill="currentColor" />
                  <span>{data.rating || "4.8"}</span>
                </div>
              </div>
              <div className="location-section">
                <MapPin size={18} />
                <span>{data.address}</span>
              </div>
              <div className="highlight-badges">
                <div className="highlight-badge">
                  <Plane size={14} />
                  <span>Free airport taxi</span>
                </div>
                <div className="highlight-badge">
                  <Check size={14} />
                  <span>Free cancellation</span>
                </div>
              </div>
            </div>
            <div className="hotel-gallery">
              {data.photos?.map((photo, i) => (
                <div
                  className="gallery-item"
                  key={i}
                  onClick={() => handleOpen(i)}
                >
                  <img
                    src={photo}
                    alt={`${data.name} view ${i + 1}`}
                    className="gallery-image"
                  />
                </div>
              ))}
            </div>
            <div className="hotel-details-grid">
              <div className="description-section">
                <h2 className="section-title">{data.title}</h2>
                <p className="hotel-description">{data.desc}</p>
                <div className="amenities-section">
                  <h3 className="amenities-title">Amenities</h3>
                  <div className="amenities-grid">
                    <div className="amenity-item">
                      <Wifi size={18} />
                      <span>Free WiFi</span>
                    </div>
                    <div className="amenity-item">
                      <Bed size={18} />
                      <span>Comfortable beds</span>
                    </div>
                    <div className="amenity-item">
                      <Coffee size={18} />
                      <span>Breakfast included</span>
                    </div>
                    <div className="amenity-item">
                      <ParkingCircle size={18} />
                      <span>Free parking</span>
                    </div>
                    <div className="amenity-item">
                      <Dumbbell size={18} />
                      <span>Fitness center</span>
                    </div>
                    <div className="amenity-item">
                      <Utensils size={18} />
                      <span>Restaurant</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="booking-section">
                <div className="booking-card">
                  <h3 className="price-title">
                    {totalPrice === null ? (
                      "Loading price..."
                    ) : (
                      <>
                        NPR {totalPrice.toLocaleString()}
                        <span className="price-subtitle">
                          {nights > 1 ? ` for ${nights} nights` : " for 1 night"}
                        </span>
                      </>
                    )}
                  </h3>
                  <div className="booking-details">
                    <div className="detail-item">
                      <Calendar size={16} />
                      <div>
                        <p className="detail-label">Check-in / Check-out</p>
                        <p className="detail-value">
                          {dates && dates[0] ? (
                            <>
                              {dates[0].startDate.toLocaleDateString()} - {dates[0].endDate.toLocaleDateString()}
                            </>
                          ) : (
                            "Select dates"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Users size={16} />
                      <div>
                        <p className="detail-label">Guests</p>
                        <p className="detail-value">
                          {options ? (
                            <>
                              {options.adult || 0} adults, {options.children || 0} children, {options.room || 1} room
                            </>
                          ) : (
                            "1 room"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="book-now-button"
                    onClick={handleClick}
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
    </div>
  );
};

export default Hotel;
