import MovieCard from './MovieCard';

function CategorySection({ title, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="category-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="section-line"></div>
      </div>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default CategorySection;