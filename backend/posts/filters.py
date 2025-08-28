import django_filters
from django.db.models import Q
from .models import Post, Tag

class PostFilter(django_filters.FilterSet):
    # Search filter
    search = django_filters.CharFilter(method='search_filter')
    
    # Filter by created_at range
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    # Filter by tag name (OR behavior)
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name='tags__name',
        to_field_name='name',
        queryset=Tag.objects.all()
    )

    def search_filter(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(title__icontains=value) |
                Q(content__icontains=value) |
                Q(summary__icontains=value) |
                Q(owner__username__icontains=value) |
                Q(owner__first_name__icontains=value) |
                Q(owner__last_name__icontains=value) |
                Q(tags__name__icontains=value)
            ).distinct()
        return queryset

    class Meta:
        model = Post
        fields = ['search', 'created_after', 'created_before', 'tags']
