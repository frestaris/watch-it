import React from "react";
import "./Sidebar.css";

const Sidebar = ({ watched, onDeleteWatched, onSelectMovie, isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <h2>Your Movies: {watched.length}</h2>
      {watched.length === 0 ? (
        <p>No movies watched yet.</p>
      ) : (
        <ul className="watched-movie-list">
          {watched
            .slice(0)
            .reverse()
            .map((movie) => (
              <li key={movie.imdbID} className="card">
                <div
                  className="card-container"
                  onClick={() => {
                    onSelectMovie(movie.imdbID);
                  }}
                >
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="card-image"
                  />
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteWatched(movie.imdbID);
                    }}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
