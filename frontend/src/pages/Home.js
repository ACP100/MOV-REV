import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    setLoading(true);
    axios.get('http://localhost:8000/api/movies/trending')
      .then((res) => {
        setMovies(res.data.results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/movies/search?query=${searchQuery}`);
        setMovies(res.data.results);
      } catch (error) {
        console.error('Search failed:', error);
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <div>
      <header className="header">
        <div className="nav-container">
          <h1 className="app-title">Movie Review App</h1>
          
          <nav className="nav-menu">
            {isLoggedIn ? (
              <div className="nav-buttons">
                <Link to="/profile" className="nav-button">Profile</Link>
                <button onClick={handleLogout} className="nav-button logout-button">
                  Logout
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

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </header>

      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;