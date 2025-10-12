from dotenv import load_dotenv
import os

load_dotenv() 

TMDB_API_KEY = os.getenv("TMDB_API_KEY")

if not TMDB_API_KEY:
    raise ValueError("TMDB_API_KEY not found. Make sure .env exists and is loaded.")