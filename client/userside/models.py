from django.core.validators import FileExtensionValidator
from django.core.validators import MinValueValidator
from django.core.validators import MaxValueValidator
from django.db import models

# Create your models here.

class User_type(models.Model):
    type_id = models.AutoField(primary_key=True)
    utype = models.CharField(max_length=7,help_text="Type of User")

    def __str__(self):
        return self.utype
    
class User_master(models.Model):
    user_id = models.AutoField(primary_key=True)
    type_id = models.ForeignKey(User_type,null=True,on_delete=models.CASCADE) 
    mname = models.CharField(max_length=25,help_text="Name of the User <br> Must Be Within 25 Characters <br> Enter Alphabets Only")
    gender_choice = (('M','M'),('F','F'))            
    gender = models.CharField(max_length=1, choices=gender_choice)
    email = models.EmailField(max_length=30,unique=True,help_text="Must Contain @ and .")
    password = models.CharField(max_length=16,unique=True,help_text="Password Must be of 6 to 16 Characters ")
    address = models.CharField(max_length=150)
    mobile = models.CharField(max_length=10,help_text="Mobile no. must be of 10 Digits")
    photo = models.FileField(null=True,validators=[FileExtensionValidator(allowed_extensions=['jpg','png'])],help_text="Image File of User <br> Must of be .jpg or .png <br> Maximum Size 1MB")
    id_proof = models.FileField(null=True,validators=[FileExtensionValidator(allowed_extensions=['pdf'])],help_text="Any Government Approved Id(Aadhar/Driving License/PAN Card/Voter Id) <br> Must be .pdf File Only <br> Maximum Size 2MB")
    
    def __str__(self):
        return self.mname

class Plan_master(models.Model):
    plan_id =models.AutoField(primary_key=True)
    plan_choice = (('Basic Plan','Basic Plan'),('Standard Plan','Standard Plan'),('Ultimate Plan','Ultimate Plan'))   
    title = models.CharField(max_length=15,choices=plan_choice,help_text="Choose Type of Plan")
    details = models.TextField(help_text="Description of Plan")
    price = models.IntegerField(help_text="Price Must Be Less than 99999",validators=[MaxValueValidator(99999),MinValueValidator(0)])
    duration = models.CharField(max_length=10)

    def __str__(self):
        return self.title

class Membership_master(models.Model):
    membership_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User_master,on_delete=models.CASCADE)
    plan_id = models.ForeignKey(Plan_master,on_delete=models.CASCADE)
    start_date = models.DateField(help_text="Starting Date of Membership")
    end_date = models.DateField(help_text="Ending Date of Membership")
    amount = models.IntegerField(help_text="Amount Must Be Less than 99999",validators=[MaxValueValidator(99999),MinValueValidator(0)])
    details = models.TextField(help_text="Description of Membership")
    membership_status = models.BooleanField(help_text="Approved or Not")

    def __str__(self):
        return self.mname

class Attendance_master(models.Model):
    attendance_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User_master,on_delete=models.CASCADE)
    date = models.DateField()
    time_in = models.TimeField(help_text="Coming Time")
    time_out = models.TimeField(help_text="Leaving Time")

    def __str__(self):
        return self.mname

class Trainer_details(models.Model):
    trainer_id =models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User_master,on_delete=models.CASCADE)
    salary = models.IntegerField(help_text="Salary of Trainer Must be less than 99999",validators=[MaxValueValidator(99999),MinValueValidator(0)])
    Details = models.TextField(help_text="Additional Details About Trainer")

    def __str__(self):
        return self.mname

class Payment_master(models.Model):
    payment_id = models.AutoField(primary_key=True)
    membership_id = models.ForeignKey(Membership_master,on_delete=models.CASCADE)
    amount = models.IntegerField(help_text="Amount Must Be Less than 99999",validators=[MaxValueValidator(99999),MinValueValidator(0)])
    m_choice = (('Google Pay','Gpay'),('Paytm','Paytm'),('Cash','Cash')) 
    method = models.CharField(max_length=15,choices=m_choice,help_text="Choose Method of Making Payment")
    transaction_no = models.CharField(max_length=40,help_text="Must be a Valid Transaction Number")
    payment_status = models.BooleanField(help_text="Payment Approved or not")

    def __str__(self):
        return self.payment_id

class Product_master(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name =  models.CharField(max_length=25,help_text="Must be of length less than 25")
    qty =  models.IntegerField(validators=[MaxValueValidator(99),MinValueValidator(1)],help_text="Quantity must be less than 100")
    details = models.TextField(help_text="Description of Product")
    price = models.IntegerField(help_text="Price Must Be Less than 99999",validators=[MaxValueValidator(99999),MinValueValidator(0)])
          
    def __str__(self):
        return self.product_name

class Feedback_master(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User_master,on_delete=models.CASCADE)
    details = models.TextField(help_text="Feedback Description")
    ratings = models.IntegerField(validators=[MaxValueValidator(10),MinValueValidator(1)],help_text="Must be less than or equal to 10 <br>  10:- Highest Rating <br> 1:- Lowest Ratings")

    def __str__(self):
        return self.details

class Workout_master(models.Model):
    workout_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User_master,on_delete=models.CASCADE)
    diet_chart = models.FileField(validators=[FileExtensionValidator(allowed_extensions=['pdf'])],help_text="Must be pdf file <br> Maximum size:- 1MB ")
    workout_schedule = models.FileField(validators=[FileExtensionValidator(allowed_extensions=['pdf'])],help_text="Must be pdf file <br> Maximum size:- 1MB ")
    videos = models.FileField(validators=[FileExtensionValidator(allowed_extensions=['mp4'])],help_text="Must be of .mp4 Extension <br> Maximum Size must be 300MB")
    rewards = models.IntegerField(validators=[MaxValueValidator(9999),MinValueValidator(0)],help_text="Must be less than 9999")

    def __str__(self):
        return self.mname

class Order_master(models.Model):
    order_id =models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User_master,on_delete=models.CASCADE)
    ord_date = models.DateField(help_text="Date of Placing Order")

    def __str__(self):
        return self.mname

class Order_details(models.Model):
    order_details_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order_master,on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product_master,on_delete=models.CASCADE)
    qty = models.IntegerField(validators=[MaxValueValidator(99),MinValueValidator(1)],help_text="Quantity must be less than 100")
    price = models.IntegerField(help_text="Price Must Be Less than 99999",validators=[MaxValueValidator(99999),MinValueValidator(0)])
    tot_amt = models.IntegerField(help_text="Total Amount Must Be Less than 99999",validators=[MaxValueValidator(99999),MinValueValidator(0)])
    delivery_date = models.DateField(help_text="Date of Delivery")
    delivery_status = models.BooleanField(help_text="Status of Delivery:- Deliverd or not")
    
    def __str__(self):
        return self.mname

