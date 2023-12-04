from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.conf.urls.static import static
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.contrib.auth.models import User,AbstractBaseUser, BaseUserManager
from django.contrib.auth import authenticate, login
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.db import models

import json
import requests
import datetime

import mysql.connector as mcdb
conn = mcdb.connect(host="localhost", user="root", passwd="", database='myproject1')
print('Successfully connected to database')
cur = conn.cursor()

# Create your views here.
def home(request):
    return render(request,'Userside/home.html')

def contact(request):
    return render(request,'Userside/contact.html')

def account(request):
    return render(request,'Userside/account.html') 

def blog(request):
    return render(request,'Userside/blog.html') 

def blog_single(request):
    return render(request,'Userside/blog-single.html')

def checkout(request):
    return render(request,'Userside/checkout.html')

def classes_detail(request):
    return render(request,'Userside/classes-detail.html') 

def classes(request):
    return render(request,'Userside/classes.html') 

def about(request):
    return render(request,'Userside/about.html') 

def price(request):
    return render(request,'Userside/price.html') 

def faq(request):
    return render(request,'Userside/faq.html') 

def portfolio(request):
    return render(request,'Userside/portfolio.html') 

def not_found(request):
    return render(request,'Userside/not-found.html') 

def portfolio_detail(request):
    return render(request,'Userside/portfolio-detail.html') 

def shop_single(request,id):
    print("Details Paid Open")
    cur.execute("select * from `product_master` where `Product_Id` = {}".format(id))
    db_data = cur.fetchone()
    print(list(db_data))
    return render(request,'Userside/shop-single.html', {'mydata': db_data})

def shop(request):
    if 'user_id' in request.COOKIES and request.session.has_key('user_id'):
        cur.execute("SELECT * FROM `product_master`")
        data = cur.fetchall()
        #return list(data)
        #print(list(data))
        return render(request,'Userside/shop.html',{'mydata': data})
    else:
        return redirect(login)    


def addtocartprocess(request,id):
    print(id)
    pid = request.POST['pid']
    qty = 1
    price = request.POST['price']
    userid = "1"
    cur.execute("INSERT INTO `tbl_cart`(`user_id`,`product_id`,`product_qty`,`product_price`) VALUES ('{}','{}','{}','{}')".format(userid,pid,qty,price))
    conn.commit()
    messages.success(request, 'Record Added!!')
    return redirect(shopping_cart)


def shopping_cart(request):
    cur.execute('''SELECT
    tbl_cart.cart_id
    , product_master.Product_Name
    , tbl_cart.product_qty
    , tbl_cart.product_price
    
    , tbl_cart.product_id
    , tbl_cart.user_id
FROM
    product_master
    INNER JOIN tbl_cart 
        ON (product_master.product_id = tbl_cart.product_id)''')
    db_data = cur.fetchall()
    #return list(data)
    print(list(db_data))
    return render(request, 'Userside/shopping-cart.html', {'mydata': db_data})  


def cartdelete(request,id):
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `tbl_cart` where `cart_id` = {}".format(id))
    conn.commit()
    messages.success(request, 'Record Deleted!!')
    return redirect(shopping_cart) 
  

def team(request):
    cur.execute("SELECT t.Details,u.User_Name,u.Photo FROM `user_master` u,`trainer_details` t WHERE t.User_Id=u.User_Id")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/team.html',{'mydata': data})

def testimonial(request):
    cur.execute("SELECT ut.User_Type,u.User_Name,u.Photo,f.Details,f.Ratings FROM `feedback_master` f,`user_master` u,`user_type` ut WHERE f.User_Id=u.User_Id and u.Type_Id=ut.Type_Id")
    data = cur.fetchall()
    print(list(data))
    return render(request,'Userside/testimonial.html',{'mydata': data,'r':data[4]})

def testimonialadd(request):
    if request.method == 'POST':
        print(request.POST)
        uid = request.session['user_id']
        msg = request.POST['message']
        rating = request.POST['ratings']
        cur.execute("INSERT INTO `feedback_master`(`User_Id`,`Details`,`Ratings`) VALUES ('{}','{}','{}')".format(uid,msg,rating))
        conn.commit()
        messages.success(request,'Feedback Added Successfully')
        return redirect(testimonial) 
    else:
        return redirect(testimonial)



def register(request):
    return render(request, 'Userside/register.html')

def registerprocess(request):
    if request.method == 'POST':
        # Extract data from the form
        name = request.POST['mname']
        gender = request.POST['gender']
        email = request.POST['email']
        address = request.POST['address']
        mobile = request.POST['mobile']
        photo = request.FILES['photo']
        id_proof = request.FILES['id_proof']
        plan = request.POST['plan']
        password = request.POST['password']

        # Build the payload as a JSON object
        payload = {
            'email': email,
            'password': password,
            'fullName': name,
            'gender': gender,
            'address': address,
            'phoneNumber': mobile,
            'plan': plan,
            # ... other fields
        }

        # API endpoint URL for registration
        register_api_url = 'http://localhost:3000/api/auth/register'

        try:
            # Send POST request to the registration API
            response = requests.post(register_api_url, data=json.dumps(payload), headers={'Content-Type': 'application/json'})

            if response.status_code == 201:
                # Registration successful, get the token from the response
                token = response.json().get('token')

                # Save the token to the session or cookies for automatic login
                request.session['token'] = token

                # Redirect to the login page (or any other desired page)
                return redirect('/login')
            else:
                # Registration failed, handle the error
                return render(request, 'error.html', {'error_message': 'Registration failed'})
        except Exception as e:
            # Handle other exceptions
            return render(request, 'error.html', {'error_message': str(e)})

    else:
        # If the request method is not POST, redirect to the registration page
        return redirect('register')


