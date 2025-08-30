import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import "./touristguide.css";

const TouristGuide = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuide, setIsGuide] = useState(null); // null = unknown, true/false known
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!savedUser || !token) {
            setLoading(false);
            return;
        }

        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // Try to read cached guide status 
        const cachedIsGuide = localStorage.getItem("isTouristGuide");
        if (cachedIsGuide !== null) {
            setIsGuide(cachedIsGuide === "true");
            setLoading(false);
            if (cachedIsGuide === "true") {
                navigate("/touristguide-dashboard", { replace: true });
            }
        } else {
            // No cached info, fetch from backend and cache result
            checkIfTouristGuide(parsedUser._id, token);
        }
    }, [navigate]);

    const checkIfTouristGuide = async (userId, token) => {
        try {
            const res = await fetch(`http://localhost:8800/api/touristguides/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setIsGuide(true);
                localStorage.setItem("isTouristGuide", "true");
                navigate("/touristguide-dashboard", { replace: true });
            } else if (res.status === 404) {
                setIsGuide(false);
                localStorage.setItem("isTouristGuide", "false");
                setLoading(false);
            } else {
                console.error("Unexpected error checking tourist guide status");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching tourist guide status:", error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("isTouristGuide"); // clear cached flag on logout
        window.location.href = "/login";
    };

    const handleContinueAsUser = () => {
        navigate("/user-dashboard");
    };

    const handleContinueAsGuide = () => {
        navigate("/create-tourist-guide");
    };

    const ChoicePage = () => (
        <>
            <Navbar />
            <Header />
            <div className="tourist-choice-page">
                <div className="tourist-card">
                    <h2>
                        Welcome, <span className="tourist-highlight">{user?.username}</span>!
                    </h2>
                    <p className="tourist-subtext">How do you want to continue?</p>
                    <div className="tourist-buttons">
                        <button onClick={handleContinueAsUser}>Continue as User</button>
                        <button onClick={handleContinueAsGuide}>Continue as Tourist Guide</button>
                    </div>
                    <button className="tourist-logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );

    if (loading) return null;

    if (!user) return <Navigate to="/login" replace />;

    if (isGuide === false) return <ChoicePage />;

    if (isGuide === true) return <Navigate to="/touristguide-dashboard" replace />;

    return null;
};

export default TouristGuide;
