from django.urls import path
from adminapp import views

urlpatterns = [




    path('',views.index,name='index.html'),

    path('login.html',views.login,name='login.html'),

    path('logout',views.logout,name="logout"),

    path('myaccount',views.myaccount,name="myaccount"),

    path('forgotpass.html',views.forgotpass,name='forgotpass.html'),

    path('forgotpasswordprocess',views.forgotpasswordprocess,name='forgotpasswordprocess'),

    path('Chngpass.html',views.Chngpass,name='Chngass.html'),

    path('changepasswordprocess',views.changepasswordprocess,name='changepasswordprocess'),

    path('index.html',views.index,name='index.html'),

    path('forms.html',views.forms,name='forms.html'),

    path('validation.html',views.validation,name='validation.html'),

    path('tables.html',views.tables,name='tables.html'),

    
    path('AddUtype.html',views.AddUtype,name='AddUtype.html'),

    path('ViewUtype.html',views.ViewUtype,name='ViewUtype.html'),

    path('Usertypeaddprocess',views.Usertypeaddprocess,name='Usertypeaddprocess.html'),

    path('Utype/delete/<int:id>', views.Utypedelete, name="Utypedelete"),


    path('AddUser.html',views.AddUser,name='AddUser.html'),
    
    path('ViewUser.html',views.ViewUser,name='ViewUser.html'),

    path('Useraddprocess',views.Useraddprocess,name='Useraddprocess.html'),

    path('User/delete/<int:id>', views.Userdelete, name="Userdelete"),




    path('AddTrainerDetail.html',views.AddTrainerDetail,name='AddTrainerDetail.html'),

    path('ViewTrainerDetail.html',views.ViewTrainerDetail,name='ViewTrainerDetail.html'),
    
    path('Trainerdetailsaddprocess',views.Trainerdetailsaddprocess,name='Trainerdetailsaddprocess.html'),

    path('TrainerDetail/delete/<int:id>', views.TrainerDetaildelete, name="TrainerDetaildelete"),




    path('AddProduct.html',views.AddProduct,name='AddProduct.html'),

    path('ViewProduct.html',views.ViewProduct,name='ViewProduct.html'),

    path('Productaddprocess',views.Productaddprocess,name='Productaddprocess.html'),

    path('Product/delete/<int:id>', views.Productdelete, name="Productdelete"),


 
 
    path('AddWorkout.html',views.AddWorkout,name='AddWorkout.html'),

    path('ViewWorkout.html',views.ViewWorkout,name='ViewWorkout.html'),

    path('Workoutaddprocess',views.Workoutaddprocess,name='Workoutaddprocess.html'),

    path('Workout/delete/<int:id>', views.Workoutdelete, name="Workoutdelete"),




       
    path('Addplan.html',views.Addplan,name='Addplan.html'),

    path('ViewPlan.html',views.ViewPlan,name='ViewPlan.html'),

    path('add-plan-process',views.AddPlanprocess,name='AddPlan.html'),

    path('Plan/edit/<int:id>', views.PlanEdit, name="PlanEdit"),

    path('Plan/delete/<int:id>', views.Plandelete, name="Plandelete"),



    
    path('AddMembership.html',views.AddMembership,name='AddMembership.html'),

    path('ViewMembership.html',views.ViewMembership,name='ViewMembership.html'),

    path('add-membership-process',views.AddMembershipprocess,name='AddMembership.html'),

    path('MembershipEdit/edit/<int:id>', views.MembershipEdit, name="MembershipEdit"),

    path('MembershipEditProcess/edit/<int:id>', views.MembershipEditProcess, name="MembershipEditProcess"),

    path('Membership/delete/<int:id>', views.Membershipdelete, name="Membershipdelete"),




    path('AddAttendance.html',views.AddAttendance,name='AddAttendance.html'),
    
    path('ViewAttendance.html',views.ViewAttendance,name='ViewAttendance.html'),

    path('add-attendance-process',views.AddAttendanceprocess,name='AddAttendance.html'),

    path('Attendance/edit/<int:id>', views.AttendanceEdit, name="AttendanceEdit"),

    path('Attendance/delete/<int:id>', views.Attendancedelete, name="Attendancedelete"),


 
 
    path('AddPayment.html',views.AddPayment,name='AddPayment.html'),
   
    path('ViewPayment.html',views.ViewPayment,name='ViewPayment.html'),

    path('add-payment-process',views.AddPaymentprocess,name='AddPayment.html'),

    path('Payment/delete/<int:id>', views.Paymentdelete, name="Paymentdelete"),
    



    path('AddOrder.html',views.AddOrder,name='AddOrder.html'),
    
    path('ViewOrder.html',views.ViewOrder,name='ViewOrder.html'),

    path('ViewOrderdetails.html/<int:id>',views.ViewOrderdetails,name='ViewOrderdetails.html'),

    path('OrderEdit/edit/<int:id>', views.OrderEdit, name="OrderEdit"),

    path('OrderEditProcess/edit/<int:id>', views.OrderEditProcess, name="OrderEditProcess"),

    path('ViewFeedback.html',views.ViewFeedback,name='ViewFeedback.html'),

]