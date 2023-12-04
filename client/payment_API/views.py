import json
import requests
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Product, User
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import DetailView
from .serializers import ProductSerializer
from rest_framework.response import Response

@csrf_exempt
def payment(request, token):
    if request.method == 'POST':
        try:
            _ = get_object_or_404(User, auth_token=token)
            
            data = json.loads(request.body)
            quantity = data.get('quantity', 1)

            if not quantity or quantity < 1:
                return JsonResponse({'error': 'Invalid quantity'}, status=400)

            product_id = 1  # Thay bằng logic lấy product_id từ request hoặc database
            product = get_object_or_404(Product, id=product_id)
            total_price = product.price * quantity


            return JsonResponse({'message': 'Payment successful', 'total_price': total_price})

        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

class ProductDetailView(DetailView):
    model = Product
    template_name = 'product_detail.html'
    context_object_name = 'product'

def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)