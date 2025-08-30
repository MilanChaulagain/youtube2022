"use client"
import React, { useEffect, useState } from "react";
import {
    Globe, Landmark, Palette, Castle, Banknote, RefreshCw,
    ArrowLeftRight, Bus, Lightbulb, HelpCircle, Star, MapPin, CreditCard,
    Hospital, AlertCircle, Info, Flag, Navigation, Wallet, CircleDollarSign,
    Map, ArrowRightLeft
} from "lucide-react";
import { MdAccountBalance, MdLocalTaxi } from "react-icons/md";
import { FaDiagnoses } from "react-icons/fa";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./money-exchange.css";

const MoneyExchange = () => {
    const [exchangeRates, setExchangeRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState("");
    const [error, setError] = useState("");
    const [selectedCity, setSelectedCity] = useState("all");
    const [centers, setCenters] = useState([]);
    const [useLocation, setUseLocation] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [hoveredCenter, setHoveredCenter] = useState(null);
    const [radius, setRadius] = useState(5); // Default radius in km for near me search

    // Tourism-focused currencies for Kathmandu Valley visitors
    const touristCurrencies = [
        { code: "USD", name: "US Dollar", flag: "🇺🇸", country: "United States" },
        { code: "EUR", name: "Euro", flag: "🇪🇺", country: "European Union" },
        { code: "GBP", name: "British Pound", flag: "🇬🇧", country: "United Kingdom" },
        { code: "INR", name: "Indian Rupee", flag: "🇮🇳", country: "India" },
        { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", country: "China" },
        { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", country: "Japan" },
        { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", country: "Australia" },
        { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", country: "Canada" },
        { code: "KRW", name: "South Korean Won", flag: "🇰🇷", country: "South Korea" },
        { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", country: "Singapore" },
        { code: "THB", name: "Thai Baht", flag: "🇹🇭", country: "Thailand" },
        { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾", country: "Malaysia" },
        { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", country: "Switzerland" },
        { code: "SEK", name: "Swedish Krona", flag: "🇸🇪", country: "Sweden" },
        { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴", country: "Norway" },
        { code: "DKK", name: "Danish Krone", flag: "🇩🇰", country: "Denmark" },
        { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", country: "New Zealand" },
        { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", country: "Hong Kong" },
    ];

    // Haversine distance calculation function
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg) => deg * (Math.PI / 180);

    const fetchExchangeRates = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("https://api.exchangerate-api.com/v4/latest/NPR");

            if (!response.ok) {
                throw new Error("Failed to fetch exchange rates");
            }

            const data = await response.json();

            const processedRates = touristCurrencies
                .map((currency) => {
                    const rateFromNPR = data.rates[currency.code];
                    const rateToNPR = rateFromNPR ? 1 / rateFromNPR : 0;

                    // Calculate buy/sell spread (varies by city)
                    const spread = 0.035; // 3.5% average spread across valley
                    const buyRate = rateToNPR * (1 - spread / 2);
                    const sellRate = rateToNPR * (1 + spread / 2);

                    return {
                        ...currency,
                        buyRate: buyRate,
                        sellRate: sellRate,
                        midRate: rateToNPR,
                        available: rateFromNPR ? true : false,
                    };
                })
                .filter((rate) => rate.available);

            setExchangeRates(processedRates);
            setLastUpdated(new Date().toLocaleString());
        } catch (err) {
            setError("Unable to fetch current exchange rates. Please try again later.");
            console.error("Exchange rate fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Get user location if enabled
    useEffect(() => {
        if (useLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    alert("Location access denied or unavailable.");
                    setUseLocation(false);
                }
            );
        } else {
            setUserLocation(null);
        }
    }, [useLocation]);

    // Fetch exchange centers with distance calculation
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = "http://localhost:8800/api/money-exchange";

                // If not using location or location not available, fetch all centers
                if (!useLocation || !userLocation) {
                    if (selectedCity !== "all") {
                        url += `/${selectedCity}`;
                    }
                }

                const res = await fetch(url);
                const data = await res.json();
                let centersData = data.data || [];

                // Calculate distances if using location
                if (useLocation && userLocation) {
                    centersData = centersData.map(center => {
                        const distance = haversineDistance(
                            userLocation.lat,
                            userLocation.lng,
                            center.lat,
                            center.lng
                        );
                        return {
                            ...center,
                            distance,
                            isWithinRadius: distance <= radius
                        };
                    }).filter(center => center.isWithinRadius);
                }

                setCenters(centersData);
            } catch (err) {
                console.error("Fetch failed:", err);
            }
        };

        fetchData();
    }, [selectedCity, useLocation, userLocation, radius]);

    useEffect(() => {
        fetchExchangeRates();
        const interval = setInterval(fetchExchangeRates, 600000);
        return () => clearInterval(interval);
    }, []);

    const handleCityClick = (city) => {
        setSelectedCity(city);
        setUseLocation(false);
    };

    const toggleLocation = () => {
        const newUseLocation = !useLocation;
        setUseLocation(newUseLocation);

        if (newUseLocation) {
            setSelectedCity("all");
        }
    };

    const formatRate = (rate, currency) => {
        if (currency === "JPY" || currency === "KRW") {
            return rate.toFixed(4);
        } else if (currency === "INR") {
            return rate.toFixed(3);
        }
        return rate.toFixed(2);
    };

    const cityData = {
        kathmandu: {
            name: "Kathmandu",
            icon: <Landmark size={20} />,
            color: "#c41e3a",
            exchanges: ["Thamel", "New Road", "Durbar Marg", "Lazimpat"],
            banks: ["Nepal Investment Bank", "Standard Chartered", "Himalayan Bank", "Nabil Bank"],
            atms: ["Thamel (Every 100m)", "Tribhuvan Airport", "Durbar Square", "Ratna Park"],
            attractions: ["Durbar Square", "Swayambhunath", "Thamel", "Pashupatinath"],
        },
        lalitpur: {
            name: "Lalitpur (Patan)",
            icon: <Palette size={20} />,
            color: "#1e40af",
            exchanges: ["Lagankhel", "Jawalakhel", "Patan Dhoka", "Pulchowk"],
            banks: ["Rastriya Banijya Bank", "Nepal Bank", "Kumari Bank", "Civil Bank"],
            atms: ["Patan Durbar Square", "Lagankhel", "Jawalakhel Zoo", "Pulchowk Campus"],
            attractions: ["Patan Durbar Square", "Golden Temple", "Mahabouddha", "Central Zoo"],
        },
        bhaktapur: {
            name: "Bhaktapur",
            icon: <Castle size={20} />,
            color: "#059669",
            exchanges: ["Bhaktapur Durbar Square", "Suryabinayak", "Madhyapur Thimi"],
            banks: ["Agricultural Bank", "Machhapuchchhre Bank", "Sunrise Bank"],
            atms: ["Durbar Square Area", "Suryabinayak", "Thimi Chowk"],
            attractions: ["Bhaktapur Durbar Square", "Nyatapola Temple", "55 Window Palace", "Pottery Square"],
        },
    };

    const handleViewMap = (lat, lng) => {
        if (userLocation) {
            // Directions mode
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`;
            window.open(url, '_blank');
        } else {
            // Location search mode
            const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            window.open(url, '_blank');
        }
    };

    const renderCitySelector = () => (
        <div className="exchange-city-selector">
            <button
                className={`exchange-city-btn ${selectedCity === "all" && !useLocation ? "exchange-active" : ""}`}
                onClick={() => handleCityClick("all")}
            >
                <Globe size={16} /> All Cities
            </button>
            <button
                className={`exchange-city-btn ${selectedCity === "kathmandu" ? "exchange-active" : ""}`}
                onClick={() => handleCityClick("kathmandu")}
            >
                <Landmark size={16} /> Kathmandu
            </button>
            <button
                className={`exchange-city-btn ${selectedCity === "lalitpur" ? "exchange-active" : ""}`}
                onClick={() => handleCityClick("lalitpur")}
            >
                <Palette size={16} /> Lalitpur
            </button>
            <button
                className={`exchange-city-btn ${selectedCity === "bhaktapur" ? "exchange-active" : ""}`}
                onClick={() => handleCityClick("bhaktapur")}
            >
                <Castle size={16} /> Bhaktapur
            </button>
            <button
                className={`exchange-city-btn ${useLocation ? "exchange-active" : ""}`}
                onClick={toggleLocation}
            >
                <MapPin size={16} /> Near Me
            </button>

            {useLocation && (
                <div className="exchange-radius-control">
                    <label>Search Radius: {radius} km</label>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                    />
                </div>
            )}
        </div>
    );

    const renderExchangeCenters = () => (
        <div className="exchange-center-list">
            <h2>
                {useLocation && userLocation ? (
                    <>
                        <MapPin size={20} /> Exchange Centers Within {radius} km
                        <span className="exchange-location-coords">
                            ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                        </span>
                    </>
                ) : selectedCity !== "all" ? (
                    `${cityData[selectedCity].name} Exchange Centers`
                ) : (
                    "Exchange Centers"
                )}
            </h2>

            {centers.length === 0 ? (
                <div className="exchange-empty-centers">
                    <p>No exchange centers found.</p>
                    {useLocation && (
                        <button
                            onClick={() => setRadius(radius + 5)}
                            className="exchange-increase-radius-btn"
                        >
                            Increase Search Radius
                        </button>
                    )}
                </div>
            ) : (
                <div className="exchange-center-grid">
                    {centers.map((center) => (
                        <div
                            key={center._id}
                            className="exchange-center-card"
                            onMouseEnter={() => setHoveredCenter(center)}
                            onMouseLeave={() => setHoveredCenter(null)}
                        >
                            <img
                                src={center.images[0] || "https://via.placeholder.com/150"}
                                alt={center.name}
                                className="exchange-center-image"
                            />
                            {hoveredCenter === center && (
                                <div className="exchange-center-details">
                                    <h3>{center.name}</h3>
                                    <p>Address: {center.address}</p>
                                    {center.distance && (
                                        <p>Distance: {center.distance.toFixed(1)} km</p>
                                    )}
                                    <p>Contact: {center.contactNumber}</p>
                                    <p>Hours: {center.hours}</p>
                                    <button
                                        onClick={() => handleViewMap(center.lat, center.lng)}
                                        className="exchange-view-map-btn"
                                    >
                                        Get Directions
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div>
            <Navbar />
            <Header />
            <div className="exchange-page">
                <div className="exchange-header">
                    <div className="exchange-header-top">
                        <div className="exchange-title">
                            <div>
                                <h1>Kathmandu Valley Currency Exchange</h1>
                                <p>Live exchange rates for Kathmandu • Lalitpur • Bhaktapur</p>
                            </div>
                        </div>
                        <div className="exchange-base-info">
                            <div className="exchange-base-currency">
                                <Banknote size={18} />
                                <span>Base Currency: Nepalese Rupee (NPR)</span>
                            </div>
                            <div className="exchange-header-actions">
                                <button
                                    onClick={fetchExchangeRates}
                                    className={`exchange-refresh-btn ${loading ? "exchange-loading" : ""}`}
                                    disabled={loading}
                                >
                                    <RefreshCw size={18} />
                                    {loading ? "Updating..." : "Refresh Rates"}
                                </button>
                                {lastUpdated && (
                                    <span className="exchange-last-updated">
                                        <Info size={14} />
                                        Last updated: {lastUpdated}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {renderCitySelector()}
                </div>

                <div className="exchange-content">
                    {error && (
                        <div className="exchange-error-message">
                            <AlertCircle size={24} />
                            <div>
                                <p> <FaDiagnoses /> {error}</p>
                                <button onClick={fetchExchangeRates} className="exchange-retry-btn">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="exchange-loading-container">
                            <div className="exchange-loader"></div>
                            <p>Loading current exchange rates...</p>
                        </div>
                    ) : (
                        <>
                            {/* City-specific information */}
                            {selectedCity === "all" ? (
                                <div className="exchange-valley-overview">
                                    <h2><Map size={24} /> Kathmandu Valley Exchange Overview</h2>
                                    <div className="exchange-city-grid">
                                        {Object.entries(cityData).map(([key, city]) => (
                                            <div key={key} className="exchange-city-card" style={{ borderTopColor: city.color }}>
                                                <h3>
                                                    {city.icon} {city.name}
                                                </h3>
                                                <div className="exchange-city-info">
                                                    <div className="exchange-info-section">
                                                        <h4><ArrowRightLeft size={18} /> Exchange Areas:</h4>
                                                        <ul>
                                                            {city.exchanges.map((area, idx) => (
                                                                <li key={idx}>{area}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="exchange-info-section">
                                                        <h4><MdAccountBalance size={18} /> Major Banks:</h4>
                                                        <ul>
                                                            {city.banks.slice(0, 2).map((bank, idx) => (
                                                                <li key={idx}>{bank}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="exchange-info-section">
                                                        <h4><Navigation size={18} /> Tourist Spots:</h4>
                                                        <ul>
                                                            {city.attractions.slice(0, 2).map((spot, idx) => (
                                                                <li key={idx}>{spot}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="exchange-city-details">
                                    <h2>
                                        {cityData[selectedCity].icon} {cityData[selectedCity].name} Exchange Guide
                                    </h2>
                                    <div className="exchange-details-grid">
                                        <div className="exchange-detail-card">
                                            <h3><ArrowLeftRight size={18} /> Best Exchange Locations</h3>
                                            <ul>
                                                {cityData[selectedCity].exchanges.map((area, idx) => (
                                                    <li key={idx}>
                                                        <strong>{area}:</strong> {getAreaDescription(selectedCity, area)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="exchange-detail-card">
                                            <h3><MdAccountBalance size={18} /> Recommended Banks</h3>
                                            <ul>
                                                {cityData[selectedCity].banks.map((bank, idx) => (
                                                    <li key={idx}>{bank}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="exchange-detail-card">
                                            <h3><CreditCard size={18} /> ATM Locations</h3>
                                            <ul>
                                                {cityData[selectedCity].atms.map((atm, idx) => (
                                                    <li key={idx}>{atm}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="exchange-detail-card">
                                            <h3><MapPin size={18} /> Tourist Attractions</h3>
                                            <ul>
                                                {cityData[selectedCity].attractions.map((attraction, idx) => (
                                                    <li key={idx}>{attraction}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Exchange centers list */}
                            {renderExchangeCenters()}

                            {/* Exchange rates grid */}
                            <div className="exchange-rates-grid">
                                {exchangeRates.map((rate) => (
                                    <div key={rate.code} className="exchange-currency-card">
                                        <div className="exchange-currency-header">
                                            <div className="exchange-currency-info">
                                                <span className="exchange-currency-flag">{rate.flag}</span>
                                                <div className="exchange-currency-details">
                                                    <h3>{rate.code}</h3>
                                                    <p className="exchange-currency-name">{rate.name}</p>
                                                    <p className="exchange-country-name">{rate.country}</p>
                                                </div>
                                            </div>
                                            <div className="exchange-currency-badges">
                                                {["USD", "EUR", "GBP", "INR"].includes(rate.code) && (
                                                    <span className="exchange-badge exchange-badge-popular">
                                                        <Star size={12} /> Popular
                                                    </span>
                                                )}
                                                {rate.code === "INR" && (
                                                    <span className="exchange-badge exchange-badge-border">
                                                        <MapPin size={12} /> Border Rate
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="exchange-rates-container">
                                            <div className="exchange-rate-box exchange-buy-rate">
                                                <span className="exchange-rate-label">We Buy (You Sell)</span>
                                                <span className="exchange-rate-value">NPR {formatRate(rate.buyRate, rate.code)}</span>
                                                <span className="exchange-rate-subtext">per 1 {rate.code}</span>
                                            </div>
                                            <div className="exchange-rate-box exchange-sell-rate">
                                                <span className="exchange-rate-label">We Sell (You Buy)</span>
                                                <span className="exchange-rate-value">NPR {formatRate(rate.sellRate, rate.code)}</span>
                                                <span className="exchange-rate-subtext">per 1 {rate.code}</span>
                                            </div>
                                        </div>

                                        <div className="exchange-conversion-example">
                                            <CircleDollarSign size={14} />
                                            <small>
                                                Example: {rate.code} 100 = NPR {formatRate(rate.midRate * 100, rate.code)}
                                            </small>
                                        </div>

                                        {getCurrencyTips(rate.code)}
                                    </div>
                                ))}
                            </div>

                            {/* Valley-wide transportation and tips */}
                            <div className="exchange-valley-tips">
                                <h2><Bus size={24} /> Getting Around Kathmandu Valley</h2>
                                <div className="exchange-transport-grid">
                                    <div className="exchange-transport-card">
                                        <h3><MdLocalTaxi size={18} /> Between Cities</h3>
                                        <p>
                                            <strong>Kathmandu ↔ Lalitpur:</strong> 20-30 minutes by taxi (NPR 300-500)
                                        </p>
                                        <p>
                                            <strong>Kathmandu ↔ Bhaktapur:</strong> 45-60 minutes by taxi (NPR 800-1200)
                                        </p>
                                        <p>
                                            <strong>Lalitpur ↔ Bhaktapur:</strong> 30-45 minutes by taxi (NPR 600-900)
                                        </p>
                                    </div>
                                    <div className="exchange-transport-card">
                                        <h3><Bus size={18} /> Public Transport</h3>
                                        <p>
                                            <strong>Local Buses:</strong> NPR 15-25 between cities
                                        </p>
                                        <p>
                                            <strong>Microbuses:</strong> NPR 20-35, more frequent
                                        </p>
                                        <p>
                                            <strong>Tempo:</strong> NPR 10-20, shared rides
                                        </p>
                                    </div>
                                    <div className="exchange-transport-card">
                                        <h3><Wallet size={18} /> Payment Tips</h3>
                                        <p>
                                            <strong>Cash Preferred:</strong> NPR for all local transport
                                        </p>
                                        <p>
                                            <strong>Tourist Taxis:</strong> May accept USD in Thamel area
                                        </p>
                                        <p>
                                            <strong>Ride Apps:</strong> Pathao, InDrive accept digital payments
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="exchange-footer">
                    <div className="exchange-footer-content">
                        <div className="exchange-disclaimer">
                            <h4><Lightbulb size={20} /> Kathmandu Valley Exchange Tips:</h4>
                            <ul>
                                <li>
                                    <strong>Kathmandu:</strong> Thamel has most competitive rates, New Road for official banking
                                </li>
                                <li>
                                    <strong>Lalitpur:</strong> Lagankhel area offers good rates, fewer crowds than Thamel
                                </li>
                                <li>
                                    <strong>Bhaktapur:</strong> Limited options, exchange before visiting or use ATMs
                                </li>
                                <li>Banks close early on Fridays and during festivals across all cities</li>
                                <li>Keep receipts for re-conversion when leaving Nepal</li>
                                <li>ATM fees are lowest at Nepal Investment Bank and Himalayan Bank</li>
                            </ul>
                        </div>

                        <div className="exchange-emergency-info">
                            <h4><HelpCircle size={20} /> Valley-wide Emergency Contacts:</h4>
                            <p>
                                <strong>Tourist Police:</strong> 1144 (All cities)
                            </p>
                            <p>
                                <strong>Nepal Police:</strong> 100
                            </p>
                            <p>
                                <strong>Kathmandu Tourist Police:</strong> +977-1-4247041
                            </p>
                            <p>
                                <strong>Lalitpur Police:</strong> +977-1-5521207
                            </p>
                            <p>
                                <strong>Bhaktapur Police:</strong> +977-1-6610005
                            </p>
                            <br />
                            <h4><Hospital size={20} /> Medical Emergency:</h4>
                            <p>
                                <strong>CIWEC Hospital (Thamel):</strong> +977-1-4424111
                            </p>
                            <p>
                                <strong>Patan Hospital (Lalitpur):</strong> +977-1-5522266
                            </p>
                            <p>
                                <strong>Bhaktapur Hospital:</strong> +977-1-6610798
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );

    // Helper functions
    function getAreaDescription(city, area) {
        const descriptions = {
            kathmandu: {
                Thamel: "Tourist hub with competitive rates",
                "New Road": "Banking district with official rates",
                "Durbar Marg": "Premium area, hotel exchanges",
                Lazimpat: "Embassy area, reliable services",
            },
            lalitpur: {
                Lagankhel: "Main commercial area, good rates",
                Jawalakhel: "Near zoo, tourist-friendly",
                "Patan Dhoka": "Heritage area, limited options",
                Pulchowk: "University area, student-friendly rates",
            },
            bhaktapur: {
                "Bhaktapur Durbar Square": "Tourist area, premium rates",
                Suryabinayak: "Local area, better rates",
                "Madhyapur Thimi": "Pottery town, limited services",
            },
        };
        return descriptions[city]?.[area] || "Exchange services available";
    }

    function getCurrencyTips(code) {
        const tips = {
            USD: (
                <div className="exchange-special-note">
                    <Info size={14} />
                    <small>Widely accepted in Thamel and tourist hotels</small>
                </div>
            ),
            INR: (
                <div className="exchange-special-note">
                    <Flag size={14} />
                    <small>Perfect for India border crossings</small>
                </div>
            ),
            EUR: (
                <div className="exchange-special-note">
                    <Landmark size={14} />
                    <small>Good rates in Kathmandu, limited in Bhaktapur</small>
                </div>
            ),
            CNY: (
                <div className="exchange-special-note">
                    <Navigation size={14} />
                    <small>Growing acceptance in tourist areas</small>
                </div>
            ),
        };
        return tips[code] || null;
    }
};

export default MoneyExchange;