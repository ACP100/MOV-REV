from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.database import get_db
from app.models.user import User
from app.models.user_preference import UserMoviePreference
from app.models.review import Review
from app.api.auth import get_current_user
import requests
from datetime import datetime
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
        
        return response_data
        
    except Exception as e:
        print(f"Error in get_user_profile_data: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile data: {str(e)}"
        )
    
@router.post("/user/favorites/{movie_id}")
def toggle_favorite(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find existing preference or create new one
    preference = db.query(UserMoviePreference).filter(
        UserMoviePreference.user_id == current_user.id,
        UserMoviePreference.movie_id == movie_id
    ).first()
    
    if preference:
        # Toggle favorite status
        preference.is_favorite = not preference.is_favorite
        preference.updated_at = datetime.utcnow()
    else:
        # Create new preference with favorite enabled
        preference = UserMoviePreference(
            user_id=current_user.id,
            movie_id=movie_id,
            is_favorite=True,
            is_watched=False,
            is_in_watchlist=False
        )
        db.add(preference)
    
    db.commit()
    db.refresh(preference)
    
    return {
        "is_favorite": preference.is_favorite,
        "message": "Favorite updated successfully" if preference.is_favorite else "Removed from favorites"
    }

@router.post("/user/watched/{movie_id}")
def toggle_watched(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find existing preference or create new one
    preference = db.query(UserMoviePreference).filter(
        UserMoviePreference.user_id == current_user.id,
        UserMoviePreference.movie_id == movie_id
    ).first()
    
    if preference:
        # Toggle watched status
        preference.is_watched = not preference.is_watched
        preference.updated_at = datetime.utcnow()
    else:
        # Create new preference with watched enabled
        preference = UserMoviePreference(
            user_id=current_user.id,
            movie_id=movie_id,
            is_favorite=False,
            is_watched=True,
            is_in_watchlist=False
        )
        db.add(preference)
    
    db.commit()
    db.refresh(preference)
    
    return {
        "is_watched": preference.is_watched,
        "message": "Marked as watched" if preference.is_watched else "Marked as unwatched"
    }

@router.post("/user/watchlist/{movie_id}")
def toggle_watchlist(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find existing preference or create new one
    preference = db.query(UserMoviePreference).filter(
        UserMoviePreference.user_id == current_user.id,
        UserMoviePreference.movie_id == movie_id
    ).first()
    
    if preference:
        # Toggle watchlist status
        preference.is_in_watchlist = not preference.is_in_watchlist
        preference.updated_at = datetime.utcnow()
    else:
        # Create new preference with watchlist enabled
        preference = UserMoviePreference(
            user_id=current_user.id,
            movie_id=movie_id,
            is_favorite=False,
            is_watched=False,
            is_in_watchlist=True
        )
        db.add(preference)
    
    db.commit()
    db.refresh(preference)
    
    return {
        "is_in_watchlist": preference.is_in_watchlist,
        "message": "Added to watchlist" if preference.is_in_watchlist else "Removed from watchlist"
    }

@router.get("/user/preferences/{movie_id}")
def get_movie_preferences(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    preference = db.query(UserMoviePreference).filter(
        UserMoviePreference.user_id == current_user.id,
        UserMoviePreference.movie_id == movie_id
    ).first()
    
    if preference:
        return {
            "is_favorite": preference.is_favorite,
            "is_watched": preference.is_watched,
            "is_in_watchlist": preference.is_in_watchlist
        }
    else:
        return {
            "is_favorite": False,
            "is_watched": False,
            "is_in_watchlist": False
        }