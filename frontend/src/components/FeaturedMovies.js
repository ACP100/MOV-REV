import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FeaturedMovies() {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/api/movies/trending')
      .then((res) => {
        setFeaturedMovies(res.data.results.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
    );
  };

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div className="featured-movies">
      <div 
        className="featured-background"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path})`
        }}
      >
        <div className="featured-overlay">
          <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
          
          <div className="featured-content">
            <div className="featured-info">
              <h2 className="featured-title">{currentMovie.title}</h2>
              <p className="featured-overview">
                {currentMovie.overview.substring(0, 150)}...
              </p>
              <div className="featured-meta">
                <span className="featured-rating">
                  ⭐ {currentMovie.vote_average?.toFixed(1)}
                </span>
                <span className="featured-year">
                  {new Date(currentMovie.release_date).getFullYear()}
                </span>
              </div>
              <Link to={`/movie/${currentMovie.id}`} className="featured-button">
                View Details
              </Link>
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextSlide}>›</button>
        </div>
      </div>
      
      <div className="carousel-dots">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturedMovies;