import React from "react";
import "./Main.css";

const Main = ({ movies, onSelectMovie, onAddWatched }) => {
  return (
    <div className="main">
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-card"
            onClick={() => onSelectMovie(movie.imdbID)}
          >
            {movie.Poster && (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="movie-poster"
              />
            )}
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddWatched(movie);
              }}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
