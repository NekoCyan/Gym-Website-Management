# utils.py
import re

def is_valid_email(email):
    """
    Kiểm tra xem một chuỗi có đúng định dạng email hay không.
    """
    email_regex = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
    return bool(re.match(email_regex, email))

def is_valid_password(password):
    """
    Kiểm tra xem một mật khẩu có đáp ứng yêu cầu an toàn không.
    Trong ví dụ này, yêu cầu là mật khẩu phải có ít nhất 6 ký tự.
    Bạn có thể mở rộng chức năng này theo nhu cầu của mình.
    """
    return len(password) >= 6

# Các hàm khác có thể được thêm vào sau này
 