"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./image-slider.css";

const imagePaths = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/4.png",
    "/images/5.png",
    "/images/6.png",
    "/images/7.png",
    "/images/8.png",
    "/images/9.png",
    "/images/10.png",
];

const ImageSlider = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagePaths.length) % imagePaths.length);
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(nextImage, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slider-container">
            <img
                src={imagePaths[currentImageIndex]}
                alt={`Slide ${currentImageIndex + 1}`}
                className="slider-image"
            />
            <button className="slider-btn prev-btn" onClick={prevImage} aria-label="Previous">
                <ChevronLeft size={24} />
            </button>
            <button className="slider-btn next-btn" onClick={nextImage} aria-label="Next">
                <ChevronRight size={24} />
            </button>

            <div className="slider-dots">
                {imagePaths.map((_, index) => (
                    <div
                        key={index}
                        className={`slider-dot ${index === currentImageIndex ? "active" : ""}`}
                        onClick={() => goToImage(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
