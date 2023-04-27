from django.db import models


# Create your models here.
# user table
class User(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=32)
    portrait = models.CharField(default='', max_length=64)
    score = models.IntegerField(default=0)
    nickname = models.CharField(max_length=32)
    gender = models.IntegerField(default=0)
    password = models.CharField(max_length=64)
    song_num = models.IntegerField(default=0)
    mv_num = models.IntegerField(default=0)

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
    star_count = models.IntegerField(default=0)
    tags = models.ManyToManyField(MVTag)

    class Meta:
        db_table = 'mv'


# # album table
# class Album(models.Model):
#     object = models.Manager()
#     id = models.AutoField(primary_key=True)
#     url = models.CharField(default='', max_length=64)
#     name = models.CharField(default='', max_length=64)



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
    # albums = models.ManyToManyField(Album)

    class Meta:
        db_table = 'singer'




