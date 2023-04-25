from django.urls import path
from myMusic import views

urlpatterns = [
    path('user/loginByPw', views.login_by_password),
    path('captcha', views.captcha),
    path('user/loginByCap', views.login_by_captcha),
    path('user/register', views.register),
    path('user/resetPw', views.reset_password),
    path('user/resetInfos', views.reset_user_info),
    path('user/resetPortrait', views.reset_portrait),
    path('singerList', views.get_singer_list),
    path('user/insert', views.insert),
]
