import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings"; // Import the StarRatings component
import "./MovieDetail.css";

const MovieDetail = ({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
  setWatched,
}) => {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0); // Initialize with a number (0)
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating =
    watched.find((movie) => movie.imdbID === selectedId)?.userRating || 0; // Default to 0 if not found

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
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.replace(/\D/g, "")),
      userRating,
    };

    // Call the parent function to add to watched list
    onAddWatched(newWatchedMovie);

    // Update the local state
    setWatched((watched) => [...watched, newWatchedMovie]);
  }

  useEffect(() => {
    async function getMovieDetails() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=290d53a8&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      // If the movie has been watched, set the user rating
      if (isWatched) {
        setUserRating(watchedUserRating);
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

  return (
    <div className="details">
      <div className="hero">
        <img className="hero-image" src={poster} alt={`Poster of ${title}`} />
        <button className="btn-back" onClick={onCloseMovie}>
          &larr; Back
        </button>
        <button className="btn-add" onClick={handleAdd}>
          +
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
          {!isWatched ? (
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
            </>
          ) : (
            <p>You rated this movie {watchedUserRating}</p>
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
