"use client"

import React from "react"
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, MapPin, Phone, Edit, Save, X, LogOut, Camera, Eye, EyeOff, Lock, Calendar } from "lucide-react"
import axios from "axios"
import "./profile.css"
import { AuthContext } from "../../context/AuthContext"

const UserProfile = () => {
    const { user, dispatch } = useContext(AuthContext)
    const navigate = useNavigate()

    const [editMode, setEditMode] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [localError, setLocalError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        country: "",
        city: "",
        phone: "",
        img: "",
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const CLOUD_NAME = "doqbzwm1o"
    const UPLOAD_PRESET = "upload"

    const countries = [
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
        "Japan",
        "Brazil",
        "India",
        "China",
        "Mexico",
        "Italy",
        "Spain",
        "Netherlands",
        "Sweden",
        "Norway",
        "Denmark",
        "Finland",
    ]

    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || "",
                email: user.email || "",
                country: user.country || "",
                city: user.city || "",
                phone: user.phone || "",
                img: user.img || "",
            })
            setImagePreview(user.img || null)
        } else {
            // Redirect to login if no user
            navigate("/login")
        }
    }, [user, navigate])

    const handleChange = (e) => {
        const { id, value } = e.target
        setProfileData((prev) => ({ ...prev, [id]: value }))
    }

    const handlePasswordChange = (e) => {
        const { id, value } = e.target
        setPasswordData((prev) => ({ ...prev, [id]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const uploadImageToCloudinary = async () => {
        const data = new FormData()
        data.append("file", imageFile)
        data.append("upload_preset", UPLOAD_PRESET)

        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data)
            return res.data.secure_url
        } catch (err) {
            console.error("Image upload failed:", err)
            return null
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        setLocalError("")
        setSuccessMessage("")
        setIsLoading(true)

        try {
            let imageUrl = profileData.img
            if (imageFile) {
                imageUrl = await uploadImageToCloudinary()
                if (!imageUrl) {
                    setLocalError("Image upload failed.")
                    setIsLoading(false)
                    return
                }
            }

            // Update user profile
            const response = await axios.put(
                "/users/update",
                {
                    ...profileData,
                    img: imageUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            )

            // Update context with new user data
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
            setSuccessMessage("Profile updated successfully!")
            setEditMode(false)
        } catch (err) {
            setLocalError(err.response?.data?.message || "Failed to update profile.")
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        setLocalError("")
        setSuccessMessage("")
        setIsLoading(true)

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setLocalError("New passwords do not match.")
            setIsLoading(false)
            return
        }

        if (passwordData.newPassword.length < 8) {
            setLocalError("Password must be at least 8 characters long.")
            setIsLoading(false)
            return
        }

        try {
            // Update password
            await axios.put(
                "/users/change-password",
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            )

            setSuccessMessage("Password updated successfully!")
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        } catch (err) {
            setLocalError(err.response?.data?.message || "Failed to update password.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" })
        localStorage.removeItem("token")
        navigate("/login")
    }

    const cancelEdit = () => {
        setEditMode(false)
        setImageFile(null)
        // Reset to original user data
        if (user) {
            setProfileData({
                username: user.username || "",
                email: user.email || "",
                country: user.country || "",
                city: user.city || "",
                phone: user.phone || "",
                img: user.img || "",
            })
            setImagePreview(user.img || null)
        }
    }

    if (!user) {
        return <div className="profile-container">Loading...</div>
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1 className="profile-title">My Profile</h1>
                <button onClick={handleLogout} className="logout-button">
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="profile-image-container">
                        {imagePreview ? (
                            <img src={imagePreview || "/placeholder.svg"} alt="Profile" className="profile-image" />
                        ) : (
                            <div className="profile-image-placeholder">
                                <User size={50} />
                            </div>
                        )}
                        {editMode && (
                            <>
                                <label htmlFor="profile-image" className="profile-image-edit">
                                    <Camera size={18} />
                                </label>
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="profile-image-input"
                                />
                            </>
                        )}
                    </div>
                    <h2 className="profile-username">{user.username}</h2>
                    <p className="profile-email">{user.email}</p>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">12</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">148</span>
                            <span className="stat-label">Followers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">254</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    <div className="tab-navigation">
                        <button
                            className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
                            onClick={() => setActiveTab("personal")}
                        >
                            Personal Information
                        </button>
                        <button
                            className={`tab-button ${activeTab === "security" ? "active" : ""}`}
                            onClick={() => setActiveTab("security")}
                        >
                            Security
                        </button>
                    </div>

                    {activeTab === "personal" && (
                        <div className="profile-section">
                            <div className="section-header">
                                <h2 className="section-title">Personal Information</h2>
                                {!editMode ? (
                                    <button onClick={() => setEditMode(true)} className="edit-button">
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                ) : null}
                            </div>

                            {!editMode ? (
                                <div className="info-grid">
                                    <div className="info-item">
                                        <div className="info-label">
                                            <User size={16} /> Username
                                        </div>
                                        <div className="info-value">{user.username}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">
                                            <Mail size={16} /> Email
                                        </div>
                                        <div className="info-value">{user.email}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">
                                            <MapPin size={16} /> Country
                                        </div>
                                        <div className="info-value">{user.country || "Not specified"}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">
                                            <MapPin size={16} /> City
                                        </div>
                                        <div className="info-value">{user.city || "Not specified"}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">
                                            <Phone size={16} /> Phone
                                        </div>
                                        <div className="info-value">{user.phone || "Not specified"}</div>
                                    </div>
                                    <div className="info-item">
                                        <div className="info-label">
                                            <Calendar size={16} /> Member Since
                                        </div>
                                        <div className="info-value">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleProfileUpdate} className="profile-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="username" className="form-label">
                                                <User size={16} />
                                                Username
                                            </label>
                                            <input
                                                id="username"
                                                type="text"
                                                value={profileData.username}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label">
                                                <Mail size={16} />
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="country" className="form-label">
                                                <MapPin size={16} />
                                                Country
                                            </label>
                                            <select id="country" value={profileData.country} onChange={handleChange} className="form-select">
                                                <option value="">Select your country</option>
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city" className="form-label">
                                                <MapPin size={16} />
                                                City
                                            </label>
                                            <input
                                                id="city"
                                                type="text"
                                                value={profileData.city}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">
                                            <Phone size={16} />
                                            Phone Number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>

                                    {localError && <div className="error-text">{localError}</div>}
                                    {successMessage && <div className="success-text">{successMessage}</div>}

                                    <div className="form-actions">
                                        <button type="button" onClick={cancelEdit} className="cancel-button">
                                            <X size={16} />
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isLoading} className="save-button">
                                            {isLoading ? (
                                                "Saving..."
                                            ) : (
                                                <>
                                                    <Save size={16} />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="profile-section">
                            <div className="section-header">
                                <h2 className="section-title">Change Password</h2>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="currentPassword" className="form-label">
                                        <Lock size={16} />
                                        Current Password
                                    </label>
                                    <div className="password-container">
                                        <input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="password-toggle"
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="newPassword" className="form-label">
                                            <Lock size={16} />
                                            New Password
                                        </label>
                                        <div className="password-container">
                                            <input
                                                id="newPassword"
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="form-input"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="password-toggle"
                                            >
                                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            <Lock size={16} />
                                            Confirm New Password
                                        </label>
                                        <div className="password-container">
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="form-input"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="password-toggle"
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="password-requirements">
                                    <p className="password-requirements-title">Password requirements:</p>
                                    <ul className="password-requirements-list">
                                        <li>At least 8 characters long</li>
                                        <li>Must match the confirmation password</li>
                                    </ul>
                                </div>

                                {localError && <div className="error-text">{localError}</div>}
                                {successMessage && <div className="success-text">{successMessage}</div>}

                                <div className="form-actions">
                                    <button type="submit" disabled={isLoading} className="save-button">
                                        {isLoading ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile
