# API Flow Diagram - Melio Ink Smart

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant A as API Gateway (DRF)
    participant Auth as Auth Service
    participant P as Post Service
    participant AI as AI Service
    participant DB as Database
    participant C as Celery
    participant E as Email Service

    %% Authentication Flow
    Note over U,E: Authentication Flow
    U->>F: Login Request
    F->>A: POST /users/auth/login/
    A->>Auth: Validate Credentials
    Auth->>DB: Check User
    DB-->>Auth: User Data
    Auth-->>A: JWT Tokens
    A-->>F: Access & Refresh Tokens
    F-->>U: Login Success

    %% Post Creation Flow
    Note over U,E: Post Creation Flow
    U->>F: Create Post
    F->>A: POST /posts/ (with JWT)
    A->>Auth: Validate Token
    Auth-->>A: User Authenticated
    A->>P: Create Post
    P->>DB: Save Post
    DB-->>P: Post Created
    P-->>A: Post Data
    A-->>F: Post Response
    F-->>U: Post Created

    %% AI Processing Flow
    Note over U,E: AI Processing Flow
    U->>F: Request AI Summary
    F->>A: GET /ai/summary/?post_id=X
    A->>AI: Process Summary Request
    AI->>DB: Get Post Content
    DB-->>AI: Post Data
    AI->>AI: Call Hugging Face API
    AI-->>A: Generated Summary
    A-->>F: Summary Response
    F-->>U: Display Summary

    %% Comment & Notification Flow
    Note over U,E: Comment & Notification Flow
    U->>F: Add Comment
    F->>A: POST /posts/{id}/comments/
    A->>Auth: Validate Token
    Auth-->>A: User Authenticated
    A->>P: Create Comment
    P->>DB: Save Comment
    DB-->>P: Comment Saved
    P->>C: Queue Email Task
    C->>E: Send Notification Email
    E-->>C: Email Sent
    P-->>A: Comment Created
    A-->>F: Comment Response
    F-->>U: Comment Added

    %% Analytics Flow
    Note over U,E: Analytics Flow
    U->>F: View Post
    F->>A: GET /posts/{id}/
    A->>P: Get Post
    P->>DB: Fetch Post Data
    DB-->>P: Post Data
    P->>P: Track View (Middleware)
    P->>DB: Save View Analytics
    P-->>A: Post with Analytics
    A-->>F: Post Response
    F-->>U: Display Post

    %% Search & Filter Flow
    Note over U,E: Search & Filter Flow
    U->>F: Search Posts
    F->>A: GET /posts/?search=query&tags=tag1
    A->>P: Filter Posts
    P->>DB: Complex Query
    DB-->>P: Filtered Results
    P-->>A: Post List
    A-->>F: Search Results
    F-->>U: Display Results
```

## API Endpoint Categories

### Authentication Endpoints
- `POST /users/auth/register/` - User registration
- `POST /users/auth/login/` - User login
- `POST /users/auth/access_token/` - Token refresh

### Post Management
- `GET /posts/` - List posts with filtering
- `POST /posts/` - Create new post
- `GET /posts/{id}/` - Get specific post
- `PUT /posts/{id}/` - Update post
- `DELETE /posts/{id}/` - Delete post
- `POST /posts/{id}/publish/` - Publish draft

### Social Features
- `POST /posts/{id}/like/` - Like/unlike post
- `GET /posts/{id}/likes/` - Get post likes
- `POST /posts/save_post/` - Save/unsave post
- `GET /posts/saved/` - Get saved posts

### Comments
- `GET /posts/{id}/comments/` - Get post comments
- `POST /posts/{id}/comments/` - Create comment
- `PUT /posts/{id}/comments/{id}/` - Update comment
- `DELETE /posts/{id}/comments/{id}/` - Delete comment
- `POST /posts/{id}/comments/{id}/like/` - Like comment

### AI Services
- `GET /ai/tags/?post_id={id}` - Get AI-generated tags
- `GET /ai/summary/?post_id={id}` - Get AI-generated summary

### Analytics
- `GET /posts/statistics/post_stats/{id}/` - Get post statistics
- `GET /posts/statistics/` - Get user statistics

## Key Features

### Authentication Flow
1. User provides credentials
2. Backend validates and returns JWT tokens
3. Frontend stores tokens for subsequent requests
4. Automatic token refresh on expiration

### AI Integration
1. User requests AI processing
2. Backend calls Hugging Face API
3. AI models process content
4. Results returned to user

### Real-time Features
1. User interactions trigger immediate updates
2. Background tasks handle notifications
3. Analytics tracking happens automatically
4. Search and filtering provide instant results
