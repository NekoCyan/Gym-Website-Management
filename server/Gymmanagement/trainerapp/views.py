from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.conf.urls.static import static
from django.core.mail import send_mail
from django.conf import settings
# Create your views here.

import mysql.connector as mcdb
conn = mcdb.connect(host="localhost", user="root", passwd="", database='myproject1')
print('Successfully connected to database')
cur = conn.cursor()

def index1(request):
    if 'user_email' in request.COOKIES and request.session.has_key('user_email'):
        print(request.POST)
        user_id = request.session['user_id']
        cur.execute("select * from `user_master` where `User_Id`= '{}'".format(user_id))
        db_data = cur.fetchall()
        return render(request,'trainer/index1.html',{'mydata': db_data})
    else:
        redirect(login)

def forms(request):
    return render(request,'trainer/forms.html')


def Chngpass(request):
    return render(request,'trainer/Chngpass.html')    

def changepasswordprocess(request):
    if 'user_email' in request.COOKIES and request.session.has_key('user_email'):
        print(request.POST)
        user_id = request.session['user_id']
        opass = request.POST['oldpassword']
        npass = request.POST['newpassword']
        cpass = request.POST['cnfrmpassword']
        cur.execute("select * from `user_master` where `User_Id`= {}".format(user_id))
        db_data = cur.fetchone()

        if db_data is not None:

            if len(db_data) > 0:
                #Fetch Data
                oldpassword = db_data[5]
                if opass == oldpassword:
                    cur.execute("update  `user_master` set `Password` = '{}' where `User_Id` = '{}'".format(npass,user_id))
                    conn.commit()
                    messages.success(request, 'Password Changed')
                    return render(request, 'trainer/Chngpass.html')
                else:
                    messages.success(request, 'Wrong Old Password ')
                    return render(request, 'trainer/Chngpass.html')
            else:
                redirect(login) 
        else: 
            redirect(login) 
    else:
        return redirect(login)


def validation(request):
    return render(request,'trainer/validation.html')

def tables(request):
    return render(request,'trainer/tables.html')

def login(request):
    return render(request,'Userside/login.html')

def logout(request):
    del request.session['user_id']
    del request.session['user_email']
    response = redirect(login)
    response.delete_cookie('user_id')
    response.delete_cookie('user_email')
    return response

def ViewUser(request):
    cur.execute("SELECT * FROM `user_master`")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'trainer/ViewUser.html', {'mydata': data}) 

def ViewAttendance(request):
    cur.execute("SELECT a.User_Id,um.User_Name,a.A_Date,a.Time_in,a.Time_out FROM `attendance_master` a ,`user_master` um,`user_type` ut WHERE (a.User_Id=um.User_Id and um.Type_Id=ut.Type_Id and um.Type_Id=1) ORDER BY a.Attendance_Id")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request, 'trainer/ViewAttendance.html', {'mydata': data}) 

def myattendance(request):
    u = request.session['user_id']
    cur.execute("SELECT * FROM `attendance_master` WHERE `User_id`= {}".format(u))
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'trainer/MyAttendance.html',{'mydata': data})

def AddWorkout(request):
    cur.execute("SELECT * FROM `user_master` WHERE `Type_Id` = 1 ")
    data = cur.fetchall()
    #return list(data)
    print(list(data))
    return render(request,'trainer/Add_Workout.html',{'mydata': data}) 

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
    return render(request,'trainer/View_Workout.html', {'mydata': data})    

def Workoutdelete(request,id):
     
    #id = request.GET['id']
    #id = User.objects.get(id=id)
    print(id)
    cur.execute("delete from `workout_master` where `Workout_Id` = {}".format(id))
    conn.commit()
    return redirect(ViewWorkout)

