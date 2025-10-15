// import MovieDetails from '../components/MovieDetails';

// function MoviePage() {
//   return (
//     <div>
//       <MovieDetails />
//     </div>
//   );
// }

// export default MoviePage;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import ReviewForm from '../components/ReviewForm';
import '../styles/global.css';

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchMovieData();
  }, [id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const [movieRes, reviewsRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/movies/${id}`),
        axios.get(`http://127.0.0.1:8000/api/movies/${id}/reviews`)
      ]);
      
      setMovie(movieRes.data);
      setReviews(reviewsRes.data);
      
      // Fetch similar movies
      try {
        const similarRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=YOUR_TMDB_API_KEY`
        );
        setSimilarMovies(similarRes.data.results?.slice(0, 10) || []);
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

  const refreshReviews = async () => {
    try {
      const reviewsRes = await axios.get(`http://127.0.0.1:8000/api/movies/${id}/reviews`);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error('Error refreshing reviews:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate('/');
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
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="loading">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-page">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="loading">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="movie-page">
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      
      <div className="container">
        {/* Back Button */}
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={handleBack} className="back-button">
            <span>←</span>
            Back to Home
          </button>
        </div>

        {/* Movie Header Section */}
        <div className="movie-header-section">
          <div className="movie-poster-large">
            <img 
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-movie.jpg'
              } 
              alt={movie.title}
            />
          </div>
          
          <div className="movie-info-main">
            <h1 className="movie-title-main">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="movie-tagline">"{movie.tagline}"</p>
            )}
            
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

            {/* Overview */}
            <div className="movie-overview-section">
              <h3>Overview</h3>
              <p className="movie-overview-text">{movie.overview || 'No overview available.'}</p>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="cast-section">
            <h2 className="section-title">Cast</h2>
            <div className="cast-grid">
              {movie.credits.cast.slice(0, 12).map((actor) => (
                <div key={actor.id} className="cast-card">
                  <img
                    src={actor.profile_path 
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : '/placeholder-person.jpg'
                    }
                    alt={actor.name}
                    className="cast-photo"
                  />
                  <div className="cast-info">
                    <strong>{actor.name}</strong>
                    <p>{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                <Link to="/login" className="auth-link">Login</Link> to submit a review
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
    </div>
  );
}

// Header Component (same as Home.js)
function Header({ isLoggedIn, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="nav-container">
        <div className="logo-container">
          <img src="/logo.png" alt="App Logo" className="app-logo" />
          <h1 className="app-title">MOV REV</h1>
        </div>
        
        <div className="header-search">
          <form onSubmit={handleSearch} className="search-form compact">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="search-input compact"
              />
              <button type="submit" className="search-icon-button">
                🔍
              </button>
            </div>
          </form>
        </div>

        <nav className="nav-menu">
          {isLoggedIn ? (
            <div className="nav-buttons">
              <Link to="/profile" className="profile-image-button">
                <img src="/profile.png" alt="Profile" />
              </Link>
              <button onClick={onLogout} className="logout-image-button">
                <img src="/logout.png" alt="Logout" />
              </button>
            </div>
          ) : (
            <div className="nav-buttons">
              <Link to="/login" className="nav-button">Login</Link>
              <Link to="/register" className="nav-button register-button">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default MoviePage;