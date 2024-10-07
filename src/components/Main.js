import React from "react";
import "./Main.css";
import cinemaReel from "../assets/cinema-reel.png";

const Main = ({ movies, onSelectMovie, totalResults, loadMoreMovies }) => {
  return (
    <div className="main">
      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-card"
            onClick={() => onSelectMovie(movie.imdbID)}
          >
            <img
              className="card-image-main"
              src={movie.Poster ? movie.Poster : cinemaReel}
              alt={`Poster of ${movie.Title}`}
            />
          </div>
        ))}
      </div>
      {movies.length < totalResults && (
        <button className="load-more" onClick={loadMoreMovies}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Main;
