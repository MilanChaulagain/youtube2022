import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarDays,
    faHotel,
    faMoneyBillWave,
    faClock,
    faSpinner,
    faBan,
    faCheckCircle,
    faBed,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import "./booked.css";

const Bookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`http://localhost:8800/api/reservations?userId=${user._id}`);
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bookings");
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? This action requires admin approval.")) {
            return;
        }

        setCancellingId(bookingId);
        try {
            await axios.put(`http://localhost:8800/api/reservations/${bookingId}/cancel`);
            await fetchBookings();
            alert("Cancellation request submitted. Waiting for admin approval.");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel booking");
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculateTotalNights = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <FontAwesomeIcon icon={faCheckCircle} className="confirmed" />;
            case 'cancelled':
                return <FontAwesomeIcon icon={faBan} className="cancelled" />;
            case 'pending':
                return <FontAwesomeIcon icon={faSpinner} className="pending" spin />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="bookings-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bookings-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="bookings-container">
            <h1>My Bookings</h1>

            {!bookings || bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>You don't have any bookings yet.</p>
                    <button onClick={() => navigate("/")}>Explore Hotels</button>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map((booking) => {
                        const hotelName = booking.hotelId?.name || "Hotel";
                        const photo = booking.hotelId?.photos?.[0];
                        const rooms = Array.isArray(booking.rooms) ? booking.rooms : [];
                        const dates = Array.isArray(booking.dates) ? booking.dates : [];
                        const startDate = dates[0];
                        const endDate = dates[dates.length - 1];
                        const status = booking.status || "unknown";

                        return (
                            <div key={booking._id || Math.random()} className="booking-card">
                                <div className="booking-header">
                                    <h2>{hotelName}</h2>
                                    <div className="status-container">
                                        {getStatusIcon(status)}
                                        <span className={`status ${status}`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                <div className="booking-image">
                                    {photo ? (
                                        <img src={photo} alt={hotelName} />
                                    ) : (
                                        <div className="image-placeholder">No Image Available</div>
                                    )}
                                </div>

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        <span>
                                            {formatDate(startDate)} - {formatDate(endDate)}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faClock} />
                                        <span>{calculateTotalNights(startDate, endDate)} nights</span>
                                    </div>

                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faMoneyBillWave} />
                                        <span>Total: Rs. {booking.totalPrice || "N/A"}</span>
                                    </div>

                                    <div className="rooms-section">
                                        <h3>Your Booked Rooms:</h3>
                                        {rooms.length > 0 ? (
                                            <div className="room-list">
                                                {rooms.map((room, index) => (
                                                    <div key={index} className="room-item">
                                                        <div className="room-detail">
                                                            <FontAwesomeIcon icon={faBed} />
                                                            <span>Room {room.number}: {room.type || "Standard"}</span>
                                                        </div>
                                                        <div className="room-detail">
                                                            <FontAwesomeIcon icon={faUser} />
                                                            <span>Max Guests: {room.maxPeople || 2}</span>
                                                        </div>
                                                        <div className="room-detail">
                                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                                            <span>Price: Rs. {room.price || "N/A"} per night</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No room information available</p>
                                        )}
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    <button onClick={() => booking.hotelId?._id && navigate(`/hotels/${booking.hotelId._id}`)}>
                                        View Hotel
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleCancel(booking._id)}
                                        disabled={status === 'cancelled' || status === 'pending' || cancellingId === booking._id}
                                    >
                                        {cancellingId === booking._id ? (
                                            <>
                                                <FontAwesomeIcon icon={faSpinner} spin /> Processing...
                                            </>
                                        ) : (
                                            "Request Cancellation"
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Bookings;