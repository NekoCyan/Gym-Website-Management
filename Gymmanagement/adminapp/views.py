from django.shortcuts import render,redirect
from django.contrib import messages
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage
from django.conf.urls.static import static
from django.core.mail import send_mail
from django.conf import settings
# Create your views here.
# Create your views here.
import mysql.connector as mcdb
conn = mcdb.connect(host="localhost", user="root", passwd="", database='myproject1')
print('Successfully connected to database')
cur = conn.cursor()

def index(request):
    if 'admin_email' in request.COOKIES and request.session.has_key('admin_email'):
        
        admin_emails = request.session['admin_email']
        admin_emailc = request.COOKIES['admin_email']

        print("Session is  " + str(admin_emails))
        print("Cookie is  " + admin_emailc)

        return render(request,'Admin/index.html')
    else:
        return redirect(login)

def forms(request):
    return render(request,'Admin/forms.html')

def validation(request):
    return render(request,'Admin/validation.html')

def tables(request):
    return render(request,'Admin/tables.html')

def myaccount(request):
    if 'admin_email' in request.COOKIES and request.session.has_key('admin_email'):
        print(request.POST)
        admin_id = request.session['admin_id']
        cur.execute("select * from `user_master` where `User_Id`= '{}' and `Type_Id`=3 ".format(admin_id))
        db_data = cur.fetchall()
        return render(request,'Admin/myaccount.html',{'mydata': db_data})
    else:
        return redirect(login)

def login(request):
    if request.method == 'POST':
        print(request.POST)
        admin_email = request.POST['email']
        admin_pass = request.POST['password']
        cur.execute("select * from `user_master` where `Email` = '{}' and `Password` = '{}' and `Type_Id` = 3".format(admin_email,admin_pass))
        data = cur.fetchone()
        
        if data is not None:

            if len(data) > 0:
                #Fetch Data
                admin_db_id = data[0]
                admin_db_email = data[2]
                print(admin_db_id)
                print(admin_db_email)
                #Session Create Code
                request.session['admin_id'] = admin_db_id
                request.session['admin_email'] = admin_db_email
                #Session Create Code
                #Cookie Code
                response = redirect(index)
                response.set_cookie('admin_id', admin_db_id)
                response.set_cookie('admin_email', admin_db_email)
                return response
                #Cookie Code
            else:
                messages.error(request,"Invalid Login!")
                return render(request, 'Admin/login.html')         
        messages.error(request,"Invalid Login Details!")
        return render(request, 'Admin/login.html')
        
       # return redirect(dashboard) 
    else:
        return render(request, 'Admin/login.html') 

def logout(request):
    del request.session['admin_id']
    del request.session['admin_email']
    response = redirect(login)
    response.delete_cookie('admin_id')
    response.delete_cookie('admin_email')
    return response

def forgotpass(request):
    return render(request,'Admin/forgotpass.html')

def forgotpasswordprocess(request):
    print(request.POST)
    admin_email = request.POST['email']
    cur.execute("select * from `user_master` where `Email` = '{}' and Type_Id=3 ".format(admin_email))
    db_data = cur.fetchone()
        
    if db_data is not None:
        if len(db_data) > 0:
            #Fetch Data
            admin_db_id = db_data[0]
            admin_db_email = db_data[4]
            admin_db_password = db_data[5]
            print(admin_db_id)
            print(admin_db_email)
            
            subject = 'Forgot Password'
            message = ' Your Password is  ' + admin_db_password
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [admin_db_email,]
            send_mail( subject, message, email_from, recipient_list )
            messages.success(request, 'Password Sent on Email ID')
            return redirect(login)
            #Cookie Code
        else:
            messages.error(request, 'Wrong Email Details')
            return render(request, 'Admin/forgotpass.html') 
    messages.error(request, 'Wrong Email Details')
    return render(request, 'Admin/forgotpass.html')



def Chngpass(request):
    return render(request,'Admin/Chngpass.html')

def changepasswordprocess(request):
    if 'admin_email' in request.COOKIES and request.session.has_key('admin_email'):
        print(request.POST)
        admin_id = request.session['admin_id']
        opass = request.POST['oldpassword']
        npass = request.POST['newpassword']
        cpass = request.POST['cnfrmpassword']
        cur.execute("select * from `user_master` where `User_Id`= {} and `Type_Id`=3".format(admin_id))
        db_data = cur.fetchone()

        if db_data is not None:

            if len(db_data) > 0:
                #Fetch Data
                oldpassword = db_data[5]
                if opass == oldpassword:
                    cur.execute("update  `user_master` set `Password` = '{}' where `User_Id` = '{}'".format(npass,admin_id))
                    conn.commit()
                    messages.success(request, 'Password Changed')
                    return render(request, 'Admin/Chngpass.html')
                else:
                    messages.success(request, 'Wrong Old Password ')
                    return render(request, 'Admin/Chngpass.html')
            else:
                redirect(login) 
        else: 
            redirect(login) 
    else:
        return redirect(login)



