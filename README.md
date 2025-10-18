
# MOvie review app
An app that lets you browse movies and review it.

##Features
Movie Discovery: Browse and search for movies

User Authentication: Secure login and registration

Movie Reviews: Read and write reviews

##Tech Stack
###Backend
FastAPI - Python web framework

SQLAlchemy - ORM for database operations

JWT - Authentication tokens

CORS - Cross-origin resource sharing

TMDB API - Movie data source

###Frontend
React 19 - Frontend library

React Router DOM - Client-side routing

Axios - HTTP client for API calls

JWT Decode - Token management



### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
    pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in the backend directory:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   DATABASE_URL=sqlite:///./movie_app.db
   SECRET_KEY=your_secret_key_here
   ```

5. **Run the backend server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
