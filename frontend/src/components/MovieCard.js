import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  
  return (
    <div className="movie-card-fade">
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <img
          src={movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/placeholder-movie.jpg'
          }
          alt={movie.title}
        />
        
        {/* Content that fades in on hover */}
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