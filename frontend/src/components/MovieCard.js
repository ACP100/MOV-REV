import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../utils/api';

function MovieCard({ movie, showActions = true }) {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log(`MovieCard ${movie.id} - States:`, { isFavorite, isWatched, isInWatchlist, isLoggedIn });

  // Use useCallback for checkUserPreferences
  const checkUserPreferences = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking preferences for movie:', movie.id, 'Token:', token);
      
      if (!token) {
        console.log('No token found, skipping preference check');
        return;
      }

      const response = await apiRequest(`http://localhost:8000/api/user/preferences/${movie.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const preferences = await response.json();
      console.log('Preferences API Response:', preferences);
      setIsFavorite(preferences.is_favorite);
      setIsWatched(preferences.is_watched);
      setIsInWatchlist(preferences.is_in_watchlist);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  }, [movie.id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('MovieCard useEffect - Token exists:', !!token);
    setIsLoggedIn(!!token);
    
    if (token) {
      checkUserPreferences();
    } else {
      console.log('User not logged in, resetting preferences');
      setIsFavorite(false);
      setIsWatched(false);
      setIsInWatchlist(false);
    }
  }, [checkUserPreferences]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== FAVORITE BUTTON CLICKED ===');
    console.log('Movie ID:', movie.id);
    console.log('Current favorite state:', isFavorite);
    console.log('User logged in:', isLoggedIn);

    if (!isLoggedIn) {
      alert('Please login to add to favorites');
      return;
    }

    try {
      console.log('Making API call to toggle favorite...');

      const response = await apiRequest(
        `http://localhost:8000/api/user/favorites/${movie.id}`, 
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Favorite API Response:', data);
      const newFavoriteState = data.is_favorite;
      console.log('Setting favorite state to:', newFavoriteState);
      setIsFavorite(newFavoriteState);
      
    } catch (error) {
      console.error('ERROR updating favorite:', error);
      alert('Error updating favorite. Check console for details.');
    }
  };

  const handleWatched = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== WATCHED BUTTON CLICKED ===');
    console.log('Current watched state:', isWatched);

    if (!isLoggedIn) {
      alert('Please login to mark as watched');
      return;
    }

    try {
      const response = await apiRequest(
        `http://localhost:8000/api/user/watched/${movie.id}`, 
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Watched API Response:', data);
      setIsWatched(data.is_watched);
    } catch (error) {
      console.error('ERROR updating watched status:', error);
    }
  };

  const handleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== WATCHLIST BUTTON CLICKED ===');
    console.log('Current watchlist state:', isInWatchlist);

    if (!isLoggedIn) {
      alert('Please login to add to watchlist');
      return;
    }

    try {
      const response = await apiRequest(
        `http://localhost:8000/api/user/watchlist/${movie.id}`, 
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Watchlist API Response:', data);
      setIsInWatchlist(data.is_in_watchlist);
    } catch (error) {
      console.error('ERROR updating watchlist:', error);
    }
  };

  return (
    <div className="movie-card-fade">
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%', position: 'relative' }}>
     <img
      src={
        movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '/placeholder-movie.jpg'
      }
      alt={movie.title}
      loading="lazy"
      />
        
        {/* Conditionally render action buttons */}
        {showActions && (
          <div className="movie-card-top-fade">
            <div className="movie-card-top-actions">
              
              <button 
                className={`top-action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleFavorite}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <img 
                  src={isFavorite ? "/icons/heart_filled.png" : "/icons/heart_outline.png"} 
                  alt="Favorite" 
                  className="action-icon"
                />
              </button>

              <button 
                className={`top-action-btn watched-btn ${isWatched ? 'active' : ''}`}
                onClick={handleWatched}
                title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
              >
                <img 
                  src={isWatched ? "/icons/eye_filled.png" : "/icons/eye_outline.png"} 
                  alt="Watched" 
                  className="action-icon"
                />
              </button>
              <button 
                className={`top-action-btn watchlist-btn ${isInWatchlist ? 'active' : ''}`}
                onClick={handleWatchlist}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <img 
                  src={isInWatchlist ? "/icons/list_filled.png" : "/icons/list_outline.png"} 
                  alt="Watchlist" 
                  className="action-icon"
                />
              </button>
            </div>
          </div>
        )}
        
        {/* Bottom fade overlay for movie info */}
        <div className="movie-card-fade-content">
          <h3>{movie.title}</h3>
          <div className="movie-card-fade-info">
            <div className="movie-rating">
              ⭐ {movie.vote_average?.toFixed(1)}/10
            </div>
            <div className="movie-year">
              {releaseYear}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;