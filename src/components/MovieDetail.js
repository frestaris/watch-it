import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import "./MovieDetail.css";

const MovieDetail = ({ selectedId, onCloseMovie, watched, onAddWatched }) => {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setLoading(false);

      if (isWatched && watchedUserRating > 0) {
        setUserRating(watchedUserRating);
      } else {
        setUserRating(0);
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
        {loading ? (
          <div className="loader"></div>
        ) : (
          <img
            className="hero-image"
            src={poster ? poster : loading}
            alt={`Poster of ${title}`}
          />
        )}

        <button className="btn-back" onClick={onCloseMovie}>
          &larr; Back
        </button>
      </div>

      {!loading && (
        <div className="hero-overview">
          <h2>{title}</h2>
          <p>Published: {released}</p>
          <p>Duration: {runtime}</p>
          <p>Genre: {genre}</p>
          <p>
            IMDB Rating - {imdbRating}
            <span>⭐</span>
          </p>

          <div className="rating">
            {isWatched ? (
              <p>
                Your Rating - {watchedUserRating}
                <span>⭐</span>
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
      )}
    </div>
  );
};

export default MovieDetail;
