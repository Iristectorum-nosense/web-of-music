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
    path('mvList', views.get_mv_list),
    path('rankList', views.get_rank_list),
    path('singerInfo', views.get_singer_info),
    path('singerDefault', views.get_singer_default),
    path('singerSong', views.get_singer_song),
    path('singerAlbum', views.get_singer_album),
    path('singerMV', views.get_singer_mv),
    path('albumInfo', views.get_album_info),
    path('songInfo', views.get_song_info),
    path('home', views.get_home),
    path('searchBar', views.get_search_bar),
    path('search', views.get_search),

    path('user/insert', views.insert),
]
