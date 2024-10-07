import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import "./MovieDetail.css";

const MovieDetail = ({ selectedId, onCloseMovie, watched, onAddWatched }) => {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating =
    watched.find((movie) => movie.imdbID === selectedId)?.userRating || 0;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleRating = (rate) => {
    setUserRating(rate);
  };

  function handleAdd() {
    if (userRating > 0) {
      const newWatchedMovie = {
        ...movie,
        userRating: userRating,
      };
      onAddWatched(newWatchedMovie);
    } else {
      alert("Rate the movie first.");
    }
  }

  useEffect(() => {
    async function getMovieDetails() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=290d53a8&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);

      // Only set user rating from watched if it's already rated
      if (isWatched && watchedUserRating > 0) {
        setUserRating(watchedUserRating);
      } else {
        setUserRating(0); // Reset user rating to allow rating
      }
    }
    getMovieDetails();
  }, [selectedId, isWatched, watchedUserRating]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onCloseMovie]);

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "Watched it!";
      };
    },
    [title]
  );

  return (
    <div className="details">
      <div className="hero">
        <img className="hero-image" src={poster} alt={`Poster of ${title}`} />
        <button className="btn-back" onClick={onCloseMovie}>
          &larr; Back
        </button>
      </div>

      <div className="hero-overview">
        <h2>{title}</h2>
        <p>Published: {released}</p>
        <p>Duration: {runtime}</p>
        <p>Genre: {genre}</p>
        <p>
          <span>⭐</span>
          {imdbRating} IMDB Rating
        </p>

        <div className="rating">
          {isWatched ? (
            <p>
              <span>⭐</span>
              {watchedUserRating} Your Rating
            </p>
          ) : (
            <>
              <StarRatings
                rating={userRating}
                starRatedColor="#e7be35"
                starHoverColor="#e7be35"
                starDimension="24px"
                starSpacing="2px"
                numberOfStars={10}
                changeRating={handleRating}
              />
              {!isWatched ? (
                <button className="btn-add" onClick={handleAdd}>
                  Add
                </button>
              ) : (
                ""
              )}
            </>
          )}
        </div>

        <p>
          <em>{plot}</em>
        </p>
        <p>Starring: {actors}</p>
        <p>Directed by: {director}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
