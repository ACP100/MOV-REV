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


#yo {movie_id} bhanda mathi nai huna parcha -> 
# When a request comes in, it checks:
# Does the path match a static route exactly?
# If not, does it match any parameterized route (like /movies/{movie_id})?
@router.get("/movies/top-rated")
def get_top_rated_movies():
    url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={TMDB_API_KEY}"
    response = requests.get(url)
    return response.json()


@router.get("/movies/{movie_id}")
def get_movie_details(movie_id: int):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits"
    response = requests.get(url)
    return response.json()

@router.get("/movies/genre/{genre_id}")
def get_movies_by_genre(genre_id: int):
    url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_genres={genre_id}&sort_by=popularity.desc"
    response = requests.get(url)
    return response.json()

@router.get("/genres")
def get_genres():
    url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}"
    response = requests.get(url)
    return response.json()