import React from "react";
import "./Sidebar.css";

const Sidebar = ({ watched, onDeleteWatched, isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <h2>Watched it!</h2>
      {watched.length === 0 ? (
        <p>No movies watched yet.</p>
      ) : (
        <ul className="watched-movie-list">
          {watched.map((movie) => (
            <li key={movie.imdbID} className="card">
              <div className="card-container">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="card-image"
                />
                <button
                  className="delete-button"
                  onClick={() => onDeleteWatched(movie.imdbID)}
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
