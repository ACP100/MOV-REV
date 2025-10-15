from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewOut
from app.api.database import get_db
from app.api.auth import get_current_user
from app.models.user import User


router = APIRouter()

@router.post("/reviews", response_model=ReviewOut)
def create_review(review: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_review = Review(
        movie_id=review.movie_id,
        user_id=current_user.id,
        title=review.title,
        rating=review.rating,
        comment=review.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return {
        "id": db_review.id,
        "movie_id": db_review.movie_id,
        "user_id": db_review.user_id,
        "title": db_review.title,
        "rating": db_review.rating,
        "comment": db_review.comment,
        "username": current_user.username  # Add username
    }

@router.get("/movies/{movie_id}/reviews")
def get_movie_reviews(movie_id: int, db: Session = Depends(get_db)):
    # Join with users table to get usernames
    reviews = db.query(Review, User.username).\
        join(User, Review.user_id == User.id).\
        filter(Review.movie_id == movie_id).\
        all()
    
    # Format the response
    result = []
    for review, username in reviews:
        result.append({
            "id": review.id,
            "movie_id": review.movie_id,
            "user_id": review.user_id,
            "title": review.title,
            "rating": review.rating,
            "comment": review.comment,
            "username": username
        })
    
    return result

@router.get("/users/{user_id}/reviews")
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.user_id == user_id).all()
    
    # Get username for these reviews
    user = db.query(User).filter(User.id == user_id).first()
    username = user.username if user else "Unknown User"
    
    result = []
    for review in reviews:
        result.append({
            "id": review.id,
            "movie_id": review.movie_id,
            "user_id": review.user_id,
            "title": review.title,
            "rating": review.rating,
            "comment": review.comment,
            "username": username
        })
    
    return result

@router.get("/users/me/reviews")
def get_my_reviews(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reviews = db.query(Review).filter(Review.user_id == current_user.id).all()
    
    result = []
    for review in reviews:
        result.append({
            "id": review.id,
            "movie_id": review.movie_id,
            "user_id": review.user_id,
            "title": review.title,
            "rating": review.rating,
            "comment": review.comment,
            "username": current_user.username
        })
    
    return result