def login(request):
    if request.method == 'POST':
        # Lấy thông tin từ form đăng nhập
        uemail = request.POST['useremil']
        upassword = request.POST['userpassword']
        usertype = request.POST['type']

        # Gửi yêu cầu API đến máy chủ Node.js
        api_url = 'http://localhost:3000/api/auth/login'
        payload = {'email': uemail, 'password': upassword}
        response = requests.post(api_url, json=payload)

        if response.status_code == 200:
            # Xử lý dữ liệu từ API Node.js nếu cần
            data_from_nodejs = response.json()

            # Lưu API token vào session hoặc cookie
            request.session['api_token'] = data_from_nodejs.get('token')

            # Đoạn code kiểm tra quyền và chuyển hướng tương ứng
            if usertype == "Trainer" and data_from_nodejs.get('userType') == 2:
                request.session['user_id'] = data_from_nodejs.get('userId')
                request.session['user_email'] = uemail
                request.session['user_name'] = data_from_nodejs.get('userName')
                request.session['user_photo'] = data_from_nodejs.get('userPhoto')
                response = redirect("http://127.0.0.1:3000/trainerapp/")
                response.set_cookie('user_id', data_from_nodejs.get('userId'))
                response.set_cookie('user_email', uemail)
                return response
            elif usertype == "Member" and data_from_nodejs.get('userType') == 1:
                request.session['user_id'] = data_from_nodejs.get('userId')
                request.session['user_email'] = uemail
                response = redirect('home')  # Chuyển hướng đến trang home
                response.set_cookie('user_id', data_from_nodejs.get('userId'))
                response.set_cookie('user_email', uemail)
                return response
            else:
                return render(request, 'Userside/login.html')
        else:
            return render(request, 'error.html', {'error_message': 'Đăng nhập không thành công'})
    else:
        return render(request, 'Userside/login.html')

def logout(request):
    del request.session['user_id']
    del request.session['user_email']
    response = redirect(login)
    response.delete_cookie('user_id')
    response.delete_cookie('user_email')
    return response

def forgot(request):
    return render(request,'Userside/forgot.html')    
    
def forgotpasswordprocess(request):
    print(request.POST)
    user_email = request.POST['useremil']
    cur.execute("select * from `user_master` where `Email` = '{}'".format(user_email))
    db_data = cur.fetchone()
        
    if db_data is not None:
        if len(db_data) > 0:
            #Fetch Data
            db_id = db_data[0]
            db_email = db_data[4]
            db_password = db_data[5]
            print(db_id)
            print(db_email)
            
            subject = 'Forgot Password'
            message = ' Your Password is  ' + db_password
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [db_email,]
            send_mail( subject, message, email_from, recipient_list )
            messages.success(request, 'Password Sent on Email ID')
            return redirect(login)
            #Cookie Code
        else:
            messages.error(request, 'Wrong Email Details')
            return render(request, 'Userside/forgot.html') 
    messages.error(request, 'Wrong Email Details')
    return render(request, 'Userside/forgot.html')


def workout(request):
    if 'user_id' in request.COOKIES and request.session.has_key('user_id'):
        u=request.session['user_id']
        cur.execute("SELECT * FROM `workout_master` WHERE `User_Id` = {}".format(u))
        data = cur.fetchall()
        #return list(data)
        #print(list(data))
        return render(request,'Userside/workout.html',{'mydata': data})
    else:
        return redirect(login)
def attendance(request):
    u = request.session['user_id']
    cur.execute("SELECT * FROM `attendance_master` WHERE `User_id`= {}".format(u))
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/attendance.html',{'mydata': data})

def membership(request):
    u = request.session['user_id']
    cur.execute("SELECT p.Title,p.Duration,m.Start_Date,m.End_Date,m.Membership_Status FROM `membership_master` m,`plan_master` p WHERE ( m.Plan_Id = p.Plan_Id) and `User_id`= {}".format(u))
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/membership.html',{'mydata': data})

def myaccount(request):
    u = request.session['user_id']
    cur.execute("SELECT * FROM `user_master` WHERE `User_id`= {}".format(u))
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/myaccount.html',{'mydata': data})

def chngpassword(request):
    return render(request,'Userside/chngpassword.html')

