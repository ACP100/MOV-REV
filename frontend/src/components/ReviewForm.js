import { useState } from 'react';
import axios from 'axios';

function ReviewForm({ movieId }) {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/reviews',
        { movie_id: movieId, title, rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Review submitted!');
      setTitle('');
      setRating(1);
      setComment('');
    } catch (error) {
      alert('Error submitting review');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review Title"
        required
      />
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        min="1"
        max="5"
        required
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Your review"
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;