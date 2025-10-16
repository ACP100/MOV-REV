// frontend/src/components/SearchAutocomplete.js
import { Link } from 'react-router-dom';

function SearchAutocomplete({ suggestions, onSuggestionClick, isLoading }) {
  if (isLoading) {
    return (
      <div className="autocomplete-dropdown">
        <div className="autocomplete-loading">Loading suggestions...</div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="autocomplete-dropdown">
      {suggestions.slice(0, 5).map((movie) => (
        <Link
          key={movie.id}
          to={`/movie/${movie.id}`}
          className="autocomplete-item"
          onClick={() => onSuggestionClick(movie)}
        >
          <div className="autocomplete-poster">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : '/placeholder-movie.jpg'
              }
              alt={movie.title}
              loading="lazy"
            />
          </div>
          <div className="autocomplete-info">
            <div className="autocomplete-title">{movie.title}</div>
            <div className="autocomplete-year">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SearchAutocomplete;