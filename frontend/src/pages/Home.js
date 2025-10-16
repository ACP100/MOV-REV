// frontend/src/pages/Home.js
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchAutocomplete from '../components/SearchAutocomplete';
// import '../styles/global.css';

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [genres, setGenres] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // New states for filters
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Refs
  const trendingRef = useRef(null);
  const topRatedRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimer = useRef(null);
  const genreRefs = useRef({
  28: useRef(null),
  35: useRef(null),
  18: useRef(null),
  27: useRef(null),
  878: useRef(null),
  53: useRef(null)
});
  // Get current year for the year filter
  const currentYear = new Date().getFullYear();

  const popularGenres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 878, name: 'Sci-Fi' },
    { id: 53, name: 'Thriller' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchAllData();
  }, []);

  // Debounced search function for autocomplete
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    setShowSuggestions(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/movies/search?query=${encodeURIComponent(query)}`);
      setSuggestions(response.data.results || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  }, [fetchSuggestions]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((movie) => {
    setSearchQuery(movie.title);
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  // Handle search with filters
  const handleSearch = async (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    if (searchQuery.trim() || selectedGenre || selectedYear) {
      setLoading(true);
      setIsSearching(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
          params.append('query', searchQuery.trim());
        }
        if (selectedGenre) {
          params.append('genre', selectedGenre);
        }
        if (selectedYear) {
          params.append('year', selectedYear);
        }

        const response = await axios.get(`http://localhost:8000/api/movies/search?${params.toString()}`);
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      clearSearch();
    }
  };

  // Clear all search and filters
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedYear('');
    setIsSearching(false);
    setSearchResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedGenre || selectedYear;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
    setIsLoggedIn(false);
    window.location.reload();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Back to top functionality
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchAllData = async () => {
    console.time("homepage-load");
    setLoading(true);

    try {
      const [trendingRes, topRatedRes, genresRes, ...genreResults] = await Promise.all([
        axios.get('http://localhost:8000/api/movies/trending'),
        axios.get('http://localhost:8000/api/movies/top-rated'),
        axios.get('http://localhost:8000/api/genres'),
        ...popularGenres.map(genre => 
          axios.get(`http://localhost:8000/api/movies/genre/${genre.id}`)
        )
      ]);

      setTrendingMovies(trendingRes.data.results || []);
      setTopRatedMovies(topRatedRes.data.results || []);
      setGenres(genresRes.data.genres || []);

      const genreMoviesMap = {};
      genreResults.forEach((result, index) => {
        const genreId = popularGenres[index].id;
        genreMoviesMap[genreId] = result.data.results?.slice(0, 10) || [];
      });
      setGenreMovies(genreMoviesMap);

      setLoading(false);
      console.timeEnd("homepage-load");
    } catch (err) {
      console.error("Error fetching:", err);
      setLoading(false);
    }
  };

  // Scroll functions
  const scrollLeft = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <header className="header">
        <div className="nav-container">
          <div className="logo-container">
            <img src="/logo.png" alt="App Logo" className="app-logo" />
            <h1 className="app-title">MOV REV</h1>
          </div>
          <div className="header-search">
            <form onSubmit={handleSearch} className="search-form compact">
              <div className="search-filters-container">
                {/* Search Input */}
                <div className="search-input-wrapper" ref={searchInputRef}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for movies..."
                    className="search-input compact"
                  />
                  <button type="submit" className="search-icon-button">
                    <img src="/icons/search.png" alt="Search" />
                  </button>
                  {showSuggestions && (
                    <SearchAutocomplete
                      suggestions={suggestions}
                      onSuggestionClick={handleSuggestionClick}
                      isLoading={isLoadingSuggestions}
                    />
                  )}
                </div>

                {/* Genre Filter */}
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="filter-select genre-filter"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>

                {/* Year Filter */}
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  placeholder="Year"
                  min="1900"
                  max={currentYear}
                  className="filter-input year-filter"
                />
              </div>

              {/* Clear Button - Show when searching or filters are active */}
              {(isSearching || hasActiveFilters) && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="search-button compact clear"
                >
                  ✕
                </button>
              )}
            </form>
          </div>
          <nav className="nav-menu">
            {isLoggedIn ? (
              <div className="nav-buttons">
                <Link to="/profile" className="profile-image-button">
                  <img src="/profile.png" alt="Profile" />
                </Link>
                <button onClick={handleLogout} className="logout-image-button">
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

      <div className="container">
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : isSearching ? (
          <div className="main-movies-section">
            <div className="section-header">
              <h2 className="section-title">
                Search Results
                {searchQuery && ` for "${searchQuery}"`}
                {selectedGenre && ` in ${genres.find(g => g.id == selectedGenre)?.name || 'Genre'}`}
                {selectedYear && ` from ${selectedYear}`}
              </h2>
              <button onClick={clearSearch} className="nav-button">Show All Movies</button>
            </div>
            {searchResults.length > 0 ? (
              <div className="scroll-section">
                <button 
                  className="scroll-button scroll-left"
                  onClick={() => scrollLeft(searchRef)}
                >
                  ‹
                </button>
                <div className="movie-scroll-container" ref={searchRef}>
                  {searchResults.map((movie) => (
                    <div key={movie.id} className="scroll-movie-card">
                      <MovieCard movie={movie} showActions={true} />
                    </div>
                  ))}
                </div>
                <button 
                  className="scroll-button scroll-right"
                  onClick={() => scrollRight(searchRef)}
                >
                  ›
                </button>
              </div>
            ) : (
              <div className="no-results">
                <h3>No movies found</h3>
                <p>Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Trending Section */}
            <div className="category-section">
              <div className="section-header">
                <h2 className="section-title">Trending Now</h2>
              </div>
              <div className="scroll-section">
                <button 
                  className="scroll-button scroll-left"
                  onClick={() => scrollLeft(trendingRef)}
                >
                  ‹
                </button>
                <div className="movie-scroll-container" ref={trendingRef}>
                  {trendingMovies.map((movie) => (
                    <div key={movie.id} className="scroll-movie-card">
                      <MovieCard movie={movie} showActions={true} />
                    </div>
                  ))}
                </div>
                <button 
                  className="scroll-button scroll-right"
                  onClick={() => scrollRight(trendingRef)}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Top Rated Section */}
            <div className="category-section">
              <div className="section-header">
                <h2 className="section-title">Top Rated Movies</h2>
              </div>
              <div className="scroll-section">
                <button 
                  className="scroll-button scroll-left"
                  onClick={() => scrollLeft(topRatedRef)}
                >
                  ‹
                </button>
                <div className="movie-scroll-container" ref={topRatedRef}>
                  {topRatedMovies.map((movie) => (
                    <div key={movie.id} className="scroll-movie-card">
                      <MovieCard movie={movie} showActions={true} />
                    </div>
                  ))}
                </div>
                <button 
                  className="scroll-button scroll-right"
                  onClick={() => scrollRight(topRatedRef)}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Genre Sections */}
            {popularGenres.map((genre) => (
              <div key={genre.id} className="category-section">
                <div className="section-header">
                  <h2 className="section-title">{genre.name} Movies</h2>
                </div>
                <div className="scroll-section">
                  <button 
                    className="scroll-button scroll-left"
                    onClick={() => scrollLeft(genreRefs.current[genre.id])}
                  >
                    ‹
                  </button>
                  <div 
                    className="movie-scroll-container" 
                    ref={genreRefs.current[genre.id]}
                  >
                    {genreMovies[genre.id] && genreMovies[genre.id].length > 0 ? (
                      genreMovies[genre.id].map((movie) => (
                        <div key={movie.id} className="scroll-movie-card">
                          <MovieCard movie={movie} showActions={true} />
                        </div>
                      ))
                    ) : (
                      <div className="no-movies-message">
                        <p>No {genre.name.toLowerCase()} movies available</p>
                      </div>
                    )}
                  </div>
                  <button 
                    className="scroll-button scroll-right"
                    onClick={() => scrollRight(genreRefs.current[genre.id])}
                  >
                    ›
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <img src="/icons/up-arrow.png" alt="Up arrow" />
        </button>
      )}
    </div>
  );
}

export default Home;