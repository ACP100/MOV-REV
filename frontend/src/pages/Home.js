// import { useEffect, useState, useRef, useCallback  } from 'react';

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

//   // Refs for scroll containers
//   const trendingRef = useRef(null);
//   const topRatedRef = useRef(null);
//   const genreRefs = useRef({});
//   const searchRef = useRef(null);

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

//   // const fetchAllData = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const [trendingResponse, topRatedResponse, genresResponse] = await Promise.all([
//   //       axios.get('http://localhost:8000/api/movies/trending'),
//   //       axios.get('http://localhost:8000/api/movies/top-rated'),
//   //       axios.get('http://localhost:8000/api/genres')
//   //     ]);

//   //     setTrendingMovies(trendingResponse.data.results || []);
//   //     setTopRatedMovies(topRatedResponse.data.results || []);
//   //     setGenres(genresResponse.data.genres || []);

//   //     const genrePromises = popularGenres.map(genre =>
//   //       axios.get(`http://localhost:8000/api/movies/genre/${genre.id}`)
//   //         .then(response => ({ genreId: genre.id, movies: response.data.results || [] }))
//   //         .catch(error => {
//   //           console.error(`Error fetching ${genre.name} movies:`, error);
//   //           return { genreId: genre.id, movies: [] };
//   //         })
//   //     );

//   //     const genreResults = await Promise.all(genrePromises);
//   //     const genreMoviesMap = {};
//   //     genreResults.forEach(result => {
//   //       genreMoviesMap[result.genreId] = result.movies.slice(0, 10);
//   //     });
//   //     setGenreMovies(genreMoviesMap);
//   //   } catch (error) {
//   //     console.error('Error fetching data:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchAllData = async () => {
//   console.time("homepage-load");

//   setLoading(true);

//   try {
//     // Load trending/top-rated/genres together first
//     const [trendingRes, topRatedRes, genresRes] = await Promise.all([
//       axios.get('http://localhost:8000/api/movies/trending'),
//       axios.get('http://localhost:8000/api/movies/top-rated'),
//       axios.get('http://localhost:8000/api/genres'),
//     ]);

//     setTrendingMovies(trendingRes.data.results || []);
//     setTopRatedMovies(topRatedRes.data.results || []);
//     setGenres(genresRes.data.genres || []);
//     setLoading(false); // Show partial UI early
//     console.timeEnd("homepage-load");


//     // Fetch genre sections asynchronously (don’t block UI)
//     const genrePromises = popularGenres.map(async (genre) => {
//       const res = await axios.get(`http://localhost:8000/api/movies/genre/${genre.id}`);
//       return { genreId: genre.id, movies: res.data.results || [] };
//     });

//     const results = await Promise.all(genrePromises);
//     const map = {};
//     results.forEach(r => map[r.genreId] = r.movies.slice(0, 10));
//     setGenreMovies(map);
//   } catch (err) {
//     console.error("Error fetching:", err);
//     setLoading(false);
//   }
// };


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

//   // const getGenreIcon = (genreId) => {
//   //   const icons = {
//   //     28: '💥',
//   //     35: '😂',
//   //     18: '🎭',
//   //     27: '👻',
//   //     878: '🚀',
//   //     53: '🔪'
//   //   };
//   //   return icons[genreId] || '🎬';
//   // };

//   // Scroll functions
//   const scrollLeft = (ref) => {
//     if (ref.current) {
//       ref.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = (ref) => {
//     if (ref.current) {
//       ref.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   // Function to set genre refs
//  const setGenreRef = useCallback((genreId, element) => {
//     if (element) {
//       genreRefs.current[genreId] = element;
//     }
//   }, []);

//   return (
//     <div>
//       <header className="header">
//         <div className="nav-container">
//             <div className="logo-container">
//   <img src="/logo.png" alt="App Logo" className="app-logo" />
//     <h1 className="app-title">MOV REV</h1>

// </div>
//           <div className="header-search">
         
//   <form onSubmit={handleSearch} className="search-form compact">
//     <div className="search-input-wrapper">
//       <input
//         type="text"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         placeholder="Search for movies movies..."
//         className="search-input compact"
//       />
//       <button type="submit" className="search-icon-button">
//         🔍
//       </button>
//     </div>
//     {isSearching && (
//       <button 
//         type="button" 
//         onClick={clearSearch}
//         className="search-button compact clear"
//       >
//         ✕
//       </button>
//     )}
//   </form>
// </div>
      

