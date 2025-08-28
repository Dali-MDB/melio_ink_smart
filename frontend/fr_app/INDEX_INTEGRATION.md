# Index Page Integration

This document describes the integration of the main Index page with the Django backend.

## Overview

The Index page now fetches real posts from the backend API instead of using sample data. It includes search functionality, tag filtering, and real-time interactions like likes and bookmarks.

## Backend Integration

### API Endpoints Used

- `GET /posts/` - Fetch all posts with optional filtering
- `POST /posts/{id}/like/` - Like/unlike a post
- `POST /posts/save_post/` - Save/unsave a post for bookmarks

### Search Functionality

The backend now supports search through the `search` query parameter that searches across:
- Post title
- Post content
- Post summary
- Author username, first name, and last name
- Tag names

### Filtering

- **Tags**: Filter posts by specific tags using the `tags` query parameter
- **Search**: Full-text search across multiple fields
- **Status**: Only published posts are shown on the frontend

## Frontend Features

### Real-time Data

- Posts are fetched from the backend on page load
- Search is debounced (300ms delay) to avoid excessive API calls
- Tag filtering updates results immediately
- Loading states for better UX

### Interactive Features

- **Likes**: Click heart icon to like/unlike posts (requires authentication)
- **Bookmarks**: Click bookmark icon to save/unsave posts (requires authentication)
- **Search**: Real-time search with backend integration
- **Tag Filtering**: Filter posts by tags

### Data Transformation

The backend data is transformed to match the frontend component structure:

```javascript
// Backend post structure
{
  id: 1,
  title: "Post Title",
  content: "Post content...",
  owner: { username: "user", first_name: "John", last_name: "Doe" },
  tags: [{ name: "Technology" }],
  likes_count: 5,
  comments_count: 3,
  is_liked: false,
  is_saved: false,
  created_at: "2024-01-01T00:00:00Z"
}

// Transformed to frontend structure
{
  id: 1,
  title: "Post Title",
  summary: "Post content...",
  author: { name: "John Doe", avatar: null },
  tags: ["Technology"],
  likes: 5,
  comments: 3,
  isLiked: false,
  isBookmarked: false,
  publishedAt: "2 days ago"
}
```

## User Experience

### Loading States

- Initial page load shows a spinner
- Search operations show a loading indicator
- Like/bookmark actions show loading states on buttons

### Error Handling

- Network errors are displayed to users
- Failed API calls show appropriate error messages
- Optimistic updates are reverted on failure

### Responsive Design

- Grid layout adapts to screen size
- Search and filters work on mobile
- Touch-friendly interactions

## Authentication Integration

- Unauthenticated users can view posts but cannot like/bookmark
- Like/bookmark buttons are disabled for unauthenticated users
- Authentication state is managed by the AuthContext

## Performance Optimizations

- **Debounced Search**: Prevents excessive API calls during typing
- **Optimistic Updates**: UI updates immediately, reverts on failure
- **Efficient Filtering**: Backend handles filtering to reduce data transfer
- **Caching**: Posts are cached in component state

## Future Enhancements

- Pagination for large post lists
- Infinite scroll
- Advanced search filters (date range, author, etc.)
- Post sorting options (newest, most popular, etc.)
- Real-time updates for likes/comments
