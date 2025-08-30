import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaCalendarAlt, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";

import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

import "./touristguiderdashboard.css";

const TouristGuideDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bookings");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Nepal-specific bookings
                const mockBookings = [
                    {
                        _id: "1",
                        touristName: "Alex Johnson",
                        date: "2023-10-15",
                        location: "Kathmandu Durbar Square",
                        duration: 2,
                        contact: "+977 9841123456"
                    },
                    {
                        _id: "2",
                        touristName: "Maria Garcia",
                        date: "2023-10-20",
                        location: "Pokhara Lakeside",
                        duration: 3,
                        contact: "+977 9801234567"
                    },
                    {
                        _id: "3",
                        touristName: "James Wilson",
                        date: "2023-10-25",
                        location: "Chitwan National Park",
                        duration: 4,
                        contact: "+977 9812345678"
                    }
                ];

                const mockReviews = [
                    {
                        _id: "r1",
                        reviewer: "Sarah Miller",
                        comment: "Deep knowledge of Nepali history and culture. Made our Kathmandu tour unforgettable!",
                        rating: 5
                    },
                    {
                        _id: "r2",
                        reviewer: "David Brown",
                        comment: "Excellent trekking guide through Annapurna circuit. Knew all the best viewpoints!",
                        rating: 4.5
                    },
                    {
                        _id: "r3",
                        reviewer: "Jennifer Lee",
                        comment: "Customized our Pokhara tour perfectly. Shared amazing local insights about Nepali traditions.",
                        rating: 5
                    }
                ];

                setBookings(mockBookings);
                setReviews(mockReviews);
            } catch (err) {
                console.error(err);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };

        fetchData();
    }, []);

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="star full" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star half" />);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
        }

        return <div className="stars">{stars}</div>;
    };

    return (
        <>
            <Navbar />
            <Header />
            <div className="app-container">
                <div className="tourist-guide-dashboard">
                    <div className="dashboard-hero">
                        <div className="hero-content">
                            <h1>Namaste, Tourist Guide!</h1>
                            <p>Manage your bookings, reviews, and schedule for tours across Nepal</p>
                            <div className="stats-container">
                                <div className="stat-card">
                                    <div className="stat-value">{bookings.length}</div>
                                    <div className="stat-label">Upcoming Tours</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">{reviews.length}</div>
                                    <div className="stat-label">Reviews</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value">4.8</div>
                                    <div className="stat-label">Avg. Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-tabs">
                        {["bookings", "reviews", "profile", "chat"].map((tab) => (
                            <button
                                key={tab}
                                className={`dashboard-tab ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Bookings Section */}
                    {activeTab === "bookings" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Your Upcoming Bookings</h2>
                                <div className="filters">
                                    <select>
                                        <option>All</option>
                                        <option>This Week</option>
                                        <option>This Month</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading bookings...</p>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📅</div>
                                    <h3>No upcoming bookings</h3>
                                    <p>Your upcoming tours will appear here</p>
                                </div>
                            ) : (
                                <div className="booking-list">
                                    {bookings.map((booking, index) => (
                                        <div
                                            className="booking-card"
                                            key={booking._id}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="booking-header">
                                                <div className="booking-tourist">
                                                    <div className="avatar">{booking.touristName.charAt(0)}</div>
                                                    <div>
                                                        <div className="tourist-name">{booking.touristName}</div>
                                                        <div className="tourist-contact">
                                                            <FaPhoneAlt className="icon" /> {booking.contact}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="booking-date">
                                                    <FaCalendarAlt className="icon" />
                                                    <div>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                                </div>
                                            </div>

                                            <div className="booking-details">
                                                <div className="detail">
                                                    <FaMapMarkerAlt className="icon" />
                                                    <span>{booking.location}</span>
                                                </div>
                                                <div className="detail">
                                                    <GiPathDistance className="icon" />
                                                    <span>{booking.duration} day{booking.duration > 1 ? 's' : ''}</span>
                                                </div>
                                            </div>

                                            <div className="booking-actions">
                                                <button className="btn outline">Details</button>
                                                <button className="btn primary">Confirm</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Reviews Section */}
                    {activeTab === "reviews" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Your Reviews</h2>
                                <div className="rating-summary">
                                    <div className="average-rating">4.8</div>
                                    <div className="rating-stars">
                                        {renderStars(4.8)}
                                        <div className="rating-count">({reviews.length} reviews)</div>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">⭐</div>
                                    <h3>No reviews yet</h3>
                                    <p>Your reviews will appear here</p>
                                </div>
                            ) : (
                                <div className="review-list">
                                    {reviews.map((review) => (
                                        <div className="review-card" key={review._id}>
                                            <div className="review-header">
                                                <div className="reviewer">
                                                    <div className="avatar">{review.reviewer.charAt(0)}</div>
                                                    <div className="reviewer-name">{review.reviewer}</div>
                                                </div>
                                                <div className="review-rating">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <div className="review-content">
                                                <MdRateReview className="icon" />
                                                <p>{review.comment}</p>
                                            </div>
                                            <div className="review-date">Posted 2 days ago</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Profile Section */}
                    {activeTab === "profile" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Your Guide Profile</h2>
                            </div>

                            <div className="profile-container">
                                <div className="profile-card">
                                    <div className="profile-header">
                                        <div className="avatar">RG</div>
                                        <div className="profile-info">
                                            <h3>Rajesh Gurung</h3>
                                            <p>Certified Nepal Tourism Guide</p>
                                            <div className="rating">
                                                {renderStars(4.8)}
                                                <span>4.8 (128 reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-details">
                                        <div className="detail">
                                            <label>Specialties:</label>
                                            <span>Trekking, Cultural Tours, Wildlife Safaris</span>
                                        </div>
                                        <div className="detail">
                                            <label>Languages:</label>
                                            <span>Nepali, English, Hindi</span>
                                        </div>
                                        <div className="detail">
                                            <label>Experience:</label>
                                            <span>12 years</span>
                                        </div>
                                        <div className="detail">
                                            <label>Location:</label>
                                            <span>Pokhara, Nepal</span>
                                        </div>
                                    </div>

                                    <div className="profile-stats">
                                        <div className="stat">
                                            <div className="value">312</div>
                                            <div className="label">Tours Given</div>
                                        </div>
                                        <div className="stat">
                                            <div className="value">98%</div>
                                            <div className="label">Satisfaction</div>
                                        </div>
                                        <div className="stat">
                                            <div className="value">5.2k</div>
                                            <div className="label">Travelers</div>
                                        </div>
                                    </div>

                                    <div className="profile-actions">
                                        <button className="btn primary" onClick={() => navigate("/edit-tourist-guide")}>
                                            Edit Profile
                                        </button>
                                        <button className="btn outline">
                                            View Public Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Chat Section */}
                    {activeTab === "chat" && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Tourist Messages</h2>
                                <div className="unread-count">3 unread messages</div>
                            </div>

                            <div className="chat-container">
                                <div className="chat-list">
                                    <div className="chat-item active">
                                        <div className="avatar">AJ</div>
                                        <div className="chat-info">
                                            <div className="chat-header">
                                                <div className="name">Alex Johnson</div>
                                                <div className="time">10:24 AM</div>
                                            </div>
                                            <div className="message-preview">
                                                Looking forward to our Everest Base Camp trek! What should...
                                            </div>
                                            <div className="unread-indicator">2</div>
                                        </div>
                                    </div>
                                    <div className="chat-item">
                                        <div className="avatar">MG</div>
                                        <div className="chat-info">
                                            <div className="chat-header">
                                                <div className="name">Maria Garcia</div>
                                                <div className="time">Yesterday</div>
                                            </div>
                                            <div className="message-preview">
                                                Thank you for the wonderful Kathmandu tour yesterday...
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-item">
                                        <div className="avatar">JW</div>
                                        <div className="chat-info">
                                            <div className="chat-header">
                                                <div className="name">James Wilson</div>
                                                <div className="time">Jul 10</div>
                                            </div>
                                            <div className="message-preview">
                                                Can we add Bhaktapur to our cultural tour itinerary?
                                            </div>
                                            <div className="unread-indicator">1</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="chat-main">
                                    <div className="chat-header">
                                        <div className="chat-partner">
                                            <div className="avatar">AJ</div>
                                            <div className="name">Alex Johnson</div>
                                        </div>
                                        <div className="tour-info">Everest Base Camp Trek • Oct 15</div>
                                    </div>

                                    <div className="chat-messages">
                                        <div className="message received">
                                            <div className="content">
                                                Hi Rajesh! Looking forward to our Everest trek! What should we pack for October?
                                            </div>
                                            <div className="time">10:24 AM</div>
                                        </div>
                                        <div className="message sent">
                                            <div className="content">
                                                Namaste Alex! Bring warm layers - temperatures drop at higher altitudes. I'll send a full packing list.
                                            </div>
                                            <div className="time">10:26 AM</div>
                                        </div>
                                        <div className="message received">
                                            <div className="content">
                                                Thanks! Also, can we visit a local Sherpa village during the trek?
                                            </div>
                                            <div className="time">10:27 AM</div>
                                        </div>
                                    </div>

                                    <div className="chat-input">
                                        <input type="text" placeholder="Type a message..." />
                                        <button className="btn primary">Send</button>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-actions">
                                <button className="btn primary" onClick={() => navigate("/chat")}>
                                    Open Full Chat
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TouristGuideDashboard;