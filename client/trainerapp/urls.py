from django.urls import path
from trainerapp import views

urlpatterns = [
    

    path('',views.index1,name='index1.html'),

    path('index1.html',views.index1,name='index1.html'),

    path('login.html',views.login,name='login.html'),

    path('logout',views.logout,name="logout"),

    path('Chngpass.html',views.Chngpass,name='Chngass.html'),

    path('changepasswordprocess',views.changepasswordprocess,name='changepasswordprocess'),

    path('forms.html',views.forms,name='forms.html'),

    path('tables.html',views.tables,name='tables.html'),

    
    
    path('ViewUser.html',views.ViewUser,name='ViewUser.html'),

    
 
    path('AddWorkout.html',views.AddWorkout,name='AddWorkout.html'),

    path('ViewWorkout.html',views.ViewWorkout,name='ViewWorkout.html'),

    path('Workoutaddprocess',views.Workoutaddprocess,name='Workoutaddprocess.html'),

    path('Workout/delete/<int:id>', views.Workoutdelete, name="Workoutdelete"),


    
    path('ViewAttendance.html',views.ViewAttendance,name='ViewAttendance.html'),

    path('MyAttendance.html',views.myattendance,name='MyAttendance.html'),

]