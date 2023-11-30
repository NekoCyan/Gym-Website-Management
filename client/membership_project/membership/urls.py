from django.urls import path
from .views import MembershipView, TransactionView, RegistrationView, SuccessView

urlpatterns = [
    path('membership/', MembershipView.as_view(), name='membership'),
    path('transaction/', TransactionView.as_view(), name='transaction'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('success/', SuccessView.as_view(), name='success'),
     path('membership-and-transactions/', membership_and_transactions, name='membership_and_transactions'),
]
