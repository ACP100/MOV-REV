
// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleClose = () => {
//     navigate('/');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const loginData = {
//         username: username,
//         password: password
//       };

//       const response = await axios.post('http://localhost:8000/api/login', loginData, {
//         headers: { 
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//       });

//       const token = response.data.access_token || response.data.token;
//       if (token) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('username', username);
//         window.location.href = '/';
//       } else {
//         throw new Error('No token received in response');
//       }

//     } catch (error) {
//       console.error('Login error:', error);
      
//       if (error.response) {
//         if (error.response.status === 404) {
//           setError('Login endpoint not found. Trying alternative endpoint...');
//           // You might want to try /api/token as fallback
//         } else if (error.response.status === 400 || error.response.status === 401) {
//           setError('Invalid username or password.');
//         } else {
//           setError(`Server error: ${error.response.status}`);
//         }
//       } else if (error.request) {
//         setError('Cannot connect to server. Please make sure the backend is running.');
//       } else {
//         setError('An unexpected error occurred.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-overlay-container">
//       <button className="close-overlay-btn" onClick={handleClose}>✕</button>
//       <div className="auth-card">
//         <h1 className="auth-title">Welcome Back</h1>
//         <p className="auth-subtitle">Sign in to your account</p>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label htmlFor="username" className="form-label">Username</label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               className="form-input"
//               required
//               disabled={loading}
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password" className="form-label">Password</label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="form-input"
//               required
//               disabled={loading}
//             />
//           </div>
          
//           <button 
//             type="submit" 
//             className="auth-button"
//             disabled={loading}
//           >
//             {loading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>
        
//         <div className="auth-link">
//           Don't have an account? <Link to="/register">Create one here</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Add blur to body when component mounts
  useEffect(() => {
    document.body.classList.add('auth-page-active');
    
    return () => {
      document.body.classList.remove('auth-page-active');
    };
  }, []);

  const handleClose = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginData = {
        username: username,
        password: password
      };

      console.log('Attempting login to:', 'http://localhost:8000/api/login');

      const response = await axios.post('http://localhost:8000/api/login', loginData, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      console.log('Login successful:', response.data);

      // Store the token - check the actual response structure
      const token = response.data.access_token || response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        window.location.href = '/';
      } else {
        throw new Error('No token received in response');
      }

    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          setError('Login endpoint not found. Trying alternative endpoint...');
        } else if (error.response.status === 400 || error.response.status === 401) {
          setError('Invalid username or password.');
        } else {
          setError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fullscreen-overlay">
      <button className="close-overlay-btn" onClick={handleClose}>✕</button>
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-link">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;