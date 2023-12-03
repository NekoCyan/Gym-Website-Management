from django.urls import path
from .views import RegisterView, LoginView, ChangePasswordView, ProfileUpdateView, ProfileView, CheckInView, CheckOutView, ExerciseChartView, DietChartView, TrainerListView, AwardPointsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('update-profile/', ProfileUpdateView.as_view(), name='update-profile'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('check-in/', CheckInView.as_view(), name='check-in'),
    path('check-out/', CheckOutView.as_view(), name='check-out'),
    path('exercise-chart/', ExerciseChartView.as_view(), name='exercise-chart'),
    path('diet-chart/', DietChartView.as_view(), name='diet-chart'),
    path('trainers/', TrainerListView.as_view(), name='trainer-list'),
    path('award-points/<int:pk>/', AwardPointsView.as_view(), name='award-points'),
]
