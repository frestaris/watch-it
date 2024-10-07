import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import MovieDetail from "./components/MovieDetail";
import video from "./assets/video.png";

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue) || [];
  });
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));

    if (window.innerWidth <= 500) {
      setIsSidebarOpen(false);
    }
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

  const fetchMovies = useCallback(
    async (pageNum) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${query}&page=${pageNum}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong while fetching movies.");
        }

        setMovies((prevMovies) => [...prevMovies, ...(data.Search || [])]);
        setTotalResults(data.totalResults || 0);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    if (query.length > 2) {
      setMovies([]);
      setPage(1);
      fetchMovies(1);
    } else {
      setMovies([]);
    }
  }, [query, fetchMovies]);

  const loadMoreMovies = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page, fetchMovies]);

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

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
              <Sidebar
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
                onSelectMovie={handleSelectMovie}
                isOpen={isSidebarOpen}
                handleCloseSidebar={handleCloseSidebar}
              />
            </>
          ) : (
            <div className="toggle-icon" onClick={handleClickHamburger}>
              <img src={video} alt="clapper board" />
              <div className="column-text">
                <div>
                  <p>Y</p>
                  <p>O</p>
                  <p>U</p>
                  <p>R</p>
                </div>
                <div>
                  <p>L</p>
                  <p>I</p>
                  <p>S</p>
                  <p>T</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="loader"></div>
        ) : !selectedId ? (
          <Main
            movies={movies}
            onSelectMovie={handleSelectMovie}
            totalResults={totalResults}
            loadMoreMovies={loadMoreMovies}
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
