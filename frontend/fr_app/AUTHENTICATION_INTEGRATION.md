# Authentication Integration

This document describes the authentication integration between the React frontend and Django backend.

## Overview

The authentication system uses JWT (JSON Web Tokens) with access and refresh tokens. The frontend communicates with the Django REST API for authentication operations.

## Backend API Endpoints

The Django backend provides the following authentication endpoints:

- `POST /users/auth/register/` - Register a new user
- `POST /users/auth/login/` - Login with email and password
- `POST /users/auth/access_token/` - Refresh access token using refresh token
- `GET /users/current/` - Get current user information
- `PUT /users/profile/me/` - Update user profile

## Frontend Implementation

### API Client (`client/lib/api.js`)

A centralized API client that handles:
- HTTP requests to the backend
- Automatic token management
- Error handling
- Request/response formatting

### Authentication Context (`client/context/AuthContext.jsx`)

Manages authentication state and provides:
- User state management
- Login/logout functionality
- Token storage and refresh
- Automatic token validation on app startup

### Protected Routes (`client/components/ProtectedRoute.jsx`)

Route guard component that:
- Checks authentication status
- Redirects unauthenticated users to login
- Shows loading state during authentication check

### Authentication Pages

#### Sign In (`client/pages/SignIn.jsx`)
- Email and password login form
- Error handling and validation
- Redirect to intended page after login

#### Sign Up (`client/pages/SignUp.jsx`)
- Comprehensive registration form with all user fields
- Form validation and error handling
- Automatic login after successful registration

## Features

### JWT Token Management
- Access tokens for API requests
- Refresh tokens for token renewal
- Automatic token refresh on expiration
- Secure token storage in localStorage

### User Experience
- Loading states during authentication
- Error messages for failed operations
- Redirect to intended page after login
- Persistent authentication across browser sessions

### Security
- Protected routes for authenticated users
- Automatic token validation
- Secure token storage
- CORS configuration for cross-origin requests

## Usage

### Starting the Backend
```bash
cd backend
python manage.py runserver
```

### Starting the Frontend
```bash
cd frontend/fr_app
npm run dev
```

### Authentication Flow

1. **Registration**: User fills out signup form → Backend creates user → Returns JWT tokens → User automatically logged in
2. **Login**: User enters credentials → Backend validates → Returns JWT tokens → User logged in
3. **Protected Routes**: Check authentication → Redirect to login if not authenticated → Show protected content if authenticated
4. **Token Refresh**: Automatic refresh of expired access tokens using refresh token

## Configuration

### Backend URL
The API base URL is configured in `client/lib/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000'
```

### CORS
The backend is configured to allow all origins for development. For production, update the CORS settings in `backend/ink_smart/settings.py`.

## Error Handling

The system handles various error scenarios:
- Invalid credentials
- Network errors
- Token expiration
- Server errors
- Validation errors

All errors are displayed to the user with appropriate messages and the UI remains responsive.
