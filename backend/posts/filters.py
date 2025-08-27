import django_filters
from .models import Post, Tag

class PostFilter(django_filters.FilterSet):
    # Filter by created_at range
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    # Filter by tag name (OR behavior)
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name='tags__name',
        to_field_name='name',
        queryset=Tag.objects.all()
    )

    class Meta:
        model = Post
        fields = ['created_after', 'created_before', 'tags']
