from django.urls import path
from myMusic import views

urlpatterns = [
    path('user/loginByPw', views.login_by_password),
    path('captcha', views.captcha),
    path('user/loginByCap', views.login_by_captcha),
    # path('user/loginJWT', views.check_jwt),
    path('user/register', views.register),
]
