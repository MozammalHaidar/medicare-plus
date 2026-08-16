"""
Tests for the auth flow the frontend actually depends on: register,
login, authenticated profile access, and the refresh/logout token
lifecycle. This is the second most business-critical flow in the
project after appointment booking — nearly every protected feature
(profile, patient dashboard, reviews) sits on top of it.
"""

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class RegistrationTests(APITestCase):
    def test_register_creates_a_patient_account(self):
        response = self.client.post('/api/v1/auth/register/', {
            'email': 'jordan@test.com',
            'first_name': 'Jordan',
            'last_name': 'Lee',
            'password': 'TestPass123!',
            'password_confirm': 'TestPass123!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['role'], 'patient')
        user = User.objects.get(email='jordan@test.com')
        self.assertTrue(user.check_password('TestPass123!'))

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(email='jordan@test.com', password='TestPass123!', first_name='J', last_name='L')
        response = self.client.post('/api/v1/auth/register/', {
            'email': 'jordan@test.com', 'first_name': 'Jordan', 'last_name': 'Lee',
            'password': 'TestPass123!', 'password_confirm': 'TestPass123!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data['errors'])

    def test_register_rejects_mismatched_passwords(self):
        response = self.client.post('/api/v1/auth/register/', {
            'email': 'jordan@test.com', 'first_name': 'Jordan', 'last_name': 'Lee',
            'password': 'TestPass123!', 'password_confirm': 'Different123!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_rejects_weak_password(self):
        response = self.client.post('/api/v1/auth/register/', {
            'email': 'jordan@test.com', 'first_name': 'Jordan', 'last_name': 'Lee',
            'password': 'password', 'password_confirm': 'password',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginAndProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='jordan@test.com', password='TestPass123!', first_name='Jordan', last_name='Lee'
        )

    def test_login_returns_access_and_refresh_tokens(self):
        response = self.client.post('/api/v1/auth/login/', {
            'email': 'jordan@test.com', 'password': 'TestPass123!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_rejects_wrong_password(self):
        response = self.client.post('/api/v1/auth/login/', {
            'email': 'jordan@test.com', 'password': 'WrongPassword!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_requires_authentication(self):
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_the_authenticated_users_profile(self):
        self.client.force_authenticate(self.user)
        response = self.client.get('/api/v1/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'jordan@test.com')

    def test_patch_me_updates_profile_fields(self):
        self.client.force_authenticate(self.user)
        response = self.client.patch('/api/v1/auth/me/', {'phone': '5551234567'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, '5551234567')

    def test_patch_me_cannot_change_role(self):
        """`role` is read-only — a patient PATCHing their own profile
        can't quietly promote themselves to admin."""
        self.client.force_authenticate(self.user)
        response = self.client.patch('/api/v1/auth/me/', {'role': 'admin'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, 'patient')

    def test_change_password_requires_correct_current_password(self):
        self.client.force_authenticate(self.user)
        response = self.client.post('/api/v1/auth/change-password/', {
            'old_password': 'WrongPassword!', 'new_password': 'NewTestPass456!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_succeeds_with_correct_current_password(self):
        self.client.force_authenticate(self.user)
        response = self.client.post('/api/v1/auth/change-password/', {
            'old_password': 'TestPass123!', 'new_password': 'NewTestPass456!',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewTestPass456!'))


class TokenLifecycleTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='jordan@test.com', password='TestPass123!', first_name='Jordan', last_name='Lee'
        )
        login = self.client.post('/api/v1/auth/login/', {
            'email': 'jordan@test.com', 'password': 'TestPass123!',
        }, format='json')
        self.access = login.data['access']
        self.refresh = login.data['refresh']

    def test_refresh_issues_a_new_access_token(self):
        response = self.client.post('/api/v1/auth/refresh/', {'refresh': self.refresh}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertNotEqual(response.data['access'], self.access)

    def test_refresh_rotates_and_blacklists_the_old_refresh_token(self):
        """With ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION on, using
        a refresh token issues a new one and invalidates the old one —
        it can't be used a second time."""
        first_refresh_response = self.client.post('/api/v1/auth/refresh/', {'refresh': self.refresh}, format='json')
        self.assertEqual(first_refresh_response.status_code, status.HTTP_200_OK)

        reuse_attempt = self.client.post('/api/v1/auth/refresh/', {'refresh': self.refresh}, format='json')
        self.assertEqual(reuse_attempt.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_blacklists_the_refresh_token(self):
        logout_response = self.client.post('/api/v1/auth/logout/', {'refresh': self.refresh}, format='json')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        reuse_attempt = self.client.post('/api/v1/auth/refresh/', {'refresh': self.refresh}, format='json')
        self.assertEqual(reuse_attempt.status_code, status.HTTP_401_UNAUTHORIZED)
