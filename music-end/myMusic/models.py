from datetime import timedelta
from django.db import models


# Create your models here.
# mvTag table
class MVTag(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'mvTag'


# mv table
class MV(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    url = models.CharField(default='', max_length=64)
    name = models.CharField(max_length=64)
    desc = models.CharField(max_length=512)
    publish = models.DateTimeField()
    play_count = models.IntegerField(default=0)
    tags = models.ManyToManyField(MVTag)

    class Meta:
        db_table = 'mv'


# song table
class Song(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    url = models.CharField(default='', max_length=64)
    name = models.CharField(max_length=64)
    publish = models.DateTimeField()
    time = models.DurationField(default=timedelta(seconds=0))
    play_count = models.IntegerField(default=0)
    mv = models.ForeignKey('MV', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'song'


# album table
class Album(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    url = models.CharField(default='', max_length=64)
    name = models.CharField(default='', max_length=64)
    publish = models.DateTimeField()
    songs = models.ManyToManyField(Song)

    class Meta:
        db_table = 'album'


# singerTag table
class SingerTag(models.Model):
    object = models.Manager()
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'singerTag'


# singer table
class Singer(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    url = models.CharField(default='', max_length=64)
    name = models.CharField(default='', max_length=64)
    desc = models.CharField(max_length=128)
    tags = models.ManyToManyField(SingerTag)
    mvs = models.ManyToManyField(MV)
    songs = models.ManyToManyField(Song)
    albums = models.ManyToManyField(Album)

    class Meta:
        db_table = 'singer'


# user play table
class UserPlay(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    name = models.CharField(default='', max_length=64)
    publish = models.DateTimeField()
    songs = models.ManyToManyField(Song)

    class Meta:
        db_table = 'userPlay'


# user table
class User(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=32)
    portrait = models.CharField(default='', max_length=64)
    nickname = models.CharField(max_length=32)
    gender = models.IntegerField(default=0)
    password = models.CharField(max_length=64)
    song_num = models.IntegerField(default=0)
    album_num = models.IntegerField(default=0)
    mv_num = models.IntegerField(default=0)
    songs = models.ManyToManyField(Song)
    albums = models.ManyToManyField(Album)
    plays = models.ManyToManyField(UserPlay)
    mvs = models.ManyToManyField(MV)

    class Meta:
        db_table = 'user'


# captcha table
class Captcha(models.Model):
    objects = models.Manager()
    email = models.CharField(max_length=32, primary_key=True)
    loginCaptcha = models.IntegerField(default=0)
    loginTime = models.IntegerField(default=0)
    registerCaptcha = models.IntegerField(default=0)
    registerTime = models.IntegerField(default=0)
    resetCaptcha = models.IntegerField(default=0)
    resetTime = models.IntegerField(default=0)

    class Meta:
        db_table = 'captcha'


