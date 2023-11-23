from django.contrib import admin

# Register your models here.
from .models import User_master
from .models import User_type
from .models import Plan_master
from .models import Membership_master
from .models import Attendance_master
from .models import Trainer_details
from .models import Product_master
from .models import Payment_master
from .models import Feedback_master
from .models import Workout_master
from .models import Order_master
from .models import Order_details

admin.site.register(User_master)
admin.site.register(User_type)
admin.site.register(Membership_master)
admin.site.register(Plan_master)
admin.site.register(Attendance_master)
admin.site.register(Trainer_details)
admin.site.register(Product_master)
admin.site.register(Payment_master)
admin.site.register(Feedback_master)
admin.site.register(Workout_master)
admin.site.register(Order_master)
admin.site.register(Order_details)

