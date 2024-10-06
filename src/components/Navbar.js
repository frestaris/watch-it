import React from "react";
import Search from "./Search";
import "./Navbar.css";

const Navbar = ({ setQuery }) => {
  return (
    <div className="navbar">
      <div className="logo">Watched it!</div>
      <Search setQuery={setQuery} />
    </div>
  );
};

export default Navbar;
