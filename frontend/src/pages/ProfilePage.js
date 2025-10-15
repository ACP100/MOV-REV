import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
// import '../styles/global.css';

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reviews');
  const [moviesData, setMoviesData] = useState({
    favorites: [],
    watched: [],
    watchlist: []
  });
  const navigate = useNavigate();

  // Function to fetch movie details from TMDB
  const fetchMovieDetails = useCallback(async (movieId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/movies/${movieId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, error);
      return null;
    }
  }, []);

  // Function to fetch all movie details for a list of IDs
  const fetchAllMovieDetails = useCallback(async (movieIds) => {
    const movies = [];
    for (const movieId of movieIds) {
      const movie = await fetchMovieDetails(movieId);
      if (movie) {
        movies.push(movie);
      }
    }
    return movies;
  }, [fetchMovieDetails]);

  // Fetch profile data function wrapped in useCallback
  const fetchProfileData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/user/profile-data', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      setProfileData(data);

      // If we only have movie IDs, fetch the movie details
      if (data.favorites && data.favorites.length > 0 && typeof data.favorites[0] === 'number') {
        console.log('Fetching movie details for favorites, watched, watchlist...');
        
        const [favorites, watched, watchlist] = await Promise.all([
          fetchAllMovieDetails(data.favorites),
          fetchAllMovieDetails(data.watched),
          fetchAllMovieDetails(data.watchlist)
        ]);

        setMoviesData({
          favorites,
          watched,
          watchlist
        });
      } else {
        // We already have full movie data
        setMoviesData({
          favorites: data.favorites || [],
          watched: data.watched || [],
          watchlist: data.watchlist || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [navigate, fetchAllMovieDetails]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  // Get the current movies based on active tab
  const getCurrentMovies = () => {
    switch (activeTab) {
      case 'favorites':
        return moviesData.favorites;
      case 'watched':
        return moviesData.watched;
      case 'watchlist':
        return moviesData.watchlist;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container">
        <div className="error-message">No profile data found</div>
      </div>
    );
  }

  const { user, reviews, stats } = profileData;
  const currentMovies = getCurrentMovies();

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo-container">
            <img src="/logo.png" alt="App Logo" className="app-logo" />
            <h1 className="app-title">MOV REV</h1>
          </div>
          <nav className="nav-menu">
            <div className="nav-buttons">
              <Link to="/" className="home-image-button">
                <img src="/icons/home_filled.png" alt="Home" />
              </Link>
              <button onClick={handleLogout} className="logout-image-button">
                <img src="/logout.png" alt="Logout" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Rest of content inside container */}
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-info">
            <h1 className="profile-username">Welcome, {user.username}!</h1>
            <p className="profile-email">{user.email}</p>
          </div>
          
          
          
          
          {/* Stats Cards */}
          <div className="stats-container">
             <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <div className="stats-card">
              <div className="stats-icon">
                <img src="/icons/star_filled.png" alt="Reviews" className="stats-icon-img" />
              </div>
              <div className="stats-value">{stats.reviews_count}</div>
              <div className="stats-title">Reviews</div>
      
            </div>
            </button>

            
          <button 
            className={`tab-button ${activeTab === 'favorites'  ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <div className="stats-card">  
              <div className="stats-icon">
                <img src="/icons/heart_filled.png" alt="Favorites" className="stats-icon-img" />
              </div>
              <div className="stats-value">{stats.favorites_count}</div>
              <div className="stats-title">Favorites</div>

            </div>
          </button>  
          
            
          <button 
            className={`tab-button ${activeTab === 'watched' ? 'active' : ''}`}
            onClick={() => setActiveTab('watched')}
          >
            <div className="stats-card">
              <div className="stats-icon">
                <img src="/icons/eye_filled.png" alt="Watched" className="stats-icon-img" />
              </div>
              <div className="stats-value">{stats.watched_count}</div>
              <div className="stats-title">Watched</div>

            </div>
          </button>  
            
             <button 
            className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >   
            <div className="stats-card">
              <div className="stats-icon">
                <img src="/icons/list_filled.png" alt="Watchlist" className="stats-icon-img" />
              </div>
              <div className="stats-value">{stats.watchlist_count}</div>
              <div className="stats-title">Watchlist</div>
            </div>
           </button>   
          </div>
        </div>

        
        
        
        {/* Navigation Tabs
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <img src="/icons/star_filled.png" alt="Reviews" className="tab-icon" />
            Reviews ({stats.reviews_count})
          </button>
          <button 
            className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <img src="/icons/heart_filled.png" alt="Favorites" className="tab-icon" />
            Favorites ({stats.favorites_count})
          </button>
          <button 
            className={`tab-button ${activeTab === 'watched' ? 'active' : ''}`}
            onClick={() => setActiveTab('watched')}
          >
            <img src="/icons/eye_filled.png" alt="Watched" className="tab-icon" />
            Watched ({stats.watched_count})
          </button>
          <button 
            className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            <img src="/icons/list_filled.png" alt="Watchlist" className="tab-icon" />
            Watchlist ({stats.watchlist_count})
          </button>
        </div> */}

        {/* Tab Content */}
        <div className="tab-content">
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="reviews-section">
              {reviews.length > 0 ? (
                <div className="reviews-grid">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-movie-header">
                        <Link to={`/movie/${review.movie_id}`} className="review-movie-link">
                          <h3 className="review-movie-title">
                            {review.movie_title}
                          </h3>
                        </Link>
                        <div className="review-rating">
                          <img src="/icons/star_filled.png" alt="Rating" className="rating-icon" />
                          {review.rating}/10
                        </div>
                      </div>
                      {review.title && (
                        <h4 className="review-title">{review.title}</h4>
                      )}
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-date">
                        Reviewed on {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-content-message">
                  <h3>No reviews yet</h3>
                  <p>Start reviewing movies to see them here!</p>
                  <Link to="/" className="nav-button home-button">
                    <img src="/icons/home_filled.png" alt="Home" className="button-icon" />
                    Browse Movies
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Movies Tabs (Favorites, Watched, Watchlist) */}
          {(activeTab === 'favorites' || activeTab === 'watched' || activeTab === 'watchlist') && (
            <div className="movies-section">
              {currentMovies.length > 0 ? (
                <div className="movie-grid">
                  {currentMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} showActions={false} />
                  ))}
                </div>
              ) : (
                <div className="no-content-message">
                  <h3>
                    {activeTab === 'favorites' && 'No favorite movies yet'}
                    {activeTab === 'watched' && 'No watched movies yet'}
                    {activeTab === 'watchlist' && 'Watchlist is empty'}
                  </h3>
                  <p>
                    {activeTab === 'favorites' && 'Click the heart icon on movies to add them to favorites!'}
                    {activeTab === 'watched' && 'Mark movies as watched to see them here!'}
                    {activeTab === 'watchlist' && 'Add movies to your watchlist to see them here!'}
                  </p>
                  <Link to="/" className="nav-button home-button">
                    <img src="/icons/home_filled.png" alt="Home" className="button-icon" />
                    Browse Movies
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;