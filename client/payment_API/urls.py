from django.urls import path
from .views import payment, ProductDetailView

urlpatterns = [
    path('api/payment/<str:token>/', payment, name='payment'),
    # Các đường dẫn khác của ứng dụng có thể được thêm vào đây
]
