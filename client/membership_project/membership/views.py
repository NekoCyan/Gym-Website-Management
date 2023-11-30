from rest.framework.views import APIView
from rest.framework.response import Response
from rest.framework import status
from rest.framework.permissions import IsAuthenticated
from .modedls import Member 
from .serializers import MemberSerializer

class AdditionView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Giả sử bạn có một serializer có tên là AdditionSerializer
            serializer = AdditionSerializer(data=request.data)
            
            if serializer.is_valid():
                # Sử dụng 'get' thay vì 'validated_data' để lấy giá trị từ dữ liệu đã được xác nhận
                first = serializer.validated_data.get('first')
                second = serializer.validated_data.get('second')
                
                # Thực hiện phép cộng và tạo response
                result = first + second
                response = {'result': result}
                
                return Response(response, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return Response({"message": "An error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class MemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = MemberSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Người dùng tạo thành công", "code": 201, 'success': True}, status = status.HTTP_201_CREATEd)
        else:
            return Response({"message": "Không tồn tại", "code": 400, 'success': False, "errors": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        user_id = request.user.id #Lấy ID người đg dùng
        members = Member.objects.get(id=user_id)
        serializer = MemberSerializer(members, many=True)
        return Response({"messege": "Success", "code": 200,"success": True, "data": serializer.data}, status=status.HTTP_200_OK)
class MembershipView(APIView):
    permission_classes = [IsAuthenticated] #Chỉ cho phép người dùng truy cập được xác thức mới đc truy cập

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('id')
        password = request.data.get('password')

        try:
            #Lấy thông tin người dùng hiện taị
            current_user = request.user
        except AttributeError:
            current_user = None
        
        #Kiểm tra người dùng có quyền hạn nào đó không
        if current_user and current_user.is_admin:
            # 
            member = Member.objects.all()
        else:
            # Người dùng không phải là admin, chỉ lấy thông tin về chính họ
            members = Member.objects.filter(id=user_id)

            # Kiểm tra nếu người dùng hiện tại có quyền truy cập thông tin của người dùng được yêu cầu không
        if not self.has_permission(current_user, user_id):
            return Response({"message": "Permission denied", "code": 403, "success": False}, status=status.HTTP_403_FORBIDDEN)

            # Trả về thông tin của người dùng được yêu cầu
        serializer = MemberSerializer(members, many=True)
        return Response({"message": "Success", "code": 200, "success": True, "data": serializer.data}, status=status.HTTP_200_OK)

    def has_permission(self, current_user, user_id):
        #Đây là phương thức kiểm tra người dùng hiện tại có quyền truy cập theo yêu cầu hay không
        if current_user:
            return False
        
        if current_user.is_admin():
            return True
        
        return current_user.id == requested_user_id  # Người dùng chỉ có thể truy cập thông tin của thằng người dùng

class TransactionView(APIView):
    def get(self, request, *args, **kwargs):
        transactions = Transaction.objects.all()
        serializer = TransactionSerializer(transactions, many=True)
        return Response({"message": "Success", "code": 200, "success": True, "data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = TransactionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Transaction created successfully", "code": 201, "success": True}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Invalid data", "code": 400, "success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)