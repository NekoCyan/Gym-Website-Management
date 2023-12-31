from .serializers import TrainerSerializer

def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': TrainerSerializer(user).data
    }
