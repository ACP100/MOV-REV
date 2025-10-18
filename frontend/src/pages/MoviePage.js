
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import ReviewForm from '../components/ReviewForm';
import { apiRequest } from '../utils/api';

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchMovieData(); // This should ALWAYS work - no auth needed
    
    if (token) {
      checkUserPreferences(); // This requires auth
    }
  }, [id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      // Use regular fetch for public movie data
      const [movieRes, reviewsRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/movies/${id}`).then(res => res.json()),
        fetch(`http://127.0.0.1:8000/api/movies/${id}/reviews`).then(res => res.json())
      ]);
      
      setMovie(movieRes);
      setReviews(reviewsRes);
      
      // Fetch similar movies (public API call)
      try {
        const similarRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=YOUR_TMDB_API_KEY`
        ).then(res => res.json());
        setSimilarMovies(similarRes.results?.slice(0, 10) || []);
      } catch (error) {
        console.error('Error fetching similar movies:', error);
        setSimilarMovies([]);
      }
    } catch (err) {
      console.error('Error fetching movie data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserPreferences = async () => {
    try {
      // This requires auth - use apiRequest
      const response = await apiRequest(`http://localhost:8000/api/user/preferences/${id}`);
      
      if (!response.ok) {
        // If token is invalid, just don't show user preferences
        console.log('Token invalid - hiding user preferences');
        setIsLoggedIn(false);
        return;
      }
      
      const preferences = await response.json();
      setIsFavorite(preferences.is_favorite);
      setIsWatched(preferences.is_watched);
      setIsInWatchlist(preferences.is_in_watchlist);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      // Don't redirect here - just don't show the user's preferences
      setIsLoggedIn(false);
    }
  };

  const refreshReviews = async () => {
    try {
      // Public endpoint - use regular fetch
      const reviewsRes = await fetch(`http://127.0.0.1:8000/api/movies/${id}/reviews`).then(res => res.json());
      setReviews(reviewsRes);
    } catch (err) {
      console.error('Error refreshing reviews:', err);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      alert('Please login to add to favorites');
      return;
    }

    try {
      const response = await apiRequest(
        `http://localhost:8000/api/user/favorites/${id}`, 
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIsFavorite(data.is_favorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
      // If token expired during the action, redirect to login
      if (error.message.includes('Token expired') || error.message.includes('401')) {
        alert('Please login again to continue');
        window.location.href = '/login';
      }
    }
  };

  const handleWatched = async () => {
    if (!isLoggedIn) {
      alert('Please login to mark as watched');
      return;
    }

    try {
      const response = await apiRequest(
        `http://localhost:8000/api/user/watched/${id}`, 
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIsWatched(data.is_watched);
    } catch (error) {
      console.error('Error updating watched status:', error);
      if (error.message.includes('Token expired') || error.message.includes('401')) {
        alert('Please login again to continue');
        window.location.href = '/login';
      }
    }
  };

  const handleWatchlist = async () => {
    if (!isLoggedIn) {
      alert('Please login to add to watchlist');
      return;
    }

    try {
      const response = await apiRequest(
        `http://localhost:8000/api/user/watchlist/${id}`, 
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIsInWatchlist(data.is_in_watchlist);
    } catch (error) {
      console.error('Error updating watchlist:', error);
      if (error.message.includes('Token expired') || error.message.includes('401')) {
        alert('Please login again to continue');
        window.location.href = '/login';
      }
    }
  };


  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-page">
        <div className="loading">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-page">
        <div className="loading">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="movie-page">
      {/* Close Button */}
      <button onClick={handleClose} className="close-button">
        <span>×</span>
      </button>
      
      <div className="movie-layout">
        {/* Left Column - Poster */}
        <div className="poster-column">
          <div className="movie-poster-large">
            <img 
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-movie.jpg'
              } 
              alt={movie.title}
            />
          </div>
          
          {/* Action Buttons below poster */}
          <div className="movie-action-buttons">
            <button
              className={`movie-action-button ${isFavorite ? 'active' : ''}`}
              onClick={handleFavorite}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <img
                src={isFavorite ? "/icons/heart_filled.png" : "/icons/heart_outline.png"}
                alt="Favorite"
                className="movie-action-icon"
              />
            </button>

            <button
              className={`movie-action-button ${isWatched ? 'active' : ''}`}
              onClick={handleWatched}
              title={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
            >
              <img
                src={isWatched ? "/icons/eye_filled.png" : "/icons/eye_outline.png"}
                alt="Watched"
                className="movie-action-icon"
              />
            </button>

            <button
              className={`movie-action-button ${isInWatchlist ? 'active' : ''}`}
              onClick={handleWatchlist}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <img
                src={isInWatchlist ? "/icons/list_filled.png" : "/icons/list_outline.png"}
                alt="Watchlist"
                className="movie-action-icon"
              />
            </button>
          </div>
        </div>

        {/* Middle Column - Movie Info */}
        <div className="movie-info-column">
          <h1 className="movie-title-main">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="movie-tagline">"{movie.tagline}"</p>
          )}
          
          {/* Overview */}
          <div className="movie-overview-section">
            <h3>Overview</h3>
            <p className="movie-overview-text">{movie.overview || 'No overview available.'}</p>
          </div>

          {/* Movie Meta Data */}
          <div className="movie-meta-grid">
            <div className="meta-item">
              <strong>Release Date:</strong> 
              <span>{movie.release_date || 'N/A'}</span>
            </div>
            
            <div className="meta-item">
              <strong>Duration:</strong> 
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
            
            <div className="meta-item">
              <strong>Rating:</strong> 
              <span className="rating-badge">
                {movie.vote_average?.toFixed(1)}/10
              </span>
            </div>
            
            <div className="meta-item">
              <strong>Vote Count:</strong> 
              <span>{movie.vote_count?.toLocaleString() || 0}</span>
            </div>
            
            {movie.budget && movie.budget > 0 && (
              <div className="meta-item">
                <strong>Budget:</strong> 
                <span>{formatCurrency(movie.budget)}</span>
              </div>
            )}
            
            {movie.revenue && movie.revenue > 0 && (
              <div className="meta-item">
                <strong>Revenue:</strong> 
                <span>{formatCurrency(movie.revenue)}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="genres-section">
              <strong>Genres: </strong>
              {movie.genres.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="cast-column">
            <h2 className="section-title">Cast</h2>
            <div className="cast-list">
              {movie.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="cast-item">
                  <img
                    src={actor.profile_path 
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : '/placeholder-person.jpg'
                    }
                    alt={actor.name}
                    className="cast-photo-small"
                  />
                  <div className="cast-info-compact">
                    <strong>{actor.name}</strong>
                    <p>{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
        

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="section-header">
          <h2 className="section-title">Reviews ({reviews.length})</h2>
        </div>
        
        {reviews.length > 0 ? (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <h3 className="review-title">{review.title}</h3>
                  <div className="review-rating-badge">
                    ⭐ {review.rating}/10
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-footer">
                  <span className="review-author">
                    By: <strong>{review.username}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}
        
        {/* Review Form */}
        {isLoggedIn ? (
          <ReviewForm movieId={id} onReviewSubmitted={refreshReviews} />
        ) : (
          <div className="login-prompt">
            <p>
              <a href="/login" className="auth-link">Login</a> to submit a review
            </p>
          </div>
        )}
      </div>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="similar-movies-section">
          <div className="section-header">
            <h2 className="section-title">Similar Movies</h2>
          </div>
          <div className="movie-scroll-container">
            {similarMovies.map((similarMovie) => (
              <div key={similarMovie.id} className="scroll-movie-card">
                <MovieCard movie={similarMovie} showActions={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MoviePage;