def AddUtype(request):
    return render(request,'Admin/AddUtype.html')

def Usertypeaddprocess(request):
    if request.method == 'POST':
        print(request.POST)
        utype = request.POST['Utype']
        cur.execute("INSERT INTO `user_type`(`User_Type`) VALUES ('{}')".format(utype))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddUtype) 
    else:
        return redirect(AddUtype)

def ViewUtype(request):
    cur.execute("SELECT * FROM `user_type`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/ViewUtype.html', {'mydata': data})

def Utypedelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `user_type` where `Type_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewUtype) 





def AddUser(request):
    cur.execute("SELECT * FROM `user_type`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/AddUser.html',{'mydata': data})

def Useraddprocess(request):
    if request.method == 'POST':
        print(request.POST)
        typeid = request.POST['type_id']
        name = request.POST['name']
        gender = request.POST['gender']
        email = request.POST['email']
        address = request.POST['address']
        mobile = request.POST['mobile']
        img = request.FILES['photo'].name
        id_proof = request.FILES['id_proof'].name
        password = request.POST['password']
        try:
            photo = request.FILES['photo']
            f = open("/static/upload/"+img, 'wb')
            for i in photo:
                f.write(i)
            f.close()
            idproof = request.FILES['id_proof']
            fi = open("/static/upload/"+id_proof, 'wb')
            for i in idproof:
                fi.write(i)
            fi.close()
        except:
            pass
        cur.execute("INSERT INTO `user_master`(`Type_Id`,`User_Name`,`Gender`,`Email`,`Password`,`Address`,`Mobile`,`Photo`,`ID_Proof`) VALUES ('{}','{}','{}','{}','{}','{}','{}','{}','{}')".format(typeid,name,gender,email,password,address,mobile,img,id_proof))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddUser) 
    else:
        return redirect(AddUser)

def ViewUser(request):
    cur.execute("SELECT user_master.User_Id,user_type.User_Type,user_master.User_Name,user_master.Gender,user_master.Email,user_master.Password,user_master.Address,user_master.Mobile,user_master.Photo,user_master.Id_Proof FROM `user_master`,`user_type` WHERE (user_master.Type_Id=user_type.Type_Id) ORDER BY user_master.User_Id")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/ViewUser.html', {'mydata': data})        

def Userdelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `user_master` where `User_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewUser) 





def AddTrainerDetail(request):
    cur.execute("SELECT * FROM `user_master` WHERE `Type_Id` = 2 ")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/AddTrainerDetail.html',{'mydata': data})

def Trainerdetailsaddprocess(request):
    if request.method == 'POST':
        print(request.POST)
        uid = request.POST['User_id']
        sal = request.POST['Salary']
        det = request.POST['details']
        cur.execute("INSERT INTO `trainer_details`(`User_Id`,`Salary`,`Details`) VALUES ('{}','{}','{}')".format(uid,sal,det))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddTrainerDetail) 
    else:
        return redirect(AddTrainerDetail)

def ViewTrainerDetail(request):
    cur.execute("SELECT t.Trainer_Id,t.User_Id,u.User_Name,t.Salary,t.Details FROM `trainer_details` t,`user_master` u WHERE (t.User_Id=u.User_Id) ORDER BY t.Trainer_Id")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/ViewTrainerDetail.html', {'mydata': data})      

def TrainerDetaildelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `trainer_details` where `Trainer_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewTrainerDetail)




def AddProduct(request):
    return render(request,'Admin/AddProduct.html')

def Productaddprocess(request):
    if request.method == 'POST':
        print(request.POST)
        pname = request.POST['product_name']
        qty = request.POST['Qty']
        det = request.POST['Details']
        price = request.POST['Price']
        img = request.FILES['photo'].name
        try:
            photo = request.FILES['photo']
            f = open("/static/upload/"+img, 'wb')
            for i in photo:
                f.write(i)
            f.close()
        except:
            pass
        cur.execute("INSERT INTO `product_master`(`Product_Name`,`Qty`,`Details`,`Price`,`Product_Image`) VALUES ('{}','{}','{}','{}','{}')".format(pname,qty,det,price,img))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddProduct) 
    else:
        return redirect(AddProduct)    

def ViewProduct(request):
    cur.execute("SELECT * FROM `product_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/ViewProduct.html', {'mydata': data})    

def Productdelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `product_master` where `Product_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewProduct)




def AddWorkout(request):
    cur.execute("SELECT * FROM `user_master` WHERE `Type_Id` = 1 ")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/AddWorkout.html',{'mydata': data}) 

def Workoutaddprocess(request):
    if request.method == 'POST':
        print(request.POST)
        uid = request.POST['User_id']
        diet = request.POST['Diet_Chart']
        schedule = request.POST['Workout_schedule']
        videos = request.POST['Workout_videos']
        rewards = request.POST['rewards']
        cur.execute("INSERT INTO `workout_master`(`User_Id`,`Diet_Chart`,`Workout_Schedule`,`Videos`,`Rewards`) VALUES ('{}','{}','{}','{}','{}')".format(uid,diet,schedule,videos,rewards))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddWorkout) 
    else:
        return redirect(AddWorkout)    

def ViewWorkout(request):
    cur.execute("SELECT w.Workout_ID,w.User_Id,u.User_Name,w.Diet_Chart,w.Workout_Schedule,w.Videos,w.Rewards FROM `workout_master` w,`user_master` u WHERE (w.User_Id=u.User_Id) ORDER BY w.Workout_Id")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/ViewWorkout.html', {'mydata': data})    

def Workoutdelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `workout_master` where `Workout_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewWorkout)






def AddPayment(request):
    cur.execute("SELECT m.Membership_Id,u.User_Name FROM `membership_master` m,`user_master` u where m.User_Id=u.User_Id")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/AddPayment.html',{'mydata': data})

def AddPaymentprocess(request):
    if request.method == 'POST':
        print(request.POST)
        MID = request.POST['Membership_id']
        Amt = request.POST['Amount']
        Method = request.POST['Method']
        Trano = request.POST['transaction_no']
        Paysts = request.POST['Payment_status']
        cur.execute("INSERT INTO `payment_master`(`Membership_Id`, `Amount`, `Method`, `Transaction_no`, `Payment_status`) VALUES ('{}','{}','{}','{}','{}')".format(MID,Amt,Method,Trano,Paysts))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddPayment) 
    else:
        return redirect(AddPayment)

def Paymentdelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `payment_master` where `Payment_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewPayment) 

def ViewPayment(request):
    cur.execute("SELECT * FROM `payment_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/ViewPayment.html', {'mydata': data})




def Addplan(request):
    return render(request,'Admin/Addplan.html')

def AddPlanprocess(request):
    if request.method == 'POST':
        print(request.POST)
        Title = request.POST['title']
        Details = request.POST['details']
        Pri = request.POST['Price']
        Dur = request.POST['Duration']
        cur.execute("INSERT INTO `plan_master`(`Title`,	`Details`, `Price`, `Duration`) VALUES ('{}','{}','{}','{}')".format(Title, Details, Pri, Dur ))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(Addplan) 
    else:
        return redirect(Addplan)    

def PlanEdit(request,id):
    cur.execute("SELECT * FROM `plan_master` WHERE `Plan_Id` = {}".format(id))
    data = cur.fetchone()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/EditPlan.html', {'Pdata': data})

def Plandelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `plan_master` where `Plan_Id` = {}".format(id))
    conn.commit()
    messages.success(request, 'Record Deleted Successfully')
    return redirect(ViewPlan) 

