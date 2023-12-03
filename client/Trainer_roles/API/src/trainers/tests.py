from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .enums import ROLES, GENDER
from .models import Trainer
import json
import pytest

from django.contrib.auth import get_user_model

def api_client():
    return APIClient()

class TrainerTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.change_password_url = reverse('change-password')

        self.trainer_data = {
            'email': '8BloodyLake@gmail.com',
            'password': 'testpassword',
            'full_name': 'Test Trainer',
            'gender': '1',
            'address': 'Test Address',
            'phone_number': '1234567890',
        }

        self.trainer = Trainer.objects.create_user(**self.trainer_data)

        self.login_data = {
            'email': '8BloodyLake@gmail.com',
            'password': 'testpassword',
        }

        self.change_password_data = {
            'new_password': 'newpassword',
        }

    def test_registration(self):
        response = self.client.post(self.register_url, self.trainer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login(self):
        response = self.client.post(self.login_url, self.login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_change_password(self):
        self.client.force_authenticate(user=self.trainer)
        response = self.client.put(self.change_password_url, self.change_password_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_trainer_registration(api_client, trainer_data):
        url = reverse('register')
        response = api_client.post(url, data=trainer_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED


    def test_trainer_login(api_client, trainer_data):
        user = Trainer.objects.create_user(**trainer_data)
        url = reverse('login')
        response = api_client.post(url, data={'email': 'trainer@example.com', 'password': 'securepassword'}, format='json')
        assert response.status_code == status.HTTP_200_OK

    def test_award_points(api_client, trainer_data):
        user = Trainer.objects.create_user(**trainer_data)
        url = reverse('award-points', kwargs={'pk': user.id})
        points_data = {'points': 10}
        response = api_client.patch(url, data=json.dumps(points_data), content_type='application/json')
        assert response.status_code == status.HTTP_200_OK
        assert json.loads(response.content)['points'] == user.points + 10