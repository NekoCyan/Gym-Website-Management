from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from .models import Trainer, Attendance,ExerciseChart, DietChart
from .serializers import TrainerSerializer, RegisterSerializer, LoginSerializer, ProfileUpdateSerializer, AttendanceSerializer, ExerciseChartSerializer, DietChartSerializer
from django.utils import timezone

class RegisterView(generics.CreateAPIView):
    queryset = Trainer.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'message': 'Đăng ký thành công'}, status=status.HTTP_201_CREATED, headers=headers)

class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = Trainer.objects.filter(email=email).first()

        if user is None or not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TrainerSerializer(user)
        return Response({'token': user.get_token(), 'user': serializer.data}, status=status.HTTP_200_OK)

class ChangePasswordView(generics.UpdateAPIView):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    authentication_classes = [JSONWebTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({'message': 'Thay đổi mật khẩu thành công'}, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save(password=serializer.validated_data['new_password'])

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class ProfileUpdateView(generics.UpdateAPIView):
    queryset = Trainer.objects.all()
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

class CheckInView(generics.CreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, check_in_time=timezone.now())

class CheckOutView(generics.UpdateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Attendance.objects.get(user=self.request.user, check_out_time__isnull=True)

    def perform_update(self, serializer):
        serializer.save(check_out_time=timezone.now(), duration=timezone.now() - serializer.validated_data['check_in_time'])
        
class ExerciseChartView(generics.ListCreateAPIView):
    queryset = ExerciseChart.objects.all()
    serializer_class = ExerciseChartSerializer
    permission_classes = [IsAuthenticated]

class DietChartView(generics.ListCreateAPIView):
    queryset = DietChart.objects.all()
    serializer_class = DietChartSerializer
    permission_classes = [IsAuthenticated]

class TrainerListView(generics.ListCreateAPIView):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    permission_classes = [IsAdminUser]

class AwardPointsView(generics.UpdateAPIView):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        points_to_award = request.data.get('points', 0)

        if points_to_award <= 0:
            return Response({'error': 'Invalid points value'}, status=status.HTTP_400_BAD_REQUEST)

        instance.points += points_to_award
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)