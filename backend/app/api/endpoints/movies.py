# from fastapi import APIRouter
# import requests
# from app import settings

# router = APIRouter()

# TMDB_API_KEY = settings.TMDB_API_KEY  # Store in .env

# @router.get("/movies/trending")
# def get_trending_movies():
#     url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={TMDB_API_KEY}"
#     response = requests.get(url)
#     return response.json()

# @router.get("/movies/search")
# def search_movies(query: str):
#     url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}"
#     response = requests.get(url)
#     return response.json()


# #yo {movie_id} bhanda mathi nai huna parcha -> 
# # When a request comes in, it checks:
# # Does the path match a static route exactly?
# # If not, does it match any parameterized route (like /movies/{movie_id})?
# @router.get("/movies/top-rated")
# def get_top_rated_movies():
#     url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={TMDB_API_KEY}"
#     response = requests.get(url)
#     return response.json()


# @router.get("/movies/{movie_id}")
# def get_movie_details(movie_id: int):
#     url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits"
#     response = requests.get(url)
#     return response.json()

# @router.get("/movies/genre/{genre_id}")
# def get_movies_by_genre(genre_id: int):
#     url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_genres={genre_id}&sort_by=popularity.desc"
#     response = requests.get(url)
#     return response.json()

# @router.get("/genres")
# def get_genres():
#     url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}"
#     response = requests.get(url)
#     return response.json()



from fastapi import APIRouter
import httpx
from app import settings
from functools import lru_cache
import asyncio
import time

router = APIRouter()
TMDB_API_KEY = settings.TMDB_API_KEY

# Simple cache (in-memory)
cache = {}
CACHE_TTL = 60 * 10  # 10 minutes

def get_cache(key):
    if key in cache:
        data, ts = cache[key]
        if time.time() - ts < CACHE_TTL:
            return data
    return None

def set_cache(key, data):
    cache[key] = (data, time.time())

async def fetch_json(client, url):
    if (cached := get_cache(url)):
        return cached
    r = await client.get(url)
    data = r.json()
    set_cache(url, data)
    return data

@router.get("/movies/trending")
async def get_trending_movies():
    start = time.time()

    url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={TMDB_API_KEY}"
    async with httpx.AsyncClient() as client:
        return await fetch_json(client, url)
    
    print(f"Trending movies took {time.time() - start} seconds")


@router.get("/movies/top-rated")
async def get_top_rated_movies():
    start = time.time()
    url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={TMDB_API_KEY}"
    async with httpx.AsyncClient() as client:
        return await fetch_json(client, url)
    print(f"top-rated movies took {time.time() - start} seconds")


@router.get("/movies/search")
async def search_movies(query: str):
    start = time.time()
    
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}"
    async with httpx.AsyncClient() as client:
        return await fetch_json(client, url)
    print(f"search movies took {time.time() - start} seconds")

@router.get("/genres")
async def get_genres():
    start = time.time()

    url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}"
    async with httpx.AsyncClient() as client:
        return await fetch_json(client, url)
    print(f"genre movies took {time.time() - start} seconds")

@router.get("/movies/{movie_id}")
async def get_movie_details(movie_id: int):
    start = time.time()

    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&append_to_response=credits"
    async with httpx.AsyncClient() as client:
        return await fetch_json(client, url)
    print(f"top-mopvvies movies took {time.time() - start} seconds")
@router.get("/movies/genre/{genre_id}")
async def get_movies_by_genre(genre_id: int):
    start = time.time()

    url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_genres={genre_id}&sort_by=popularity.desc"
    async with httpx.AsyncClient() as client:
        return await fetch_json(client, url)
    print(f"{genre_id} movies took {time.time() - start} seconds")