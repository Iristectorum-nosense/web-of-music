from django.db import models


# Create your models here.
# user table
class User(models.Model):
    objects = models.Manager()
    id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=32)
    portrait = models.FileField(default=None, upload_to='static/users', verbose_name='选择用户头像')
    score = models.IntegerField(default=0)
    nickname = models.CharField(max_length=32)
    gender = models.IntegerField(default=0)
    password = models.CharField(max_length=32)
    song_num = models.IntegerField(default=0)
    mv_num = models.IntegerField(default=0)

    class Meta:
        db_table = 'user'


# captcha table
# class Captcha(models.Model):
#     objects = models.Manager()
#     email = models.CharField(max_length=32, primary_key=True)
#     captcha = models.IntegerField(default=None)
#     time = models.DateTimeField()
#
#     class Meta:
#         db_table = 'captcha'







