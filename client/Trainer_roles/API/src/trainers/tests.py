# trainers/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

class TrainerAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('trainer-register')
        self.login_url = reverse('trainer-login')
        self.profile_url = reverse('trainer-profile')

        self.user_data = {
            'email': 'dinhlam18112003@gmail.com',
            'password': 'dellchogihet',
            'full_name': 'Lakeserl',
            'gender': 'M    ',
            'address': '123 Main St',
            'phone_number': '123456789',
            'roles': 0,
        }

        self.user = get_user_model().objects.create_user(**self.user_data)

    def test_trainer_registration(self):
        response = self.client.post(self.register_url, data=self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_trainer_login(self):
        response = self.client.post(self.login_url, data={'email': 'test@example.com', 'password': 'testpassword'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_trainer_profile_authenticated(self):
        # Ensure the user is authenticated for this test
        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')
        # Add more assertions based on your expected response

    def test_trainer_profile_unauthenticated(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('email', response.data)
