"use client"
import React from "react"
import { useState } from "react"
import "./HotelsInformation.css"

const originalHotels = [
    {
        id: 1,
        name: "Grand Hotel Kathmandu",
        city: "Kathmandu",
        cheapestPrice: 7000,
        image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/606136102.jpg?k=a071311041a8a05d02c0c5cc489f4c4764642e512d72c8f3b6235d9bfe9fdd21&o=&hp=1",
        rating: 4.8,
    },
    {
        id: 2,
        name: "Vivanta Kathmandu",
        city: "Lalitpur",
        cheapestPrice: 8500,
        image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/178488660.jpg?k=4f62c20176f078beede491e7c4ccb27cc186773dffc88143227b39c16b0612a2&o=&hp=1",
        rating: 4.5,
    },
    {
        id: 3,
        name: "Hotel Heritage",
        city: "Bhaktapur",
        cheapestPrice: 6700,
        image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/173372452.jpg?k=e618be6f84562c35d985e07187388f97f16b54c9ef15015da4872102512b4893&o=&hp=1",
        rating: 4.7,
    },
    {
        id: 4,
        name: "Hyatt Regency Kathmandu",
        city: "Kathmandu",
        cheapestPrice: 12000,
        image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/430692688.jpg?k=5a0f144acafd427e7ff82b3abffb2160416bfa532688fa9d69b1235c59d6780d&o=&hp=1",
        rating: 4.7,
    },
    {
        id: 5,
        name: "Hotel Himalaya",
        city: "Lalitpur",
        cheapestPrice: 7800,
        image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/565571462.jpg?k=5bbcaf585af559be4346af8495bc7eeff4b1848d67ea855c19776b84616eaa83&o=&hp=1",
        rating: 4.4,
    },
    {
        id: 6,
        name: "Peacock Guest House",
        city: "Bhaktapur",
        cheapestPrice: 5500,
        image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/113150810.jpg?k=95f32a2635bfbe31fc7cc15940cf4873949da554911f6794a11e4b3fe41f1046&o=&hp=1",
        rating: 4.5,
    },
    {
        id: 7,
        name: "Gokarna Forest Resort",
        city: "Kathmandu",
        cheapestPrice: 9500,
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/8f/6a/fb/main-courtyard.jpg?w=900&h=500&s=1",
        rating: 4.6,
    },
    {
        id: 8,
        name: "Summit Hotel",
        city: "Lalitpur",
        cheapestPrice: 7000,
        image: "https://summithotels.ph/sites/default/files/SHR%20WEB%20HOTEL%20BANNER%20%283%29.jpg",
        rating: 4.3,
    },
    {
        id: 9,
        name: "Tulaja Boutique Hotel",
        city: "Bhaktapur",
        cheapestPrice: 6000,
        image:
            "https://cf.bstatic.com/xdata/images/hotel/max1024x768/229519781.jpg?k=2f8f772bd9938f37c9c718af3d83b4ab5ddf8794900ed1a9c2841928c5c3f8ce&o=&hp=1",
        rating: 4.6,
    },
]

const ChevronLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
)

const ChevronRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
)

const MapPin = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
)

const Star = ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
    </svg>
)

function NepalHotelCarousel() {
    const [currentPage, setCurrentPage] = useState(0)
    const hotelsPerPage = 3
    const totalPages = Math.ceil(originalHotels.length / hotelsPerPage)

    const nextPage = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages)
    }

    const prevPage = () => {
        setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages)
    }

    const getCurrentHotels = () => {
        const startIndex = currentPage * hotelsPerPage
        return originalHotels.slice(startIndex, startIndex + hotelsPerPage)
    }

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} filled={true} />)
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Star key={i} filled={true} />)
            } else {
                stars.push(<Star key={i} filled={false} />)
            }
        }
        return stars
    }

    const getCityClass = (city) => {
        if (city === "Kathmandu") return "city-kathmandu"
        if (city === "Lalitpur") return "city-lalitpur"
        if (city === "Bhaktapur") return "city-bhaktapur"
        return "city-default"
    }

    const formatPrice = (price) => {
        return `Rs. ${price.toLocaleString()}/night`
    }

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
        }
        return amenitiesMap[hotelName] || ["Comfort", "Service", "Clean"]
    }

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
                    {getCurrentHotels().map((hotel, index) => (
                        <div key={hotel.id} className="hotel-item">
                            <div className="hotel-image-section">
                                <img
                                    src={hotel.image || "/placeholder.svg"}
                                    alt={hotel.name}
                                    className="hotel-photo"
                                    onError={(e) => {
                                        e.target.src = "/placeholder.svg?height=300&width=400"
                                    }}
                                />
                                <div className="rating-container">
                                    <div className="stars-wrapper">{renderStars(hotel.rating)}</div>
                                    <span className="rating-number">{hotel.rating}</span>
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

                                <button className="booking-button">
                                    <span>Book Now</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    )
}

export default NepalHotelCarousel
