# System Architecture Diagram - Melio Ink Smart

```mermaid
graph TB
    %% Frontend Layer
    subgraph "Frontend Layer"
        React[React + TypeScript]
        Vite[Vite Build Tool]
        Tailwind[TailwindCSS]
        Router[React Router]
    end

    %% API Gateway
    subgraph "API Layer"
        DRF[Django REST Framework]
        JWT[JWT Authentication]
        CORS[CORS Headers]
        Filters[Django Filters]
    end

    %% Backend Services
    subgraph "Backend Services"
        Auth[Authentication Service]
        Posts[Post Management]
        Comments[Comment System]
        AI[AI Services]
        Analytics[Analytics Engine]
        Email[Email Service]
    end

    %% AI Services
    subgraph "AI Services"
        HF[Hugging Face API]
        BART_CNN[BART-large-CNN<br/>Summarization]
        BART_MNLI[BART-large-MNLI<br/>Tag Classification]
    end

    %% Background Tasks
    subgraph "Background Processing"
        Celery[Celery Workers]
        Redis[Redis Broker]
        Tasks[Background Tasks]
    end

    %% Data Layer
    subgraph "Data Layer"
        SQLite[SQLite Database]
        Media[Media Files]
        Static[Static Files]
    end

    %% External Services
    subgraph "External Services"
        SMTP[Gmail SMTP]
        HF_API[Hugging Face API]
    end

    %% User Interactions
    User[Users] --> React
    React --> DRF
    DRF --> Auth
    DRF --> Posts
    DRF --> Comments
    DRF --> AI
    DRF --> Analytics

    %% AI Integration
    AI --> HF
    HF --> BART_CNN
    HF --> BART_MNLI
    HF --> HF_API

    %% Background Processing
    Posts --> Celery
    Comments --> Celery
    Celery --> Redis
    Celery --> Tasks
    Tasks --> Email
    Tasks --> SMTP

    %% Data Flow
    Auth --> SQLite
    Posts --> SQLite
    Comments --> SQLite
    Analytics --> SQLite
    Posts --> Media
    React --> Static

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef ai fill:#fff3e0
    classDef data fill:#e8f5e8
    classDef external fill:#ffebee

    class React,Vite,Tailwind,Router frontend
    class DRF,JWT,CORS,Filters,Auth,Posts,Comments,Analytics,Email backend
    class HF,BART_CNN,BART_MNLI,HF_API ai
    class SQLite,Media,Static,Redis data
    class SMTP external
```

## Architecture Components

### Frontend Layer
- **React + TypeScript**: Modern UI framework with type safety
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing

### API Layer
- **Django REST Framework**: RESTful API development
- **JWT Authentication**: Secure token-based authentication
- **CORS Headers**: Cross-origin resource sharing
- **Django Filters**: Advanced filtering capabilities

### Backend Services
- **Authentication Service**: User management and JWT handling
- **Post Management**: CRUD operations for blog posts
- **Comment System**: Nested commenting with likes
- **AI Services**: Content summarization and tagging
- **Analytics Engine**: User and post statistics
- **Email Service**: Notification system

### AI Integration
- **Hugging Face API**: External AI model service
- **BART-large-CNN**: Content summarization
- **BART-large-MNLI**: Tag classification

### Background Processing
- **Celery**: Distributed task queue
- **Redis**: Message broker and caching
- **Background Tasks**: Email notifications, AI processing

### Data Layer
- **SQLite**: Primary database (PostgreSQL in production)
- **Media Files**: User uploads and post images
- **Static Files**: Frontend assets

## Data Flow

1. **User Request**: Frontend sends HTTP request to Django API
2. **Authentication**: JWT token validation
3. **Business Logic**: Django services process request
4. **AI Processing**: Background tasks for AI features
5. **Data Persistence**: Database operations
6. **Response**: JSON response to frontend
7. **UI Update**: React components update based on response
