import { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import { useParams } from 'react-router-dom';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieRes, reviewsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/movies/${id}`),
          axios.get(`http://127.0.0.1:8000/api/movies/${id}/reviews`)
        ]);
        setMovie(movieRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (!movie) return <div className="loading">Movie not found</div>;

  return (
    <div className="movie-details">
      <div className="movie-header">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-overview">{movie.overview}</p>
          <div className="movie-meta">
            <div className="meta-item">
              <strong>Release Date:</strong> {movie.release_date}
            </div>
            <div className="meta-item">
              <strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1)}
            </div>
          </div>
          {movie.credits?.cast && (
            <div className="meta-item">
              <strong>Cast:</strong> {movie.credits.cast.slice(0, 5).map((actor) => actor.name).join(', ')}
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <h3 className="review-title">{review.title}</h3>
              <div className="movie-rating">Rating: {review.rating}/10</div>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
        <ReviewForm movieId={id} />
      </div>
    </div>
  );
}

export default MovieDetails;