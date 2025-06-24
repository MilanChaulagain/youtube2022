import React, { useState, useContext, useRef, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Featured from "../../components/featured/Featured";
import Footer from "../../components/footer/Footer";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import PropertyList from "../../components/propertyList/PropertyList";
import MailList from "../../components/mailList/MailList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import "./stays.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Stays = () => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    });
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const dateRef = useRef();
    const optionsRef = useRef();

    const { dispatch } = useContext(SearchContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dateRef.current && !dateRef.current.contains(e.target)) {
                setOpenDate(false);
            }
            if (optionsRef.current && !optionsRef.current.contains(e.target)) {
                setOpenOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOption = (name, operation) => {
        setOptions((prev) => ({
            ...prev,
            [name]: operation === "i" ? prev[name] + 1 : Math.max(prev[name] - 1, (name === "adult" || name === "room") ? 1 : 0),
        }));
    };

    const handleSearch = () => {
        if (!destination.trim()) {
            alert("Please enter a destination");
            return;
        }

        dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
        navigate("/hotels", { state: { destination, dates, options } });

        // For demo purposes - simulate search results
        const mockResults = [
            { id: 1, name: `${destination} Luxury Resort`, type: "Resort", rating: 4.8 },
            { id: 2, name: `${destination} Downtown Hotel`, type: "Hotel", rating: 4.5 },
            { id: 3, name: `${destination} Beach Villa`, type: "Villa", rating: 4.9 }
        ];

        setSearchResults(mockResults);
        setShowResults(true);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="staysPage">
            <Navbar />
            <Header />

            {/* Modern Search Bar */}
            <div className="searchBar">
                <div className="searchGrid">
                    <div className="searchItem">
                        <FontAwesomeIcon icon={faBed} className="searchIcon" />
                        <input
                            type="text"
                            placeholder="Where are you going?"
                            className="searchInput"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <div className="searchItem" ref={dateRef}>
                        <FontAwesomeIcon icon={faCalendarDays} className="searchIcon" />
                        <div
                            onClick={() => setOpenDate(!openDate)}
                            className="searchText"
                        >
                            {`${format(dates[0].startDate, "MMM dd")} - ${format(dates[0].endDate, "MMM dd")}`}
                        </div>
                        {openDate && (
                            <DateRange
                                editableDateInputs={true}
                                onChange={(item) => setDates([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dates}
                                className="datePicker"
                                minDate={new Date()}
                            />
                        )}
                    </div>

                    <div className="searchItem" ref={optionsRef}>
                        <FontAwesomeIcon icon={faPerson} className="searchIcon" />
                        <div
                            onClick={() => setOpenOptions(!openOptions)}
                            className="searchText"
                        >
                            {`${options.adult} adult · ${options.children} children · ${options.room} room`}
                        </div>
                        {openOptions && (
                            <div className="optionsDropdown">
                                {["adult", "children", "room"].map((key) => (
                                    <div className="optionItem" key={key}>
                                        <span className="optionLabel">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </span>
                                        <div className="optionControls">
                                            <button
                                                disabled={options[key] <= (key === "adult" || key === "room" ? 1 : 0)}
                                                className="optionBtn"
                                                onClick={() => handleOption(key, "d")}
                                            >
                                                -
                                            </button>
                                            <span className="optionValue">{options[key]}</span>
                                            <button
                                                className="optionBtn"
                                                onClick={() => handleOption(key, "i")}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="searchItem">
                        <button className="searchBtn" onClick={handleSearch}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Results Section */}
            {showResults && (
                <div className="searchResults">
                    <h2 className="resultsHeading">Stays in {destination}</h2>
                    <div className="resultsGrid">
                        {searchResults.map((result) => (
                            <div key={result.id} className="resultCard">
                                <div className="resultImage"></div>
                                <div className="resultInfo">
                                    <h3>{result.name}</h3>
                                    <p>{result.type} · ★ {result.rating}</p>
                                    <button className="viewBtn">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="stayContainer">
                <Featured />
                <h1 className="sectionTitle">Browse by property type</h1>
                <PropertyList />
                <h1 className="sectionTitle">Homes guests love</h1>
                <FeaturedProperties />
                <MailList />
                <Footer />
            </div>
        </div>
    );
};

export default Stays;
