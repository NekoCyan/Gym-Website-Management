from django.urls import path
from . import views

urlpatterns = [

    path('',views.home,name='about.html'),

    path('home.html',views.home,name='home.html'),

    path('contact.html',views.contact,name='contact.html'),

    path('about.html',views.about,name='about.html'),

    path('faq.html',views.faq,name='faq.html'),

    path('not-found.html',views.not_found,name='not-found.html'),

    path('portfolio.html',views.portfolio,name='portfolio.html'),

    path('portfolio-detail.html',views.portfolio_detail,name='portfolio-detail.html'),

    path('price.html',views.price,name='price.html'),

    path('account.html',views.account,name='account.html'),

    path('blog.html',views.blog,name='blog.html'),

    path('blog-single.html',views.blog_single,name='blog-single.html'),

    path('checkout.html',views.checkout,name='checkout.html'),

    path('classes-detail.html',views.classes_detail,name='classes-detail.html'),

    path('classes.html',views.classes,name='classes.html'),

    #path('shop-single.html',views.shop_single,name='shop-single.html'),

    path('shop.html',views.shop,name='shop.html'),
    path('productdetails/<int:id>', views.shop_single,name='productdetails'),
    path('add-to-cart/<int:id>', views.addtocartprocess,name='addtocartprocess'),
    path('shopping-cart.html',views.shopping_cart,name='shopping-cart.html'),
    path('cart-remove/<int:id>', views.cartdelete,name='productdetails'),
    path('placeorder', views.placeorderprocess,name='placeorderprocess'),
    path('thanks', views.thanks,name='thanks'),
    path('vieworder',views.vieworder,name='vieworder'),
    path('orderdetails',views.orderdetail,name='orderdetails'),
    path('viewfeedback',views.viewfeedback,name='viewfeedback'),
    path('feedback.html',views.feedback,name='feedback'),
    path('feedback-add.html',views.shop,name='shop.html'),
    path('team.html',views.team,name='team'),
    
    path('testimonial.html',views.testimonial,name='testimonial.html'),

    path('testimonialprocess',views.testimonialadd,name='testimonialprocess'),

    path('register.html',views.register,name='register.html'),

    path('registerprocess',views.registerprocess,name='registerprocess'),

    path('login.html',views.login,name='login.html'),

    path('logout',views.logout,name="logout"),

    path('workout.html',views.workout,name='workout.html'),

    path('attendance.html',views.attendance,name='attendance.html'),

    path('membership.html',views.membership,name='membership.html'),

    path('forgot.html',views.forgot,name='forgot.html'),

    path('forgotpasswordprocess',views.forgotpasswordprocess,name='forgotpasswordprocess'),

    path('myaccount.html',views.myaccount,name='myaccount.html'),

    path('updateacc.html',views.updateacc,name='updateacc.html'),

    path('chngpassword.html',views.chngpassword,name='chngpassword.html'),

    path('changepasswordprocess',views.changepasswordprocess,name='changepasswordprocess'),

    path('payment/<int:id>',views.payment,name='payment'),
    
    path('paymentprocess/<int:id>',views.paymentprocess,name='paymentprocess'),

    path('trainer',views.trainer,name='trainer'),

    path('workout_edit',views.workout_edit,name='workout_edit'),

    
]