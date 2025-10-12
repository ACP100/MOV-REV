// import { useState } from 'react';
// import axios from 'axios';

// function ReviewForm({ movieId }) {
//   const [title, setTitle] = useState('');
//   const [rating, setRating] = useState(1);
//   const [comment, setComment] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         'http://127.0.0.1:8000/api/reviews',
//         { movie_id: movieId, title, rating, comment },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       alert('Review submitted!');
//       setTitle('');
//       setRating(1);
//       setComment('');
//     } catch (error) {
//       alert('Error submitting review');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         placeholder="Review Title"
//         required
//       />
//       <input
//         type="number"
//         value={rating}
//         onChange={(e) => setRating(e.target.value)}
//         min="1"
//         max="10"
//         required
//       />
//       <textarea
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         placeholder="Your review"
//         required
//       />
//       <button type="submit">Submit Review</button>
//     </form>
//   );
// }

// export default ReviewForm;

import { useState } from 'react';
import axios from 'axios';

function ReviewForm({ movieId, onReviewSubmitted }) {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/reviews',
        { movie_id: parseInt(movieId), title, rating: parseFloat(rating), comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      // Reset form
      setTitle('');
      setRating(5);
      setComment('');
      
      // Notify parent to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.status === 401) {
        alert('Please log in to submit a review');
      } else {
        alert('Error submitting review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#1a1a1a', borderRadius: '10px' }}>
      <h3 style={{ marginBottom: '1rem', color: '#ffa726' }}>Write a Review</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review Title"
          className="form-input"
          required
          disabled={submitting}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ color: '#ffffff' }}>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="form-input"
            style={{ width: '80px' }}
            required
            disabled={submitting}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span style={{ color: '#cccccc' }}>/10</span>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your review comment..."
          className="form-input"
          style={{ minHeight: '100px', resize: 'vertical' }}
          required
          disabled={submitting}
        />
        <button 
          type="submit" 
          className="auth-button"
          disabled={submitting}
          style={{ alignSelf: 'flex-start' }}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;