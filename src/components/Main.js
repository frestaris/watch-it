import React from "react";
import "./Main.css";

const Main = ({ movies, onSelectMovie }) => {
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
                className="card-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
