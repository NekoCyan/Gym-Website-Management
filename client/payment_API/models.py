from django.db import models

class User(models.Model):
    # Định nghĩa trường thông tin user cần
    auth_token = models.CharField(max_length=255, unique=True)

class Product(models.Model):
    # Định nghĩa trường thông tin sản phẩm cần
    name = models.CharField(max_length=255)
    details = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    storage = models.IntegerField()
