import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./place_banner.css";

const originalDestinations = [
    { id: 1, name: "Basantapur Darbar Square, Kathmandu", image: "/images/1.png" },
    { id: 2, name: "Taragaon Next", image: "/images/2.png" },
    { id: 3, name: "Chandragiri Temple", image: "/images/3.png" },
    { id: 4, name: "Shree Kaal Bhairav Temple", image: "/images/4.png" },
    { id: 5, name: "Tin Tale Waterfall", image: "/images/5.png" },
    { id: 6, name: "Kaleshwor Mahadev Temple", image: "/images/6.png" },
    { id: 7, name: "Buddha Stupa", image: "/images/7.png" },
    { id: 8, name: "Pashupatinath Temple", image: "/images/8.png" },
    { id: 9, name: "Bhaktapur Darbar Square", image: "/images/9.png" },
    { id: 10, name: "Patan Krishna Temple", image: "/images/10.png" },
];

export default function PlaceBanner() {
    const containerRef = useRef(null);
    const [destinations, setDestinations] = useState([]);
    const cardWidth = useRef(0);
    const navigate = useNavigate();

    useEffect(() => {
        const cloneStart = originalDestinations.slice(-3);
        const cloneEnd = originalDestinations.slice(0, 3);
        setDestinations([...cloneStart, ...originalDestinations, ...cloneEnd]);

        setTimeout(() => {
            if (containerRef.current) {
                const container = containerRef.current;
                const firstCard = container.children[3];
                cardWidth.current = firstCard.offsetWidth;
                container.scrollLeft = firstCard.offsetLeft;
            }
        }, 100);
    }, []);

    const handleScroll = () => {
        const container = containerRef.current;
        const scrollLeft = container.scrollLeft;
        const totalCards = destinations.length;
        const firstRealIndex = 3;
        const lastRealIndex = totalCards - 3;

        if (scrollLeft >= container.children[lastRealIndex].offsetLeft) {
            container.scrollLeft = container.children[firstRealIndex].offsetLeft;
        }

        if (scrollLeft <= container.children[0].offsetLeft) {
            container.scrollLeft = container.children[lastRealIndex - 1].offsetLeft;
        }
    };

    const scrollByCards = (count) => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: count * cardWidth.current,
                behavior: "smooth",
            });
        }
    };

    const handleExploreClick = (destinationName) => {
        // You can log or use the destinationName if needed
        console.log(`Exploring ${destinationName}`);
        navigate("/places");
    };

    return (
        <div className="place-container">
            <h1 className="place-title">Top destinations for your next vacation</h1>

            <div className="carousel-container">
                <button className="nav-button prev-button" onClick={() => scrollByCards(-1)}>
                    <ChevronLeft className="nav-icon" />
                </button>

                <div className="carousel" ref={containerRef} onScroll={handleScroll}>
                    {destinations.map((destination, index) => (
                        <div key={`${destination.id}-${index}`} className="card">
                            <img
                                src={destination.image}
                                alt={destination.name}
                                className="card-image"
                            />
                            <div className="card-overlay">
                                <div className="card-title">{destination.name}</div>
                                <button
                                    className="place-explore-button"
                                    onClick={() => handleExploreClick(destination.name)}
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="nav-button next-button" onClick={() => scrollByCards(1)}>
                    <ChevronRight className="nav-icon" />
                </button>
            </div>
        </div>
    );
}
