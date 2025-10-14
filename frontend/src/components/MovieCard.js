// import { Link } from 'react-router-dom';
// import { useState, useEffect, useCallback } from 'react'; // Add useCallback
// import axios from 'axios';

// function MovieCard({ movie }) {
//   const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [isWatched, setIsWatched] = useState(false);
//   const [isInWatchlist, setIsInWatchlist] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Wrap checkUserPreferences in useCallback to prevent infinite re-renders
//   const checkUserPreferences = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Checking preferences for movie:', movie.id);
      
//       const response = await axios.get(`http://localhost:8000/api/user/preferences/${movie.id}`, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       console.log('Preferences response:', response.data);
//       const preferences = response.data;
//       setIsFavorite(preferences.is_favorite);
//       setIsWatched(preferences.is_watched);
//       setIsInWatchlist(preferences.is_in_watchlist);
//     } catch (error) {
//       console.error('Error fetching user preferences:', error);
//       console.error('Error details:', error.response?.data);
//     }
//   }, [movie.id]); // Add dependencies

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
    
//     if (token) {
//       checkUserPreferences();
//     }
//   }, [checkUserPreferences]); // Now include checkUserPreferences in dependencies

//   const handleFavorite = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isLoggedIn) {
//       alert('Please login to add to favorites');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Toggling favorite for movie:', movie.id);
      
//       const response = await axios.post(
//         `http://localhost:8000/api/user/favorites/${movie.id}`, 
//         {},
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('Favorite toggle response:', response.data);
//       setIsFavorite(response.data.is_favorite);
//     } catch (error) {
//       console.error('Error updating favorite:', error);
//       console.error('Error details:', error.response?.data);
//       alert('Error updating favorite. Please check console for details.');
//     }
//   };

//   const handleWatched = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isLoggedIn) {
//       alert('Please login to mark as watched');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Toggling watched for movie:', movie.id);
      
//       const response = await axios.post(
//         `http://localhost:8000/api/user/watched/${movie.id}`, 
//         {},
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('Watched toggle response:', response.data);
//       setIsWatched(response.data.is_watched);
//     } catch (error) {
//       console.error('Error updating watched status:', error);
//       console.error('Error details:', error.response?.data);
//       alert('Error updating watched status. Please check console for details.');
//     }
//   };

//   const handleWatchlist = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isLoggedIn) {
//       alert('Please login to add to watchlist');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       console.log('Toggling watchlist for movie:', movie.id);
      
//       const response = await axios.post(
//         `http://localhost:8000/api/user/watchlist/${movie.id}`, 
//         {},
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('Watchlist toggle response:', response.data);
//       setIsInWatchlist(response.data.is_in_watchlist);
//     } catch (error) {
//       console.error('Error updating watchlist:', error);
//       console.error('Error details:', error.response?.data);
//       alert('Error updating watchlist. Please check console for details.');
//     }
//   };

//   return (
//     <div className="movie-card-fade">
//       <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%', position: 'relative' }}>
//         <img
//           src={movie.poster_path 
//             ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//             : '/placeholder-movie.jpg'
//           }
//           alt={movie.title}
//         />
        
//         {/* Top fade overlay for buttons */}
//         <div className="movie-card-top-fade">
//           <div className="movie-card-top-actions">
//             <button 
//               className={`top-action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
//               onClick={handleFavorite}
//               title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
//             >
//               <img 
//                 src={isFavorite ? "/icons/heart_filled.png" : "/icons/heart_outline.png"} 
//                 alt="Favorite" 
//                 className="action-icon"
//               />
//             </button>
//             <button 
//               className={`top-action-btn watched-btn ${isWatched ? 'active' : ''}`}
//               onClick={handleWatched}
//               title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
//             >
//               <img 
//                 src={isWatched ? "/icons/eye_filled.png" : "/icons/eye_outline.png"} 
//                 alt="Watched" 
//                 className="action-icon"
//               />
//             </button>
//             <button 
//               className={`top-action-btn watchlist-btn ${isInWatchlist ? 'active' : ''}`}
//               onClick={handleWatchlist}
//               title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
//             >
//               <img 
//                 src={isInWatchlist ? "/icons/list_filled.png" : "/icons/list_outline.png"} 
//                 alt="Watchlist" 
//                 className="action-icon"
//               />
//             </button>
//           </div>
//         </div>
        
//         {/* Bottom fade overlay for movie info */}
//         <div className="movie-card-fade-content">
//           <h3>{movie.title}</h3>
//           <div className="movie-card-fade-info">
//             <div className="movie-rating">
//               ⭐ {movie.vote_average?.toFixed(1)}/10
//             </div>
//             <div className="movie-year">
//               {releaseYear}
//             </div>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }

// export default MovieCard;


import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function MovieCard({ movie, showActions = true }) { // Add showActions prop
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use useCallback for checkUserPreferences
  const checkUserPreferences = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/user/preferences/${movie.id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const preferences = response.data;
      setIsFavorite(preferences.is_favorite);
      setIsWatched(preferences.is_watched);
      setIsInWatchlist(preferences.is_in_watchlist);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  }, [movie.id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
      checkUserPreferences();
    }
  }, [checkUserPreferences]);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      alert('Please login to add to favorites');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/user/favorites/${movie.id}`, 
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleWatched = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      alert('Please login to mark as watched');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/user/watched/${movie.id}`, 
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setIsWatched(!isWatched);
    } catch (error) {
      console.error('Error updating watched status:', error);
    }
  };

  const handleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      alert('Please login to add to watchlist');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/user/watchlist/${movie.id}`, 
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  return (
    <div className="movie-card-fade">
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%', position: 'relative' }}>
        <img
          src={movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/placeholder-movie.jpg'
          }
          alt={movie.title}
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
                  src={isFavorite ? "/icons/heart-filled.png" : "/icons/heart-outline.png"} 
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
                  src={isWatched ? "/icons/eye-filled.png" : "/icons/eye-outline.png"} 
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
                  src={isInWatchlist ? "/icons/list-filled.png" : "/icons/list-outline.png"} 
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