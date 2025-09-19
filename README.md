# Melio Ink Smart - AI-Powered Blogging Platform

A modern, full-stack blogging platform that leverages AI to enhance content creation and discovery. Built with Django REST Framework and React, featuring intelligent content summarization, automated tagging, and comprehensive analytics.

## 🚀 What Problems Does It Solve?

### For Content Creators
- **Long-form Content Accessibility**: AI-generated summaries make lengthy blog posts more digestible for readers
- **Content Discovery**: Automated tagging system improves content categorization and discoverability
- **Performance Analytics**: Detailed statistics help creators understand their audience engagement
- **Draft Management**: Save and publish workflow with preview capabilities

### For Readers
- **Quick Content Consumption**: AI summaries provide quick insights into long articles
- **Enhanced Search**: Advanced filtering and search across content, authors, and tags
- **Personalized Experience**: Save/bookmark posts, like content, and engage through comments
- **Social Features**: Like posts, comment with nested replies, and follow favorite authors

### For Developers
- **Modern Tech Stack**: Clean separation between frontend and backend with RESTful APIs
- **Scalable Architecture**: Built with Django, React, and Redis for background tasks
- **AI Integration**: Hugging Face models for content summarization and tagging
- **Production Ready**: Dockerized deployment with comprehensive documentation

## ✨ Key Features

### 🤖 AI-Powered Content Enhancement
- **Automatic Summarization**: Generate concise summaries of long blog posts using BART-large-CNN
- **Smart Tagging**: AI-powered tag suggestions using BART-large-MNLI for content classification
- **Content Analysis**: Intelligent content processing for better categorization

### 📝 Content Management
- **Rich Text Editor**: Create and edit posts with markdown support
- **Draft System**: Save posts as drafts and publish when ready
- **Image Upload**: Support for post images with automatic optimization
- **Tag Management**: Create, manage, and filter content by tags

### 👥 User Management & Authentication
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **User Profiles**: Comprehensive user profiles with avatars and personal information
- **Permission System**: Role-based access control for content management

### 💬 Social Features
- **Like System**: Like/unlike posts and comments
- **Commenting**: Nested comment system with replies
- **Bookmarking**: Save posts for later reading
- **User Interactions**: Follow user activity and engagement

### 📊 Analytics & Statistics
- **Post Analytics**: Detailed statistics for individual posts (views, likes, comments)
- **User Statistics**: Comprehensive user performance metrics
- **Engagement Tracking**: Monthly breakdowns of user interactions
- **View Tracking**: Automatic post view tracking with IP and user agent logging

### 🔍 Advanced Search & Filtering
- **Full-Text Search**: Search across post titles, content, summaries, and author information
- **Tag Filtering**: Filter posts by specific tags
- **Date Range Filtering**: Filter content by creation date
- **Real-time Search**: Debounced search with instant results

### 📧 Notification System
- **Email Notifications**: Automated email alerts for likes and comments
- **User Preferences**: Configurable notification settings
- **SMTP Integration**: Gmail SMTP support for reliable email delivery

## 🏗️ Architecture

### Backend (Django REST Framework)
- **Django 5.2.4**: Modern Python web framework
- **Django REST Framework**: Powerful API development
- **JWT Authentication**: Secure token-based auth with SimpleJWT
- **Celery**: Background task processing with Redis
- **SQLite/PostgreSQL**: Flexible database support
- **CORS Support**: Cross-origin resource sharing for frontend integration

### Frontend (React + TypeScript)
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching

### AI Services
- **Hugging Face API**: BART models for summarization and classification
- **Content Processing**: Intelligent text analysis and categorization
- **Tag Generation**: Automated tag suggestions based on content

### Infrastructure
- **Docker**: Containerized deployment
- **Redis**: Caching and message broker for Celery
- **Gunicorn**: Production WSGI server
- **Nginx**: Reverse proxy and static file serving (production)

## 🛠️ Technology Stack

### Backend Dependencies
```
Django==5.2.4
djangorestframework==3.15.2
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.3.0
django-filter==23.5
celery==5.3.4
redis==5.0.1
requests==2.31.0
Pillow==10.1.0
python-dotenv==1.0.0
gunicorn==21.2.0
```

### Frontend Dependencies
```
React 18
TypeScript
Vite
TailwindCSS
Radix UI
React Router DOM
React Query
Lucide React (icons)
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Redis server
- Docker (optional)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd melio_ink_smart
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-django-secret-key
   HF_TOKEN=your-hugging-face-token
   EMAIL_SENDER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

4. **Database Setup**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Frontend Setup**
   ```bash
   cd frontend/fr_app
   npm install
   ```

### Running the Application

#### Development Mode

1. **Start Redis** (required for Celery)
   ```bash
   redis-server
   ```

2. **Start Celery Worker** (in a separate terminal)
   ```bash
   cd backend
   celery -A ink_smart worker --loglevel=info
   ```

3. **Start Django Backend**
   ```bash
   cd backend
   python manage.py runserver
   ```

4. **Start React Frontend**
   ```bash
   cd frontend/fr_app
   npm run dev
   ```

#### Production Mode with Docker

1. **Build and run with Docker**
   ```bash
   # Backend
   cd backend
   docker build -t melio-backend .
   docker run -p 8000:8000 melio-backend

   # Frontend
   cd frontend/fr_app
   docker build -t melio-frontend .
   docker run -p 3000:3000 melio-frontend
   ```

2. **Run Redis with Docker**
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /users/auth/register/` - User registration
- `POST /users/auth/login/` - User login
- `POST /users/auth/access_token/` - Refresh access token

### Post Management
- `GET /posts/` - List all published posts
- `POST /posts/` - Create new post (authenticated)
- `GET /posts/{id}/` - Get specific post
- `PUT /posts/{id}/` - Update post (owner only)
- `DELETE /posts/{id}/` - Delete post (owner only)
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

## 🔧 Configuration

### Django Settings
Key settings in `backend/ink_smart/settings.py`:
- JWT token lifetime configuration
- CORS settings for frontend integration
- Celery configuration for background tasks
- Media file handling

### Frontend Configuration
- API base URL configuration in `frontend/fr_app/client/lib/api.js`
- Authentication token management
- Environment-specific settings

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend/fr_app
npm test
```

## 📦 Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in Django settings
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Set up Redis for Celery
- [ ] Configure email SMTP settings
- [ ] Set up static file serving
- [ ] Configure domain and SSL certificates
- [ ] Set up monitoring and logging

### Docker Deployment
The application includes Dockerfiles for both frontend and backend:
- `backend/Dockerfile` - Django application
- `frontend/fr_app/Dockerfile` - React application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hugging Face for providing AI models
- Django and React communities
- All contributors and users

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Melio Ink Smart** - Where AI meets content creation 🚀