def changepasswordprocess(request):
    if 'user_email' in request.COOKIES and request.session.has_key('user_email'):
        print(request.POST)
        user_id = request.session['user_id']
        opass = request.POST['old']
        npass = request.POST['new']
        cpass = request.POST['cnfrm']
        cur.execute("select * from `user_master` where `User_Id`= {}".format(user_id))
        db_data = cur.fetchone()

        if db_data is not None:

            if len(db_data) > 0:
                #Fetch Data
                oldpassword = db_data[5]
                if opass == oldpassword:
                    cur.execute("update  `user_master` set `Password` = '{}' where `User_Id` = '{}'".format(npass,user_id))
                    conn.commit()
                    messages.success(request, 'Password Changed Successfully')
                    return render(request, 'Userside/chngpassword.html')
                else:
                    messages.error(request, 'Wrong Old Password ')
                    return render(request, 'Userside/chngpassword.html')
            else:
                redirect(login) 
        else: 
            redirect(login) 
    else:
        return redirect(login)

def updateacc(request):
    return render(request,'Userside/updateacc.html')

def payment(request,id):
    cur.execute("SELECT p.Title,u.User_Name,u.Email,u.Mobile FROM `membership_master` m,`plan_master` p,`user_master` u WHERE m.Plan_Id=p.Plan_Id and m.User_Id=u.User_Id and m.Membership_Id='{}'".format(id))
    data=cur.fetchone()
    print(data)
    return render(request,'Userside/Payment.html',{'mydata': data,'mid': id})

def paymentprocess(request,id):
    cur.execute("SELECT * FROM `membership_master` WHERE `Membership_Id`={}".format(id))
    data=cur.fetchone()
    if request.method == 'POST':
        print(request.POST)
        mid = id
        mt = request.POST['payment']
        tno = request.POST['Transaction']
        rec = request.FILES['receipt'].name
        amt = data[5]
        try:
            recp = request.FILES['receipt']
            f = open("/static/upload/"+rec, 'wb')
            for i in recp:
                f.write(i)
            f.close()
        except:
            pass
        cur.execute("INSERT INTO `payment_master`(`Membership_Id`,`Amount`,`Method`,`Transaction_no`,`Payment_Receipt`,`Payment_Status`) VALUES ('{}','{}','{}','{}','{}','Not Approved')".format(mid,amt,mt,tno,rec))
        conn.commit()
        messages.success(request,'Thanks For Registering!')
        return redirect(login) 
    else:
        return redirect(payment)   
    

def trainer(request):
    return render(request,'Userside/trainer.html')

def workout_edit(request):
    return render(request,'Userside/workout_edit.html')

def checkout(request):
    return render(request,'Userside/checkout.html')

def feedback(request):
    cur.execute("SELECT * FROM `feedback_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/feedback.html',{'mydata': data})


def feedbackadd(request):
    return render(request,'Userside/feedbackadd.html')

def feedbackaddprocess(request):
    cur.execute("SELECT * FROM `feedback_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return redirect(feedback)

def placeorderprocess(request):
    if 'user_id' in request.COOKIES and request.session.has_key('user_id'):
        print(id)
        import datetime
        order_date = datetime.datetime.now().strftime ("%d-%m-%Y")
        order_status = "Pending"
        user_id = 1
        #OrderDetails
        cur.execute("INSERT INTO `tbl_order_master`(`order_date`,`order_status`,`user_id`) VALUES ('{}','{}','{}')".format(order_date,order_status,user_id))
        order_id = cur.lastrowid  
        conn.commit()
        cur.execute("SELECT * FROM `tbl_cart`")
        db_data = cur.fetchall()
        for row in db_data:
            print("For Ma aayo")
            cart_id = row[0]
            product_id = row[2]
            product_qty = row[3]
            product_price = row[4]
            cur.execute("INSERT INTO `tbl_order_details`(`order_id`,`product_id`,`product_qty`,`product_price`) VALUES ('{}','{}','{}','{}')".format(order_id,product_id,product_qty,product_price))
            conn.commit()
            cur.execute("delete from `tbl_cart` where `cart_id` = {}".format(cart_id))
            conn.commit()
          
        #return list(data)
        print(list(db_data))
        messages.success(request, 'Record Added!!')
        return redirect(thanks)
    else:
        return redirect(login)


def thanks(request):
    return  render(request,'Userside/thanks.html')


def vieworder(request):
    u=request.session['user_id']
    cur.execute("SELECT * FROM `order_master` WHERE `User_Id` = {}".format(u))
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/vieworder.html',{'mydata': data})

def orderdetail(request):
    cur.execute("SELECT p.Product_Name,p.Product_Image,p.Details,o.Qty,o.Price,o.Tot_Amt FROM `order_details` o, `Product_Master` p WHERE (o.Product_Id=p.Product_Id) and `Order_Id` = 1115")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/OrderDetails.html',{'mydata': data})

def viewfeedback(request):
    cur.execute("SELECT * FROM `feedback_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Userside/viewfeedback.html',{'mydata': data})

def login_view(request):
    if requests.method == 'POST':
        email = requests.post.get('useremail')
        pass
    
def payment_success(request):
    return render(request, 'success.html')

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    # Add other fields as needed

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email