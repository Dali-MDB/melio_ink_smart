# Class Diagram - Melio Ink Smart Data Models

```mermaid
classDiagram
    class User {
        +int id
        +string username
        +string email
        +string first_name
        +string last_name
        +datetime date_joined
        +boolean is_active
        +get_posts()
        +get_comments()
        +get_likes()
    }

    class Profile {
        +int id
        +User user
        +ImageField pfp
        +string first_name
        +string last_name
        +int age
        +string phone
        +boolean accept_notifications
        +__str__()
    }

    class Post {
        +int id
        +User owner
        +string title
        +TextField content
        +ImageField image
        +ManyToManyField tags
        +TextField summary
        +datetime created_at
        +string status
        +ManyToManyField savers
        +get_comments_count()
        +get_likes_count()
    }

    class Tag {
        +int id
        +string name
        +__str__()
    }

    class Comment {
        +int id
        +User owner
        +Post post
        +TextField content
        +datetime created_at
        +Comment parent_comment
        +ManyToManyField likes
    }

    class Like {
        +int id
        +User user
        +Post post
        +datetime time_stamp
    }

    class CommentLike {
        +int id
        +User user
        +Comment comment
        +datetime time_stamp
    }

    class PostView {
        +int id
        +Post post
        +User viewer
        +GenericIPAddressField ip_address
        +TextField user_agent
        +TextField referrer
        +datetime timestamp
        +__str__()
    }

    %% Relationships
    User ||--|| Profile : "has one"
    User ||--o{ Post : "owns"
    User ||--o{ Comment : "writes"
    User ||--o{ Like : "creates"
    User ||--o{ CommentLike : "creates"
    User ||--o{ PostView : "views"
    
    Post ||--o{ Comment : "has"
    Post ||--o{ Like : "receives"
    Post ||--o{ PostView : "tracked by"
    Post }o--o{ Tag : "tagged with"
    Post }o--o{ User : "saved by"
    
    Comment ||--o{ Comment : "replies to"
    Comment ||--o{ CommentLike : "receives"
```

## Model Relationships

### Core Entities
- **User**: Django's built-in User model extended with Profile
- **Profile**: Extended user information with preferences
- **Post**: Main content entity with rich metadata
- **Tag**: Categorization system for posts

### Interaction Entities
- **Comment**: Nested commenting system with parent-child relationships
- **Like**: Post and comment liking system
- **PostView**: Analytics tracking for post views

### Key Features
- **Many-to-Many Relationships**: Posts-Tags, Posts-Savers, Comments-Likes
- **Self-Referencing**: Comments can have parent comments (nested replies)
- **Analytics**: PostView tracks detailed view information
- **Soft Relationships**: Optional user tracking for anonymous views
