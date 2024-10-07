import React from "react";
import Search from "./Search";
import "./Navbar.css";
import cinemaLogo from "../assets/cinema-camera.png";

const Navbar = ({ setQuery }) => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={cinemaLogo} alt="Cinema Logo" />
        <div>Watch it!</div>
      </div>
      <Search setQuery={setQuery} />
    </div>
  );
};

export default Navbar;
