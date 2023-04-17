from django.urls import path
from myMusic import views

urlpatterns = [
    path('user/loginByPw', views.login_by_password),
    path('user/loginJWT', views.check_jwt),
    path('user/register', views.register),
]
