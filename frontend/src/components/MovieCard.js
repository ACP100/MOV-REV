import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
        <img 
          src={movie.poster_path 
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : '/placeholder-movie.jpg'
          } 
          alt={movie.title} 
        />
        <div className="movie-card-content">
          <h3>{movie.title}</h3>
          <div className="movie-rating">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;