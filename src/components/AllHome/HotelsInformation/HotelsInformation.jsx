"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HotelsInformation.css";

const ChevronLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
);

const ChevronRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
);

const MapPin = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const Star = ({ filled }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={filled ? "#fbbf24" : "none"}
        stroke="#fbbf24"
        strokeWidth="2"
    >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
);

function NepalHotelCarousel() {
    const [hotels, setHotels] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const hotelsPerPage = 3;
    const totalPages = Math.ceil(hotels.length / hotelsPerPage);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch hotels from your API and limit to 9
        const fetchHotels = async () => {
            try {
                const res = await axios.get("http://localhost:8800/api/hotels");
                setHotels(res.data.slice(0, 9)); // only first 9 hotels
            } catch (error) {
                console.error("Failed to fetch hotels:", error);
            }
        };

        fetchHotels();
    }, []);

    const nextPage = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    };

    const getCurrentHotels = () => {
        const startIndex = currentPage * hotelsPerPage;
        return hotels.slice(startIndex, startIndex + hotelsPerPage);
    };

    const renderStars = (rating) => {
        if (!rating) return null; // if no rating, return nothing or you can show empty stars if preferred

        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} filled={true} />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Star key={i} filled={true} />);
            } else {
                stars.push(<Star key={i} filled={false} />);
            }
        }
        return stars;
    };

    const getCityClass = (city) => {
        if (city === "Kathmandu") return "city-kathmandu";
        if (city === "Lalitpur") return "city-lalitpur";
        if (city === "Bhaktapur") return "city-bhaktapur";
        return "city-default";
    };

    const formatPrice = (price) => {
        if (!price) return "Price N/A";
        return `Rs. ${price.toLocaleString()}/night`;
    };

    const getAmenities = (hotelName) => {
        const amenitiesMap = {
            "Grand Hotel Kathmandu": ["Luxury", "Pool", "Spa"],
            "Vivanta Kathmandu": ["Business", "Restaurant", "WiFi"],
            "Hotel Heritage": ["Heritage", "Culture", "Traditional"],
            "Hyatt Regency Kathmandu": ["5-Star", "Casino", "Conference"],
            "Hotel Himalaya": ["Mountain View", "Garden", "Restaurant"],
            "Peacock Guest House": ["Budget", "Cozy", "Local"],
            "Gokarna Forest Resort": ["Nature", "Golf", "Resort"],
            "Summit Hotel": ["Valley View", "Business", "Modern"],
            "Tulaja Boutique Hotel": ["Boutique", "Art", "Elegant"],
        };
        return amenitiesMap[hotelName] || ["Comfort", "Service", "Clean"];
    };

    return (
        <div className="main-container">
            <div className="header-section">
                <h1 className="main-title">Enjoy a Luxury Stay with us.</h1>
                <p className="main-subtitle">
                    Book this exclusive collection of luxury hotels in Kathmandu Valley and enjoy a luxurious stay.
                </p>
            </div>

            <div className="carousel-container">
                <button onClick={prevPage} className="navigation-button">
                    <ChevronLeft />
                </button>

                <div className="hotels-container">
                    {getCurrentHotels().map((hotel) => (
                        <div key={hotel._id || hotel.id} className="hotel-item">
                            <div className="hotel-image-section">
                                <img
                                    src={hotel.photos?.[0] || hotel.image || "/placeholder.svg"}
                                    alt={hotel.name}
                                    className="hotel-photo"
                                    onError={(e) => {
                                        e.target.src = "/placeholder.svg?height=300&width=400";
                                    }}
                                />
                                <div className="rating-container">
                                    <div className="stars-wrapper">{renderStars(hotel.rating)}</div>
                                    <span className="rating-number">{hotel.rating ? hotel.rating.toFixed(1) : "N/A"}</span>
                                </div>
                                <div className={`city-label ${getCityClass(hotel.city)}`}>{hotel.city}</div>
                            </div>

                            <div className="hotel-details">
                                <div className="hotel-title-section">
                                    <h3 className="hotel-title">{hotel.name}</h3>
                                    <div className="price-display">{formatPrice(hotel.cheapestPrice)}</div>
                                </div>

                                <div className="location-section">
                                    <MapPin />
                                    <p className="location-text">{hotel.city}, Nepal</p>
                                </div>

                                <div className="features-section">
                                    {getAmenities(hotel.name).map((amenity, idx) => (
                                        <span key={idx} className="feature-item">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    className="booking-button"
                                    onClick={() => navigate(`/hotels/${hotel._id || hotel.id}`)}
                                >
                                    <span>Book Now</span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7,7 17,7 17,17"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={nextPage} className="navigation-button">
                    <ChevronRight />
                </button>
            </div>

            <div className="pagination-section">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`pagination-item ${index === currentPage ? "pagination-active" : ""}`}
                    />
                ))}
            </div>

            <div className="page-information">
                <span className="page-details">
                    Page {currentPage + 1} of {totalPages} • Showing {getCurrentHotels().length} hotels from Kathmandu Valley
                </span>
            </div>
        </div>
    );
}

export default NepalHotelCarousel;
