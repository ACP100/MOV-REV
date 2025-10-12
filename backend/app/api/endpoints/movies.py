from fastapi import APIRouter
import requests
from app import settings

router = APIRouter()

TMDB_API_KEY = settings.TMDB_API_KEY  # Store in .env

@router.get("/movies/trending")
def get_trending_movies():
    url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={TMDB_API_KEY}"
    response = requests.get(url)
    return response.json()

@router.get("/movies/search")
def search_movies(query: str):
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}"
    response = requests.get(url)
    return response.json()

@router.get("/movies/{movie_id}")
def get_movie_details(movie_id: int):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits"
    response = requests.get(url)
    return response.json()