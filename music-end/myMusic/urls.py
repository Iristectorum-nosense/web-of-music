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
    path('user/setLikeSong', views.set_like_song),
    path('user/likeSong', views.get_like_song),
    path('user/deleteLikeSong', views.delete_like_song),
    path('user/setLikeAlbum', views.set_like_album),
    path('user/likeAlbum', views.get_like_album),
    path('user/deleteLikeAlbum', views.delete_like_album),
    path('user/setLikeMV', views.set_like_mv),
    path('user/likeMV', views.get_like_mv),
    path('user/deleteLikeMV', views.delete_like_mv),
    path('user/play', views.get_my_play),
    path('user/createPlay', views.create_my_play),
    path('user/myPlayInfo', views.get_my_play_info),
    path('user/editPlay', views.edit_my_play),
    path('user/playList', views.get_my_play_list),
    path('user/setPlaySong', views.set_play_song),
    path('user/deletePlaySong', views.delete_play_song),
    path('user/deletePlay', views.delete_my_play),

    path('user/insert', views.insert),
]
