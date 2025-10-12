import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     setError('Please log in to view your profile');
  //     setLoading(false);
  //     return;
  //   }

  //   axios
  //     .get('http://localhost:8000/api/users/me/reviews', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       setReviews(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching reviews:', err);
  //       setError('Failed to load your reviews');
  //       setLoading(false);
  //     });
  // }, []);
  useEffect(() => {
    const fetchReviews = async () => { // <--- Make the inner function async
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your profile');
          setLoading(false);
          return;
        }

        try {
            // 1. ADD THIS LINE: Fetch the user's reviews using async/await
            const reviewsResponse = await axios.get('http://localhost:8000/api/users/me/reviews', {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // 2. Process the data (without fetching movie titles yet)
            setReviews(reviewsResponse.data);
            setLoading(false);

        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load your reviews');
            setLoading(false);
        }
    };
    
    fetchReviews(); // <--- Call the async function
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_timestamp');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading">Loading your reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h1 className="auth-title">My Profile</h1>
        <p className="auth-subtitle">Your Movie Reviews</p>

        {error && <div className="error-message">{error}</div>}

        {reviews.length === 0 && !error ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
              You haven't written any reviews yet.
            </p>
            <Link to="/" className="nav-button">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="reviews-section">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 className="review-title">{review.title}</h3>
                  <div className="movie-rating" style={{ fontSize: '0.9rem' }}>
                    ⭐ {review.rating}/5
                  </div>
                </div>
                <p style={{ color: '#cccccc', lineHeight: '1.6' }}>{review.comment}</p>
                {review.movie_title && (
                  <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Movie: <strong>{review.movie_title}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="auth-buttons" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" className="nav-button" style={{ textAlign: 'center' }}>
            Back to Home
          </Link>
          <button onClick={handleLogout} className="auth-button logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;