//           <nav className="nav-menu">
//             {isLoggedIn ? (
//               <div className="nav-buttons">
//                 <Link to="/profile" className="profile-image-button">
//   <img src="/profile.png" alt="Profile" />
// </Link>
//                <button onClick={handleLogout} className="logout-image-button">
//                  <img src="/logout.png" alt="Logout" />
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
//               <div className="scroll-section">
//                 <button 
//                   className="scroll-button scroll-left"
//                   onClick={() => scrollLeft(searchRef)}
//                 >
//                   ‹
//                 </button>
//                 <div className="movie-scroll-container" ref={searchRef}>
//                   {searchResults.map((movie) => (
//                     <div key={movie.id} className="scroll-movie-card">
//                       <MovieCard movie={movie} showActions={true} />
//                     </div>
//                   ))}
//                 </div>
//                 <button 
//                   className="scroll-button scroll-right"
//                   onClick={() => scrollRight(searchRef)}
//                 >
//                   ›
//                 </button>
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
//                 <h2 className="section-title"> Trending Now</h2>
//               </div>
//               <div className="scroll-section">
//                 <button 
//                   className="scroll-button scroll-left"
//                   onClick={() => scrollLeft(trendingRef)}
//                 >
//                   ‹
//                 </button>
//                 <div className="movie-scroll-container" ref={trendingRef}>
//                   {trendingMovies.map((movie) => (
//                     <div key={movie.id} className="scroll-movie-card">
//                       <MovieCard movie={movie}showActions={true}  />
//                     </div>
//                   ))}
//                 </div>
//                 <button 
//                   className="scroll-button scroll-right"
//                   onClick={() => scrollRight(trendingRef)}
//                 >
//                   ›
//                 </button>
//               </div>
//             </div>

//             {/* Top Rated Section */}
//             <div className="category-section">
//               <div className="section-header">
//                 <h2 className="section-title"> Top Rated Movies</h2>
//               </div>
//               <div className="scroll-section">
//                 <button 
//                   className="scroll-button scroll-left"
//                   onClick={() => scrollLeft(topRatedRef)}
//                 >
//                   ‹
//                 </button>
//                 <div className="movie-scroll-container" ref={topRatedRef}>
//                   {topRatedMovies.map((movie) => (
//                     <div key={movie.id} className="scroll-movie-card">
//                       <MovieCard movie={movie} showActions={true}  />
//                     </div>
//                   ))}
//                 </div>
//                 <button 
//                   className="scroll-button scroll-right"
//                   onClick={() => scrollRight(topRatedRef)}
//                 >
//                   ›
//                 </button>
//               </div>
//             </div>

//             Genre Sections
//             {/* {/* {popularGenres.map((genre) => (
//               <div key={genre.id} className="category-section">
//                 <div className="section-header">
//                   <h2 className="section-title">
//                      {genre.name} Movies
//                   </h2>
//                 </div>
//                 <div className="scroll-section">
//                   <button 
//                     className="scroll-button scroll-left"
//                     onClick={() => scrollLeft(genreRefs.current[genre.id])}
//                   >
//                     ‹
//                   </button>
//                   <div 
//                     className="movie-scroll-container" 
//                     ref={(ref) => setGenreRef(genre.id, ref)}
//                   >
//                     {genreMovies[genre.id] && genreMovies[genre.id].length > 0 ? (
//                       genreMovies[genre.id].map((movie) => (
//                         <div key={movie.id} className="scroll-movie-card">
//                           <MovieCard movie={movie}showActions={true}  />
//                         </div>
//                       ))
//                     ) : (
//                       <div className="no-movies-message">
//                         <p>No {genre.name.toLowerCase()} movies available</p>
//                       </div>
//                     )}
//                   </div>
//                   <button 
//                     className="scroll-button scroll-right"
//                     onClick={() => scrollRight(genreRefs.current[genre.id])}
//                   >
//                     ›
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </div>
//   );
// } */
//  */}


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
  const searchRef = useRef(null);
  
  // Create refs for all genre sections upfront
  const genreRefs = useRef({
    28: useRef(null),
    35: useRef(null),
    18: useRef(null),
    27: useRef(null),
    878: useRef(null),
    53: useRef(null)
  });

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
  console.time("homepage-load");
  setLoading(true);

  try {
    // Load trending/top-rated/genres AND genre movies together
    const [trendingRes, topRatedRes, genresRes, ...genreResults] = await Promise.all([
      axios.get('http://localhost:8000/api/movies/trending'),
      axios.get('http://localhost:8000/api/movies/top-rated'),
      axios.get('http://localhost:8000/api/genres'),
      // Fetch all genre movies in parallel with the main data
      ...popularGenres.map(genre => 
        axios.get(`http://localhost:8000/api/movies/genre/${genre.id}`)
      )
    ]);

    setTrendingMovies(trendingRes.data.results || []);
    setTopRatedMovies(topRatedRes.data.results || []);
    setGenres(genresRes.data.genres || []);

    // Process genre movies
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
    </div>
  );
}

export default Home;