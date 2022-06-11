from django.urls import path, re_path 
from frontend import views
urlpatterns = [
        path('', views.index_view), # empty url
        re_path(r'^.*/$', views.index_view) # all other urls
        ]
