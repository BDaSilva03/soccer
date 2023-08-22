import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar({ correctGuesses, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const saveScore = async () => {
    if (correctGuesses > 0) {
      try {
        await axios.post(
          "/saveScore",
          { score: correctGuesses },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  };

  const handleLogout = async () => {
    await saveScore();
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="correct-guesses d-flex justify-content-between align-items-center">
      <span>Correct guesses in a row: {correctGuesses}</span>
      <div
        className="navbar-dropdown"
        onClick={toggleDropdown}
        ref={dropdownRef}
      >
        Menu
        <div className={`dropdown-content ${showDropdown ? "show" : ""}`}>
          {location.pathname === "/profile" ? (
            <button
              onClick={() => navigate("/game")}
              className="btn btn-primary"
              id="Profile"
            >
              Back to Game
            </button>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className="btn btn-primary"
              id="Profile"
            >
              Profile
            </button>
          )}
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
