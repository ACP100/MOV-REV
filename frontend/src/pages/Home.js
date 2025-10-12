// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import MovieCard from '../components/MovieCard';
// import '../styles/global.css';

// function Home() {
//   const [trendingMovies, setTrendingMovies] = useState([]);
//   const [topRatedMovies, setTopRatedMovies] = useState([]);
//   const [genreMovies, setGenreMovies] = useState({});
//   const [genres, setGenres] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);

//   const popularGenres = [
//     { id: 28, name: 'Action' },
//     { id: 35, name: 'Comedy' },
//     { id: 18, name: 'Drama' },
//     { id: 27, name: 'Horror' },
//     { id: 878, name: 'Sci-Fi' },
//     { id: 53, name: 'Thriller' }
//   ];

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//     fetchAllData();
//   }, []);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const [trendingResponse, topRatedResponse, genresResponse] = await Promise.all([
//         axios.get('http://localhost:8000/api/movies/trending'),
//         axios.get('http://localhost:8000/api/movies/top-rated'),
//         axios.get('http://localhost:8000/api/genres')
//       ]);

//       setTrendingMovies(trendingResponse.data.results || []);
//       setTopRatedMovies(topRatedResponse.data.results || []);
//       setGenres(genresResponse.data.genres || []);

//       const genrePromises = popularGenres.map(genre =>
//         axios.get(`http://localhost:8000/api/movies/genre/${genre.id}`)
//           .then(response => ({ genreId: genre.id, movies: response.data.results || [] }))
//           .catch(error => {
//             console.error(`Error fetching ${genre.name} movies:`, error);
//             return { genreId: genre.id, movies: [] };
//           })
//       );

//       const genreResults = await Promise.all(genrePromises);
//       const genreMoviesMap = {};
//       genreResults.forEach(result => {
//         genreMoviesMap[result.genreId] = result.movies.slice(0, 10);
//       });
//       setGenreMovies(genreMoviesMap);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       setLoading(true);
//       setIsSearching(true);
//       try {
//         const response = await axios.get(`http://localhost:8000/api/movies/search?query=${searchQuery}`);
//         setSearchResults(response.data.results || []);
//       } catch (error) {
//         console.error('Search failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       clearSearch();
//     }
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//     setIsSearching(false);
//     setSearchResults([]);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('token_timestamp');
//     setIsLoggedIn(false);
//     window.location.reload();
//   };

//   const getGenreIcon = (genreId) => {
//     const icons = {
//       28: '💥',
//       35: '😂',
//       18: '🎭',
//       27: '👻',
//       878: '🚀',
//       53: '🔪'
//     };
//     return icons[genreId] || '🎬';
//   };

//   return (
//     <div>
//       <header className="header">
//         <div className="nav-container">
//           <h1 className="app-title">Movie Review App</h1>

//           <div className="header-search">
//             <form onSubmit={handleSearch} className="search-form compact">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search movies..."
//                 className="search-input compact"
//               />
//               <button type="submit" className="search-button compact">
//                 🔍
//               </button>
//               {isSearching && (
//                 <button 
//                   type="button" 
//                   onClick={clearSearch}
//                   className="search-button compact clear"
//                 >
//                   ✕
//                 </button>
//               )}
//             </form>
//           </div>

//           <nav className="nav-menu">
//             {isLoggedIn ? (
//               <div className="nav-buttons">
//                 <Link to="/profile" className="nav-button">Profile</Link>
//                 <button onClick={handleLogout} className="nav-button logout-button">
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="nav-buttons">
//                 <Link to="/login" className="nav-button">Login</Link>
//                 <Link to="/register" className="nav-button register-button">
//                   Register
//                 </Link>
//               </div>
//             )}
//           </nav>
//         </div>
//       </header>

