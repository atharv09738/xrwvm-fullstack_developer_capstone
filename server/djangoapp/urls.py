from django.urls import path
from . import views

app_name = 'djangoapp'

urlpatterns = [
    path('login', views.login_user, name='login'),
    path('logout', views.logout_request, name='logout'),
    path('register', views.registration, name='register'),
    path('registration', views.registration, name='registration'),
    path('dealerships', views.get_dealerships, name='dealerships'),
    path('dealerships/<str:state>', views.get_dealerships_by_state, name='dealerships_by_state'),
    path('dealer/<int:dealer_id>', views.get_dealer_details, name='dealer_details'),
    path('reviews/dealer/<int:dealer_id>', views.get_dealer_reviews, name='dealer_reviews'),
    path('reviews/add', views.add_review, name='add_review'),
    path('cars', views.get_cars, name='cars'),
]