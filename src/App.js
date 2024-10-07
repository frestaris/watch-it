import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import MovieDetail from "./components/MovieDetail";

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => {
      const isMovieWatched = watched.some(
        (watchedMovie) => watchedMovie.imdbID === movie.imdbID
      );
      if (!isMovieWatched) {
        return [...watched, movie];
      }
      return watched;
    });
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  const handleClickHamburger = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  const handleCloseMovie = () => {
    setSelectedId(null);
  };

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

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

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
              <Sidebar
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
                onSelectMovie={(id) => {
                  handleSelectMovie(id);
                  handleCloseSidebar(); // Close the sidebar when a movie is selected
                }}
                isOpen={isSidebarOpen}
                onCloseSidebar={handleCloseSidebar}
              />
            </>
          ) : (
            <div className="toggle-icon" onClick={handleClickHamburger}>
              ☰
            </div>
          )}
        </div>
        {!selectedId ? (
          <Main
            movies={movies}
            onSelectMovie={handleSelectMovie}
            onAddWatched={handleAddWatched}
          />
        ) : (
          <MovieDetail
            selectedId={selectedId}
            onCloseMovie={handleCloseMovie}
            onAddWatched={handleAddWatched}
            watched={watched}
            setWatched={setWatched}
          />
        )}
      </div>
    </div>
  );
};

export default App;