//       <div className="container">
//         {loading ? (
//           <div className="loading">Loading movies...</div>
//         ) : isSearching ? (
//           <div className="main-movies-section">
//             <div className="section-header">
//               <h2 className="section-title">Search Results for "{searchQuery}"</h2>
//               <button onClick={clearSearch} className="nav-button">Show All Movies</button>
//             </div>
//             {searchResults.length > 0 ? (
//               <div className="movie-scroll-container">
//                 {searchResults.map((movie) => (
//                   <div key={movie.id} className="scroll-movie-card">
//                     <MovieCard movie={movie} />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="no-results">
//                 <h3>No movies found for "{searchQuery}"</h3>
//                 <p>Try a different search term</p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Trending Section */}
//             <div className="category-section">
//               <div className="section-header">
//                 <h2 className="section-title">🔥 Trending Now</h2>
//               </div>
//               <div className="movie-scroll-container">
//                 {trendingMovies.map((movie) => (
//                   <div key={movie.id} className="scroll-movie-card">
//                     <MovieCard movie={movie} />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Top Rated Section */}
//             <div className="category-section">
//               <div className="section-header">
//                 <h2 className="section-title">⭐ Top Rated Movies</h2>
//               </div>
//               <div className="movie-scroll-container">
//                 {topRatedMovies.map((movie) => (
//                   <div key={movie.id} className="scroll-movie-card">
//                     <MovieCard movie={movie} />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Genre Sections */}
//             {popularGenres.map((genre) => (
//               <div key={genre.id} className="category-section">
//                 <div className="section-header">
//                   <h2 className="section-title">
//                     {getGenreIcon(genre.id)} {genre.name} Movies
//                   </h2>
//                 </div>
//                 <div className="movie-scroll-container">
//                   {genreMovies[genre.id] && genreMovies[genre.id].length > 0 ? (
//                     genreMovies[genre.id].map((movie) => (
//                       <div key={movie.id} className="scroll-movie-card">
//                         <MovieCard movie={movie} />
//                       </div>
//                     ))
//                   ) : (
//                     <p>No {genre.name.toLowerCase()} movies available</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;


import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import '../styles/global.css';

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

  // Refs for scroll containers
  const trendingRef = useRef(null);
  const topRatedRef = useRef(null);
  const genreRefs = useRef({});
  const searchRef = useRef(null);

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

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [trendingResponse, topRatedResponse, genresResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/movies/trending'),
        axios.get('http://localhost:8000/api/movies/top-rated'),
        axios.get('http://localhost:8000/api/genres')
      ]);

      setTrendingMovies(trendingResponse.data.results || []);
      setTopRatedMovies(topRatedResponse.data.results || []);
      setGenres(genresResponse.data.genres || []);

      const genrePromises = popularGenres.map(genre =>
        axios.get(`http://localhost:8000/api/movies/genre/${genre.id}`)
          .then(response => ({ genreId: genre.id, movies: response.data.results || [] }))
          .catch(error => {
            console.error(`Error fetching ${genre.name} movies:`, error);
            return { genreId: genre.id, movies: [] };
          })
      );

      const genreResults = await Promise.all(genrePromises);
      const genreMoviesMap = {};
      genreResults.forEach(result => {
        genreMoviesMap[result.genreId] = result.movies.slice(0, 10);
      });
      setGenreMovies(genreMoviesMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      setIsSearching(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/movies/search?query=${searchQuery}`);
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

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const getGenreIcon = (genreId) => {
    const icons = {
      28: '💥',
      35: '😂',
      18: '🎭',
      27: '👻',
      878: '🚀',
      53: '🔪'
    };
    return icons[genreId] || '🎬';
  };

  // Scroll functions
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Function to set genre refs
  const setGenreRef = (genreId, ref) => {
    genreRefs.current[genreId] = ref;
  };

  return (
    <div>
      <header className="header">
        <div className="nav-container">
          <h1 className="app-title">Movie Review App</h1>

          <div className="header-search">
            <form onSubmit={handleSearch} className="search-form compact">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="search-input compact"
              />
              <button type="submit" className="search-button compact">
                🔍
              </button>
              {isSearching && (
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
      </header>

      <div className="container">
        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : isSearching ? (
          <div className="main-movies-section">
            <div className="section-header">
              <h2 className="section-title">Search Results for "{searchQuery}"</h2>
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
                      <MovieCard movie={movie} />
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
                <h3>No movies found for "{searchQuery}"</h3>
                <p>Try a different search term</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Trending Section */}
            <div className="category-section">
              <div className="section-header">
                <h2 className="section-title">🔥 Trending Now</h2>
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
                      <MovieCard movie={movie} />
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
                <h2 className="section-title">⭐ Top Rated Movies</h2>
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
                      <MovieCard movie={movie} />
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
                  <h2 className="section-title">
                    {getGenreIcon(genre.id)} {genre.name} Movies
                  </h2>
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
                    ref={(ref) => setGenreRef(genre.id, ref)}
                  >
                    {genreMovies[genre.id] && genreMovies[genre.id].length > 0 ? (
                      genreMovies[genre.id].map((movie) => (
                        <div key={movie.id} className="scroll-movie-card">
                          <MovieCard movie={movie} />
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
    </div>
  );
}

export default Home;