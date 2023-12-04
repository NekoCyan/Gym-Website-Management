from enum import Enum

class ROLES(Enum):
    User = 0
    Trainer = 1
    Admin = 2

class GENDER(Enum):
    UNKNOWN = -1
    FEMALE = 0
    MALE = 1

class TRANSACTION_STATUS(Enum):
    PENDING = 0
    SUCCEED = 1
    FAILED = 2
    CANCELLED = 3

class TRANSACTION_TYPE(Enum):
    MEMBERSHIP = 0
    PRODUCT = 1