def ViewPlan(request):
    cur.execute("SELECT * FROM `plan_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/ViewPlan.html', {'mydata': data})





def AddMembership(request):
    cur.execute("SELECT * FROM `user_master` WHERE `Type_Id` = 1 ")
    data = cur.fetchall()
    cur.execute("SELECT * FROM `plan_master`")
    d = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/AddMembership.html',{'mydata': data,'plan': d})

def Membershipdelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `membership_master` where `Membership_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewMembership)

def AddMembershipprocess(request):
    if request.method == 'POST':
        print(request.POST)
        UId = request.POST['User_id']
        PID = request.POST['Plan_id']
        Start = request.POST['sdate']
        End = request.POST['edate']
        Amt = request.POST['Amount']
        Details = request.POST['details']
        Memsts = request.POST['Membership_status']
        cur.execute("INSERT INTO `membership_master`(`User_Id`,	`Plan_Id`,	`Start_Date`,	`End_Date`,	`Amount`,	`Details`,	`Membership_Status`) VALUES ('{}','{}','{}','{}','{}','{}','{}')".format(UId, PID, Start, End, Amt, Details, Memsts))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddMembership) 
    else:
        return redirect(AddMembership)

def ViewMembership(request):
    cur.execute("SELECT * FROM `membership_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/ViewMembership.html', {'mydata': data})

def MembershipEdit(request,id):
    cur.execute("SELECT * FROM `membership_master` WHERE `Membership_Id` = {}".format(id))
    data = cur.fetchone()
    cur.execute("SELECT * FROM `user_master` WHERE `Type_Id` = 1 ")
    udata = cur.fetchall()
    cur.execute("SELECT * FROM `plan_master`")
    pdata = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/EditMembership.html', {'Mdata': data,'U': udata,'P': pdata})

def MembershipEditProcess(request,id):
    if request.method == 'POST':
        print(request.POST)
        uid = request.POST['User_id']
        pid = request.POST['Plan_id']
        ed = request.POST['edate']
        sd = request.POST['sdate']
        det = request.POST['details']
        amt = request.POST['Amount']
        m_status = request.POST['Membership_status']
        cur.execute("update `membership_master` set `User_Id` ='{}' where `Membership_Id`='{}'".format(uid,id))
        cur.execute("update `membership_master` set `Plan_Id` ='{}' where `Membership_Id`='{}'".format(pid,id))
        cur.execute("update `membership_master` set `Start_Date` ='{}' where `Membership_Id`='{}'".format(sd,id))
        cur.execute("update `membership_master` set `End_Date` ='{}' where `Membership_Id`='{}'".format(ed,id))
        cur.execute("update `membership_master` set `Details` ='{}' where `Membership_Id`='{}'".format(det,id))
        cur.execute("update `membership_master` set `Amount` ='{}' where `Membership_Id`='{}'".format(amt,id))
        cur.execute("update `membership_master` set `Membership_Status` ='{}' where `Membership_Id`='{}'".format(m_status,id))
        conn.commit()
        messages.success(request, 'Record Updated Successfully')
        return redirect(ViewMembership) 
    else:
        return redirect(MembershipEdit)    



def AddAttendance(request):
    cur.execute("SELECT * FROM `user_master` WHERE `Type_Id` !=3 ")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/AddAttendance.html',{'mydata': data})

def AddAttendanceprocess(request):
    if request.method == 'POST':
        print(request.POST)
        UId = request.POST['User_id']
        Date = request.POST['date']
        In_Time = request.POST['timein']
        Out_Time = request.POST['timeout']
        cur.execute("INSERT INTO `attendance_master`(`User_Id`, `A_Date`, `Time_in`, `Time_out`) VALUES ('{}','{}','{}','{}')".format(UId, Date, In_Time, Out_Time))
        conn.commit()
        messages.success(request, 'Record Added Successfully')
        return redirect(AddAttendance) 
    else:
        return redirect(AddAttendance)

def AttendanceEdit(request,id):
    cur.execute("SELECT * FROM `attendance_master` WHERE `Attendance_Id` = {}".format(id))
    data = cur.fetchone()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/EditAttendance.html', {'Adata': data})

def Attendancedelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `attendance_master` where `Attendance_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewAttendance) 

def ViewAttendance(request):
    cur.execute("SELECT a.Attendance_Id,a.User_Id,um.User_Name,ut.User_Type,a.A_Date,a.Time_in,a.Time_out FROM `attendance_master` a ,`user_master` um,`user_type` ut WHERE (a.User_Id=um.User_Id and um.Type_Id=ut.Type_Id) ORDER BY a.Attendance_Id")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/ViewAttendance.html', {'mydata': data})



def AddOrder(request):
    return render(request,'Admin/AddOrder.html') 



def ViewOrder(request):
    cur.execute("SELECT * FROM `order_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/ViewOrder.html', {'mydata': data})

def OrderEdit(request,id):
    cur.execute("SELECT * FROM `order_master` WHERE `Order_Id` = {}".format(id))
    data = cur.fetchone()
    #return list(data)
    print(list(data))
    return render(request, 'Admin/EditOrder.html', {'Odata': data})

def OrderEditProcess(request,id):
    if request.method == 'POST':
        print(request.POST)
        deldate = request.POST['ddate']
        delstatus = request.POST['Delivery_Status']
        cur.execute("update `order_master` set `Delivery_Date` ='{}' where `Order_Id`='{}'".format(deldate,id))
        cur.execute("update `order_master` set `Delivery_Status` ='{}' where `Order_Id`='{}'".format(delstatus,id))
        conn.commit()
        messages.success(request, 'Record Updated Successfully')
        return redirect(ViewOrder) 
    else:
        return redirect(OrderEdit)    

def ViewOrderdetails(request,id):
    cur.execute("SELECT o.Details_Id,p.Product_Name,p.Product_Image,o.Qty,o.Price,o.Tot_Amt FROM `order_details` o, `Product_Master` p WHERE (o.Product_Id=p.Product_Id) and `Order_Id` = {}".format(id))
    data = cur.fetchall()
    s=0
    c=0
    for i in data:
        for j in i:
            c=c+1
            if c==6 or c%6==0:
                s=s+int(j)
    sc=0
    t=s
    if s<500:
        sc=50
        t=t+sc
    #return list(data)
    print(list(data))
    return render(request,'Admin/ViewOrderdetails.html', {'mydata': data,'sub':s,'shc':sc,'total':t})    


def ViewFeedback(request):
    cur.execute("SELECT * FROM `feedback_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'Admin/ViewFeedback.html', {'mydata': data})
