import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./Reserve.css";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
	const [selectedRooms, setSelectedRooms] = useState([]);
	const { data, loading, error } = useFetch(`/hotels/rooms/${hotelId}`);
	const { dates } = useContext(SearchContext);
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
		return !roomNumber.unavailableDates.some((date) =>
			alldates.includes(new Date(date).getTime())
		);
	};

	const handleSelect = (e) => {
		const checked = e.target.checked;
		const value = e.target.value;
		setSelectedRooms((prev) =>
			checked ? [...prev, value] : prev.filter((item) => item !== value)
		);
	};

	const handleClick = async () => {
		try {
			await Promise.all(
				selectedRooms.map((roomId) =>
					axios.put(`/rooms/availability/${roomId}`, { dates: alldates })
				)
			);
			setOpen(false);
			navigate("/");
		} catch (err) {
			console.error("Reservation failed", err);
			alert("Reservation failed. Please try again.");
		}
	};

	return (
		<div className="reserve">
			<div className="rContainer">
				<FontAwesomeIcon
					icon={faCircleXmark}
					className="rClose"
					onClick={() => setOpen(false)}
				/>
				<span>Select your rooms:</span>

				{loading ? (
					<p>Loading rooms...</p>
				) : error ? (
					<p>Error loading room data.</p>
				) : data.length === 0 ? (
					<p>No rooms found for this hotel.</p>
				) : (
					data.map((item) => (
						<div className="rItem" key={item._id}>
							<div className="rItemInfo">
								<div className="rTitle">{item.title}</div>
								<div className="rDesc">{item.desc}</div>
								<div className="rMax">
									Max people: <b>{item.maxPeople}</b>
								</div>
								<div className="rPrice">Rs. {item.price}</div>
							</div>
							<div className="rSelectRooms">
								{item.roomNumbers.map((roomNumber) => {
									const available = isAvailable(roomNumber);
									return (
										<div className="room" key={roomNumber._id}>
											<label>{roomNumber.number}</label>
											<input
												type="checkbox"
												value={roomNumber._id}
												onChange={handleSelect}
												disabled={!available}
											/>
										</div>
									);
								})}
							</div>
						</div>
					))
				)}

				<button
					onClick={handleClick}
					className="rButton"
					disabled={selectedRooms.length === 0}
				>
					Reserve Now!
				</button>
			</div>
		</div>
	);
};

export default Reserve;