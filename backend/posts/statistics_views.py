from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Post,User,PostView,Like,Comment
from rest_framework.response import Response
from django.db.models import Count
from django.db.models.functions import ExtractYear, ExtractMonth


@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def get_post_statistics(request,post_id:int):
    post = get_object_or_404(Post,id=post_id)
    # if not post.owner == request.user:
    #     return Response('you can not get statistics for a post you do not own',403)
    # if post.status != 'PUBLISHED':
    #     return Response('this post has not been published yet',400)
    
    monthly_views = PostView.objects.filter(post_id=post_id).annotate(
        year=ExtractYear('timestamp'),
        month=ExtractMonth('timestamp')
    ).values('year', 'month').annotate(
        view_count=Count('id')
    ).order_by('year', 'month')

    monthly_comments = Comment.objects.filter(post_id=post_id).annotate(
        year=ExtractYear('created_at'),
        month=ExtractMonth('created_at')
    ).values('year', 'month').annotate(
        comment_count=Count('id')
    ).order_by('year', 'month')

    monthly_likes = Like.objects.filter(post_id=post_id).annotate(
        year=ExtractYear('time_stamp'),
        month=ExtractMonth('time_stamp')
    ).values('year', 'month').annotate(
        like_count=Count('id')
    ).order_by('year', 'month')

    result = {}
    for item in monthly_views:
        index = str(item['year'])+'-'+str(item['month'])
        if not index in result:
            result[index] = {
                "views": 0,
                "comments": 0,
                "likes" : 0
            }
        inst = result[index]
        inst['views'] = item['view_count']
    
    for item in monthly_likes:
        index = str(item['year'])+'-'+str(item['month'])
        if not index in result:
            result[index] = {
                "views": 0,
                "comments": 0,
                "likes" : 0
            }
        inst = result[index]
        inst['likes'] = item['like_count']

    for item in monthly_comments:
        index = str(item['year'])+'-'+str(item['month'])
        if not index in result:
            result[index] = {
                "views": 0,
                "comments": 0,
                "likes" : 0
            }
        inst = result[index]
        inst['comments'] = item['comment_count']
    
    return Response({
        'detailed_stats':result,
        'total_views' : sum(item['view_count'] for item in monthly_views),
        'total_likes': sum(item['like_count'] for item in monthly_likes),
        'total_comments': sum(item['comment_count'] for item in monthly_comments),
    })
