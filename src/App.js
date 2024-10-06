import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Initially closed on small screens
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=290d53a8&s=${query}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong while fetching movies.");
        }

        setMovies(data.Search || []);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (query.length > 2) {
      fetchMovies();
    } else {
      setMovies([]);
    }
  }, [query]);

  const handleSelectMovie = (id) => {
    setSelectedId(id);
  };

  const handleAddWatched = (movie) => {
    setWatched((prev) => [...prev, movie]);
    setSelectedId(null);
  };

  const handleClickHamburger = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 500) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Navbar setQuery={setQuery} />
      <div className="app-container">
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          {isSidebarOpen ? (
            <>
              <button className="close-button" onClick={handleCloseSidebar}>
                X
              </button>
              <Sidebar watched={watched} />
            </>
          ) : (
            <div className="toggle-icon" onClick={handleClickHamburger}>
              ☰
            </div>
          )}
        </div>
        <Main
          movies={movies}
          onSelectMovie={handleSelectMovie}
          onAddWatched={handleAddWatched}
        />
      </div>
    </div>
  );
};

export default App;
