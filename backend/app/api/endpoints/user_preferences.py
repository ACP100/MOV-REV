from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.database import get_db
from app.models.user import User
from app.models.user_preference import UserMoviePreference
from app.models.review import Review
from app.api.auth import get_current_user
import requests
import os

router = APIRouter()

# Get TMDB API key from environment or use a fallback
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "your_tmdb_api_key_here")

@router.get("/user/profile-data")
def get_user_profile_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        print(f"Fetching profile data for user: {current_user.username}")
        
        # Get user's reviews
        reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
        print(f"Found {len(reviews)} reviews")
        
        # Get user's movie preferences
        preferences = db.query(UserMoviePreference).filter(
            UserMoviePreference.user_id == current_user.id
        ).all()
        print(f"Found {len(preferences)} preferences")
        
        # Separate movies by category
        favorite_movie_ids = [pref.movie_id for pref in preferences if pref.is_favorite]
        watched_movie_ids = [pref.movie_id for pref in preferences if pref.is_watched]
        watchlist_movie_ids = [pref.movie_id for pref in preferences if pref.is_in_watchlist]
        
        print(f"Favorites: {favorite_movie_ids}")
        print(f"Watched: {watched_movie_ids}")
        print(f"Watchlist: {watchlist_movie_ids}")
        
        # Fetch movie details from TMDB with error handling
        def get_movie_details(movie_id):
            try:
                url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}"
                print(f"Fetching movie details for ID: {movie_id}")
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"TMDB API error for movie {movie_id}: {response.status_code}")
                    return None
            except Exception as e:
                print(f"Error fetching movie {movie_id}: {str(e)}")
                return None
        
        # Get movie details for each category
        favorites = []
        for movie_id in favorite_movie_ids:
            movie_details = get_movie_details(movie_id)
            if movie_details:
                favorites.append(movie_details)
        
        watched = []
        for movie_id in watched_movie_ids:
            movie_details = get_movie_details(movie_id)
            if movie_details:
                watched.append(movie_details)
        
        watchlist = []
        for movie_id in watchlist_movie_ids:
            movie_details = get_movie_details(movie_id)
            if movie_details:
                watchlist.append(movie_details)
        
        print(f"Successfully fetched {len(favorites)} favorites, {len(watched)} watched, {len(watchlist)} watchlist")
        
        # Format reviews with movie details - NO created_at needed!
        reviews_with_movies = []
        for review in reviews:
            movie_details = get_movie_details(review.movie_id)
            
            review_data = {
                "id": review.id,
                "movie_id": review.movie_id,
                "movie_title": movie_details.get("title", "Unknown Movie") if movie_details else f"Movie ID: {review.movie_id}",
                "movie_poster": movie_details.get("poster_path") if movie_details else None,
                "rating": review.rating,
                "comment": review.comment,
                "title": review.title  # Include the review title
            }
            
            reviews_with_movies.append(review_data)
        
        response_data = {
            "user": {
                "username": current_user.username,
                "email": current_user.email
            },
            "reviews": reviews_with_movies,
            "favorites": favorites,
            "watched": watched,
            "watchlist": watchlist,
            "stats": {
                "reviews_count": len(reviews_with_movies),
                "favorites_count": len(favorites),
                "watched_count": len(watched),
                "watchlist_count": len(watchlist)
            }
        }
        
        print("Successfully prepared profile data")
        return response_data
        
    except Exception as e:
        print(f"Error in get_user_profile_data: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile data: {str(e)}"
        )