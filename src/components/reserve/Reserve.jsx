import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import "./Reserve.css";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId, onSuccess }) => {
	const [selectedRooms, setSelectedRooms] = useState([]);
	const [isBooking, setIsBooking] = useState(false);
	const [bookingSuccess, setBookingSuccess] = useState(false);
	const { data = [], loading, error } = useFetch(`/hotels/rooms/${hotelId}`);
	const { dates } = useContext(SearchContext);
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const getDatesInRange = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const date = new Date(start.getTime());
		const dates = [];

		while (date <= end) {
			dates.push(new Date(date).getTime());
			date.setDate(date.getDate() + 1);
		}

		return dates;
	};

	const alldates = dates.length > 0
		? getDatesInRange(dates[0].startDate, dates[0].endDate)
		: [];

	const isAvailable = (roomNumber) => {
		return !roomNumber.unavailableDates.some(date =>
			alldates.includes(new Date(date).getTime())
		);
	};

	const handleSelect = (e) => {
		const checked = e.target.checked;
		const value = e.target.value;
		const roomNumber = e.target.getAttribute("data-roomnumber");

		setSelectedRooms(prev =>
			checked
				? [...prev, { id: value, number: roomNumber }]
				: prev.filter(item => item.id !== value)
		);
	};

	const handleClick = async () => {
		if (!user) {
			navigate("/login");
			return;
		}

		if (selectedRooms.length === 0) {
			alert("Please select at least one room");
			return;
		}

		setIsBooking(true);

		try {
			await Promise.all(
				selectedRooms.map(room =>
					axios.put(`http://localhost:8800/api/rooms/availability/${room.id}`, {
						dates: alldates,
					})
				)
			);

			await axios.post("http://localhost:8800/api/reservations", {
				userId: user._id,
				roomIds: selectedRooms.map(room => room.id),
				dates: alldates,
			});

			setIsBooking(false);
			setBookingSuccess(true);

			// Show success for 2 seconds then redirect
			setTimeout(() => {
				setOpen(false);
				navigate("/bookings");
			}, 2000);

		} catch (err) {
			console.error("Reservation failed", err);
			setIsBooking(false);
			alert(err.response?.data?.message || "Reservation failed. Please try again.");
		}
	};

	if (bookingSuccess) {
		return (
			<div className="reserve">
				<div className="success-message">
					<FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
					<h3>Booking Successful!</h3>
					<p>Your rooms {selectedRooms.map(room => room.number).join(", ")} have been reserved.</p>
					<p>Redirecting to your bookings...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="reserve">
			<div className="rContainer">
				<FontAwesomeIcon
					icon={faCircleXmark}
					className="rClose"
					onClick={() => setOpen(false)}
				/>
				<h2>Select your rooms:</h2>

				{loading ? (
					<div className="loading">Loading rooms...</div>
				) : error ? (
					<div className="error">Error loading room data.</div>
				) : data.length === 0 ? (
					<div className="empty">No rooms found for this hotel.</div>
				) : (
					data.filter(Boolean).map((item) => (
						<div className="rItem" key={item._id}>
							<div className="rItemInfo">
								<div className="rTitle">{item.title}</div>
								<div className="rDesc">{item.desc}</div>
								<div className="rDetails">
									<span>Max people: <strong>{item.maxPeople}</strong></span>
									<span>Price: <strong>Rs. {item.price}</strong></span>
								</div>
							</div>
							<div className="rSelectRooms">
								{item.roomNumbers?.map(roomNumber => {
									const available = isAvailable(roomNumber);
									return (
										<div
											className={`room ${!available ? "unavailable" : ""}`}
											key={roomNumber._id}
										>
											<label>
												<span>Room {roomNumber.number}</span>
												<input
													type="checkbox"
													value={roomNumber._id}
													data-roomnumber={roomNumber.number}
													onChange={handleSelect}
													disabled={!available}
												/>
												{!available && <span className="booked">Booked</span>}
											</label>
										</div>
									);
								})}
							</div>
						</div>
					))
				)}

				<button
					onClick={handleClick}
					className={`rButton ${isBooking ? "loading" : ""}`}
					disabled={selectedRooms.length === 0 || isBooking}
				>
					{isBooking ? (
						<>
							<span className="spinner"></span> Processing...
						</>
					) : (
						"Reserve Now!"
					)}
				</button>
			</div>
		</div>
	);
};

export default Reserve;