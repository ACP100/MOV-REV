
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
async def search_movies(query: str = None, genre: str = None, year: str = None):
    start = time.time()
    
    # Build TMDB URL with optional parameters
    base_url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&sort_by=popularity.desc"
    
    if query:
        # Use search endpoint if there's a query
        base_url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}"
    else:
        # Use discover endpoint for filtered browsing
        base_url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&sort_by=popularity.desc"
    
    # Add genre filter if provided
    if genre:
        base_url += f"&with_genres={genre}"
    
    # Add year filter if provided
    if year:
        base_url += f"&year={year}"
    
    async with httpx.AsyncClient() as client:
        return await fetch_json(client, base_url)
    
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