from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Post,User,PostView,Like,Comment
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import ExtractYear, ExtractMonth




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_statistics(request):
    # Get all published posts owned by the user
    user_posts = Post.objects.filter(owner=request.user, status='PUBLISHED')
    
    # Get post IDs for filtering
    post_ids = user_posts.values_list('id', flat=True)
    
    # Get monthly views for all user's posts
    monthly_views = PostView.objects.filter(post_id__in=post_ids).annotate(
        year=ExtractYear('timestamp'),
        month=ExtractMonth('timestamp')
    ).values('year', 'month').annotate(
        view_count=Count('id')
    ).order_by('year', 'month')

    # Get monthly comments for all user's posts
    monthly_comments = Comment.objects.filter(post_id__in=post_ids).annotate(
        year=ExtractYear('created_at'),
        month=ExtractMonth('created_at')
    ).values('year', 'month').annotate(
        comment_count=Count('id')
    ).order_by('year', 'month')

    # Get monthly likes for all user's posts
    monthly_likes = Like.objects.filter(post_id__in=post_ids).annotate(
        year=ExtractYear('time_stamp'),
        month=ExtractMonth('time_stamp')
    ).values('year', 'month').annotate(
        like_count=Count('id')
    ).order_by('year', 'month')

    # Combine the data
    result = {}
    for item in monthly_views:
        index = f"{item['year']}-{item['month']:02d}"
        if index not in result:
            result[index] = {
                "views": 0,
                "comments": 0,
                "likes": 0
            }
        result[index]['views'] = item['view_count']
    
    for item in monthly_likes:
        index = f"{item['year']}-{item['month']:02d}"
        if index not in result:
            result[index] = {
                "views": 0,
                "comments": 0,
                "likes": 0
            }
        result[index]['likes'] = item['like_count']

    for item in monthly_comments:
        index = f"{item['year']}-{item['month']:02d}"
        if index not in result:
            result[index] = {
                "views": 0,
                "comments": 0,
                "likes": 0
            }
        result[index]['comments'] = item['comment_count']
    
    # Calculate additional statistics
    total_posts = user_posts.count()
    total_views = sum(item['view_count'] for item in monthly_views)
    total_likes = sum(item['like_count'] for item in monthly_likes)
    total_comments = sum(item['comment_count'] for item in monthly_comments)
    
    # Calculate averages per post
    avg_views_per_post = total_views / total_posts if total_posts > 0 else 0
    avg_likes_per_post = total_likes / total_posts if total_posts > 0 else 0
    avg_comments_per_post = total_comments / total_posts if total_posts > 0 else 0
    
    return Response({
        'user_id': request.user.id,
        'username': request.user.username,
        'total_posts': total_posts,
        'detailed_stats': result,
        'totals': {
            'views': total_views,
            'likes': total_likes,
            'comments': total_comments
        },
        'averages': {
            'views_per_post': round(avg_views_per_post, 2),
            'likes_per_post': round(avg_likes_per_post, 2),
            'comments_per_post': round(avg_comments_per_post, 2)
        },
        'time_periods': len(result)
    })