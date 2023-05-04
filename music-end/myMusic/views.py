import hashlib
import json
import os
import time
import jwt
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils import timezone
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from .models import *
from django.core.mail import send_mail
import datetime
import random

EXPIRES_TIME = 60 * 60
SECRET_KEY = 'myMusicEnd'


# utils
def createJWT(data):
    payload = {'info': data, 'exp': int(time.time()) + EXPIRES_TIME + 60}
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return str(token, encoding='utf8')


def verifyJWT(token, data):
    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    if data == payload.get('info'):
        return 1
    return 0


# Create your views here.
@ensure_csrf_cookie
def login_by_password(request):
    # 获取csrftoken
    if request.method == 'GET':
        get_token(request)
        return JsonResponse({'code': 200})

    # 请求登录
    if request.method == 'POST':
        json_body = json.loads(request.body)
        login_email = json_body.get('loginEmail', None)
        login_password = json_body.get('loginPassword', None)

        if login_email is None or login_password is None:
            return JsonResponse({'code': 400, 'message': 'Params error'})

        if not User.objects.filter(email=login_email).exists():
            return JsonResponse({'code': 405, 'message': '用户不存在'})

        userObj = User.objects.get(email=login_email)
        password = hashlib.sha256(login_password.encode('utf-8')).hexdigest()

        if password != userObj.password:
            return JsonResponse({'code': 405, 'message': '密码错误'})

        remember = json_body.get('remember', False)
        response = JsonResponse({'code': 200, 'loginInfos': {
            'userId': userObj.id, 'email': userObj.email,
            'portrait': userObj.portrait.name, 'nickname': userObj.nickname,
            'gender': userObj.gender
        }})
        if remember:
            data = str(userObj.id) + login_email
            jwtToken = createJWT(data)
            response.set_cookie('jwtToken', jwtToken, expires=EXPIRES_TIME)
            return response
        else:
            data = str(userObj.id) + login_email
            jwtToken = createJWT(data)
            response.set_cookie('jwtToken', jwtToken)
            return response
    return JsonResponse({'code': 503, 'message': 'No method'})


def captcha(request):
    if request.method == 'GET':
        # 发送登录验证码
        login_email = request.GET.get('loginEmail', None)
        if login_email is not None:
            sendedCap = random.randint(100000, 999999)
            subject = '享听音乐验证码'
            message = '您的登录验证码为：' + str(sendedCap) + ',5分钟内有效'
            from_email = '享听音乐在线平台 <mytest1218@163.com>'

            if Captcha.objects.filter(email=login_email).exists():
                recipient_list = [login_email]
                success = send_mail(subject, message, from_email, recipient_list)
                if success == 1:
                    # 更改验证码和时间到数据库
                    captchaObj = Captcha.objects.get(email=login_email)
                    captchaObj.loginCaptcha = sendedCap
                    captchaObj.loginTime = int(time.time())
                    captchaObj.save()
                    return JsonResponse({'code': 200, 'message': '验证码发送成功'})
                else:
                    return JsonResponse({'code': 503, 'message': 'Captcha send failed'})
            else:
                recipient_list = [login_email]
                success = send_mail(subject, message, from_email, recipient_list)
                if success == 1:
                    # 创建验证码和时间到数据库
                    captchaObj = Captcha(email=login_email, loginCaptcha=sendedCap, loginTime=int(time.time()))
                    captchaObj.save()
                    return JsonResponse({'code': 200, 'message': '验证码发送成功'})
                else:
                    return JsonResponse({'code': 503, 'message': 'Captcha send failed'})

        # 发送注册验证码
        register_email = request.GET.get('registerEmail', None)
        if register_email is not None:
            sendedCap = random.randint(100000, 999999)
            subject = '享听音乐验证码'
            message = '您的注册验证码为：' + str(sendedCap) + ',5分钟内有效'
            from_email = '享听音乐在线平台 <mytest1218@163.com>'

            if Captcha.objects.filter(email=register_email).exists():
                recipient_list = [register_email]
                success = send_mail(subject, message, from_email, recipient_list)
                if success == 1:
                    # 更改验证码和时间到数据库
                    captchaObj = Captcha.objects.get(email=register_email)
                    captchaObj.registerCaptcha = sendedCap
                    captchaObj.registerTime = int(time.time())
                    captchaObj.save()
                    return JsonResponse({'code': 200, 'message': '验证码发送成功'})
                else:
                    return JsonResponse({'code': 503, 'message': 'Captcha send failed'})
            else:
                recipient_list = [register_email]
                success = send_mail(subject, message, from_email, recipient_list)
                if success == 1:
                    # 创建验证码和时间到数据库
                    captchaObj = Captcha(email=register_email, registerCaptcha=sendedCap, registerTime=int(time.time()))
                    captchaObj.save()
                    return JsonResponse({'code': 200, 'message': '验证码发送成功'})
                else:
                    return JsonResponse({'code': 503, 'message': 'Captcha send failed'})

        # 发送修改密码验证码
        reset_email = request.GET.get('resetEmail', None)
        if reset_email is not None:
            sendedCap = random.randint(100000, 999999)
            subject = '享听音乐验证码'
            message = '您的重置验证码为：' + str(sendedCap) + ',5分钟内有效'
            from_email = '享听音乐在线平台 <mytest1218@163.com>'

            if Captcha.objects.filter(email=reset_email).exists():
                recipient_list = [reset_email]
                success = send_mail(subject, message, from_email, recipient_list)
                if success == 1:
                    # 更改验证码和时间到数据库
                    captchaObj = Captcha.objects.get(email=reset_email)
                    captchaObj.resetCaptcha = sendedCap
                    captchaObj.resetTime = int(time.time())
                    captchaObj.save()
                    return JsonResponse({'code': 200, 'message': '验证码发送成功'})
                else:
                    return JsonResponse({'code': 503, 'message': 'Captcha send failed'})
            else:
                recipient_list = [reset_email]
                success = send_mail(subject, message, from_email, recipient_list)
                if success == 1:
                    # 创建验证码和时间到数据库
                    captchaObj = Captcha(email=reset_email, resetCaptcha=sendedCap, resetTime=int(time.time()))
                    captchaObj.save()
                    return JsonResponse({'code': 200, 'message': '验证码发送成功'})
                else:
                    return JsonResponse({'code': 503, 'message': 'Captcha send failed'})

        return JsonResponse({'code': 400, 'message': 'Params error'})
    return JsonResponse({'code': 503, 'message': 'No method'})


@ensure_csrf_cookie
def login_by_captcha(request):
    # 获取csrftoken
    if request.method == 'GET':
        get_token(request)
        return JsonResponse({'code': 200})

    # 请求登录
    if request.method == 'POST':
        json_body = json.loads(request.body)
        login_email = json_body.get('loginEmail', None)
        login_captcha = json_body.get('loginCaptcha', None)

        if login_email is None or login_captcha is None:
            return JsonResponse({'code': 400, 'message': 'Params error'})

        if not User.objects.filter(email=login_email).exists():
            return JsonResponse({'code': 405, 'message': '用户不存在'})

        if not Captcha.objects.filter(email=login_email).exists():
            return JsonResponse({'code': 405, 'message': '请发送验证码'})

        captchaObj = Captcha.objects.get(email=login_email)
        if captchaObj.loginCaptcha == 0:
            return JsonResponse({'code': 405, 'message': '请发送验证码'})

        if int(login_captcha) != captchaObj.loginCaptcha:
            return JsonResponse({'code': 405, 'message': '验证码不正确'})

        lastTime = datetime.datetime.fromtimestamp(captchaObj.loginTime)
        delta = datetime.timedelta(minutes=5)  # 时间差定义
        nowTime = datetime.datetime.now()

        if nowTime - lastTime > delta:
            return JsonResponse({'code': 405, 'message': '验证码已过期'})

        userObj = User.objects.get(email=login_email)
        remember = json_body.get('remember', False)
        response = JsonResponse({'code': 200, 'loginInfos': {
            'userId': userObj.id, 'email': userObj.email,
            'portrait': userObj.portrait.name, 'nickname': userObj.nickname,
            'gender': userObj.gender
        }})
        if remember:
            data = str(userObj.id) + login_email
            jwtToken = createJWT(data)
            response.set_cookie('jwtToken', jwtToken, expires=EXPIRES_TIME)
            return response
        else:
            data = str(userObj.id) + login_email
            jwtToken = createJWT(data)
            response.set_cookie('jwtToken', jwtToken)
            return response
    return JsonResponse({'code': 503, 'message': 'No method'})


@ensure_csrf_cookie
def register(request):
    # 获取csrftoken
    if request.method == 'GET':
        get_token(request)
        return JsonResponse({'code': 200})

    # 请求注册
    if request.method == 'POST':
        json_body = json.loads(request.body)
        register_email = json_body.get('registerEmail', None)
        nickName = json_body.get('nickName', None)
        gender = json_body.get('gender', 0)
        register_password = json_body.get('registerPassword', None)
        register_captcha = json_body.get('registerCaptcha', None)

        if register_email is None or nickName is None or register_password is None or register_captcha is None:
            return JsonResponse({'code': 400, 'message': 'Params error'})

        if User.objects.filter(email=register_email).exists():
            return JsonResponse({'code': 405, 'message': '用户已存在'})

        if not Captcha.objects.filter(email=register_email).exists():
            return JsonResponse({'code': 405, 'message': '请发送验证码'})

        captchaObj = Captcha.objects.get(email=register_email)
        if captchaObj.registerCaptcha == 0:
            return JsonResponse({'code': 405, 'message': '请发送验证码'})

        if int(register_captcha) != captchaObj.registerCaptcha:
            return JsonResponse({'code': 405, 'message': '验证码不正确'})

        lastTime = datetime.datetime.fromtimestamp(captchaObj.registerTime)
        delta = datetime.timedelta(minutes=5)  # 时间差定义
        nowTime = datetime.datetime.now()

        if nowTime - lastTime > delta:
            return JsonResponse({'code': 405, 'message': '验证码已过期'})

        password = hashlib.sha256(register_password.encode('utf-8')).hexdigest()
        userObj = User(email=register_email, nickname=nickName, gender=gender, password=password)
        userObj.save()

        userObj = User.objects.get(email=register_email)
        response = JsonResponse({'code': 200, 'loginInfos': {
            'userId': userObj.id, 'email': userObj.email,
            'portrait': userObj.portrait.name, 'nickname': userObj.nickname,
            'gender': userObj.gender
        }})
        data = str(userObj.id) + register_email
        jwtToken = createJWT(data)
        response.set_cookie('jwtToken', jwtToken, expires=EXPIRES_TIME)
        return response
    return JsonResponse({'code': 503, 'message': 'No method'})


@ensure_csrf_cookie
def reset_password(request):
    # 获取csrftoken
    if request.method == 'GET':
        get_token(request)
        return JsonResponse({'code': 200})

    # 请求重置密码
    if request.method == 'POST':
        json_body = json.loads(request.body)
        reset_email = json_body.get('resetEmail', None)
        reset_password = json_body.get('resetPassword', None)
        reset_captcha = json_body.get('resetCaptcha', None)

        if reset_email is None or reset_password is None or reset_captcha is None:
            return JsonResponse({'code': 400, 'message': 'Params error'})

        if not User.objects.filter(email=reset_email).exists():
            return JsonResponse({'code': 405, 'message': '用户不存在'})

        if not Captcha.objects.filter(email=reset_email).exists():
            return JsonResponse({'code': 405, 'message': '请发送验证码'})

        captchaObj = Captcha.objects.get(email=reset_email)
        if captchaObj.resetCaptcha == 0:
            return JsonResponse({'code': 405, 'message': '请发送验证码'})

        if int(reset_captcha) != captchaObj.resetCaptcha:
            return JsonResponse({'code': 405, 'message': '验证码不正确'})

        lastTime = datetime.datetime.fromtimestamp(captchaObj.resetTime)
        delta = datetime.timedelta(minutes=5)  # 时间差定义
        nowTime = datetime.datetime.now()

        if nowTime - lastTime > delta:
            return JsonResponse({'code': 405, 'message': '验证码已过期'})

        password = hashlib.sha256(reset_password.encode('utf-8')).hexdigest()
        userObj = User.objects.get(email=reset_email)

        if userObj.password == password:
            return JsonResponse({'code': 405, 'message': '密码相同,请勿更改'})

        userObj.password = password
        userObj.save()

        return JsonResponse({'code': 200})
    return JsonResponse({'code': 503, 'message': 'No method'})


@csrf_exempt
def reset_user_info(request):
    if request.method == 'POST':
        json_body = json.loads(request.body)
        token = request.META.get('HTTP_AUTHORIZATION', '')
        user_id = json_body.get('userId', None)
        user_email = json_body.get('email', None)
        nickname = json_body.get('nickname', None)
        gender = json_body.get('gender', None)

        if verifyJWT(token, str(user_id) + user_email) == 0:
            return JsonResponse({'code': 403, 'message': 'Forbidden'})

        if not User.objects.filter(id=user_id, email=user_email).exists():
            return JsonResponse({'code': 500, 'message': 'Database error'})

        userObj = User.objects.get(id=user_id, email=user_email)
        userObj.nickname = nickname
        userObj.gender = gender
        userObj.save()

        return JsonResponse({'code': 200})

    return JsonResponse({'code': 503, 'message': 'No method'})


@csrf_exempt
def reset_portrait(request):
    if request.method == 'POST':
        content_type = request.content_type
        if content_type.startswith('multipart/form-data'):
            file = request.FILES.get('file')
            # os.path.join(settings.BASE_DIR, 'commonstatic', 'user')
            print(os.path.join(os.environ.get('TEMP'), 'user', 'file.png'))
            with open(os.path.join(os.environ.get('TEMP'), 'user', 'file'), 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

        return JsonResponse({'code': 200})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_singer_list(request):
    if request.method == 'GET':
        alphabet = int(request.GET.get('alphabet', -1))
        area = int(request.GET.get('area', -1))
        gender = int(request.GET.get('gender', -1))
        genre = int(request.GET.get('genre', -1))
        offset = int(request.GET.get('offset', 1))
        limit = int(request.GET.get('limit', 20))
        alphabet_list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
                         'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        area_list = ['中国', '欧美', '日韩']
        gender_list = ['男', '女', '组合']
        genre_list = ['流行', '说唱', '其他']

        singerObj = Singer.objects.all()
        if alphabet != -1:
            singerObj = singerObj.filter(tags__name=alphabet_list[alphabet - 1])

        if area != -1:
            singerObj = singerObj.filter(tags__name=area_list[area - 1])

        if gender != -1:
            singerObj = singerObj.filter(tags__name=gender_list[gender - 1])

        if genre != -1:
            singerObj = singerObj.filter(tags__name=genre_list[genre - 1])

        singerObj = singerObj.order_by('id')
        singerObj = list(singerObj.values('id', 'name', 'url'))[(offset - 1) * limit: offset * limit]
        return JsonResponse({'code': 200, 'singerList': singerObj})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_mv_list(request):
    if request.method == 'GET':
        version = int(request.GET.get('version', -1))
        order = int(request.GET.get('order', 1))
        offset = int(request.GET.get('offset', 1))
        limit = int(request.GET.get('limit', 8))
        version_list = ['MV', '现场']

        mvObj = MV.objects.all()
        if version != -1:
            mvObj = mvObj.filter(tags__name=version_list[version - 1])

        if order != 1:
            mvObj = mvObj.order_by('play_count', 'star_count', 'id')
        else:
            mvObj = mvObj.order_by('-publish', 'id')

        mvObj = mvObj[(offset - 1) * limit: offset * limit]
        mvList = []
        for mv in mvObj:
            singerObj = mv.singer_set.all()
            singerList = []
            for singer in singerObj:
                singer_dict = {
                    'id': singer.id,
                    'name': singer.name
                }
                singerList.append(singer_dict)
            mv_dict = {
                'id': mv.id,
                'name': mv.name,
                'url': mv.url,
                'play_count': mv.play_count,
                'publish': mv.publish,
                'singers': singerList
            }
            mvList.append(mv_dict)

        return JsonResponse({'code': 200, 'mvList': mvList})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_rank_list(request):
    if request.method == 'GET':
        top = int(request.GET.get('top', 1))
        area_list = ['中国', '欧美', '日韩']

        songObj = Song.objects.all()
        if top == 1:
            songObj = songObj.order_by('play_count', 'star_count', 'id')
            songObj = songObj[:20]
            songList = []
            for song in songObj:
                singerObj = song.singer_set.all()
                singerList = []
                for singer in singerObj:
                    singer_dict = {
                        'id': singer.id,
                        'name': singer.name
                    }
                    singerList.append(singer_dict)
                song_dict = {
                    'id': song.id,
                    'name': song.name,
                    'url': song.url,
                    'time': song.time,
                    'singers': singerList
                }
                songList.append(song_dict)
            return JsonResponse({'code': 200, 'rankList': songList})

        if top == 2:
            songObj = songObj.order_by('-publish', 'id')
            songObj = songObj[:20]
            songList = []
            for song in songObj:
                singerObj = song.singer_set.all()
                singerList = []
                for singer in singerObj:
                    singer_dict = {
                        'id': singer.id,
                        'name': singer.name
                    }
                    singerList.append(singer_dict)
                song_dict = {
                    'id': song.id,
                    'name': song.name,
                    'url': song.url,
                    'time': song.time,
                    'singers': singerList
                }
                songList.append(song_dict)
            return JsonResponse({'code': 200, 'rankList': songList})

        if top in (3, 4, 5):
            songObj = songObj.order_by('play_count', 'star_count', 'id')
            songList = []
            for song in songObj:
                if len(songList) == 20:
                    break
                singerObj = song.singer_set.all()
                querySinger = singerObj.filter(tags__name=area_list[top-3])
                if querySinger.exists():
                    singerList = []
                    for singer in singerObj:
                        singer_dict = {
                            'id': singer.id,
                            'name': singer.name
                        }
                        singerList.append(singer_dict)
                    song_dict = {
                        'id': song.id,
                        'name': song.name,
                        'url': song.url,
                        'time': song.time,
                        'singers': singerList
                    }
                    songList.append(song_dict)
            return JsonResponse({'code': 200, 'rankList': songList})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_singer_info(request):
    if request.method == 'GET':
        id = int(request.GET.get('id', -1))

        singerObj = Singer.objects.filter(id=id)
        if singerObj.exists():
            singer = Singer.objects.get(id=id)
            singer_info = {
                'id': singer.id,
                'url': singer.url,
                'name': singer.name,
                'desc': singer.desc,
                'songCount': singer.songs.count(),
                'albumCount': singer.albums.count(),
                'mvCount': singer.mvs.count(),
            }

            return JsonResponse({'code': 200, 'singerInfo': singer_info})
        else:
            return JsonResponse({'code': 405, 'message': '没有该信息'})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_singer_default(request):
    if request.method == 'GET':
        id = int(request.GET.get('id', -1))

        singerObj = Singer.objects.filter(id=id)
        if singerObj.exists():
            singer = Singer.objects.get(id=id)

            songObj = singer.songs.all().order_by('play_count', 'star_count', 'id')[:10]
            songList = []
            for song in songObj:
                singerObj = song.singer_set.all()
                singerList = []
                for singer in singerObj:
                    singer_dict = {
                        'id': singer.id,
                        'name': singer.name
                    }
                    singerList.append(singer_dict)
                song_dict = {
                    'id': song.id,
                    'name': song.name,
                    'time': song.time,
                    'singers': singerList
                }
                songList.append(song_dict)

            albumObj = singer.albums.all().order_by('-publish', 'id')[0:4]
            albumList = []
            for album in albumObj:
                album_dict = {
                    'id': album.id,
                    'url': album.url,
                    'name': album.name,
                    'publish': album.publish
                }
                albumList.append(album_dict)

            mvObj = singer.mvs.all().order_by('play_count', 'star_count', 'id')[0:4]
            mvList = []
            for mv in mvObj:
                mv_dict = {
                    'id': mv.id,
                    'url': mv.url,
                    'name': mv.name,
                    'play_count': mv.play_count
                }
                mvList.append(mv_dict)

            singer_default = {
                'id': singer.id,
                'songs': songList,
                'albums': albumList,
                'mvs': mvList,
            }

            return JsonResponse({'code': 200, 'singerDefault': singer_default})
        else:
            return JsonResponse({'code': 405, 'message': '没有该信息'})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_singer_song(request):
    if request.method == 'GET':
        id = int(request.GET.get('id', -1))
        index = int(request.GET.get('index', 1))
        limit = 10

        singerObj = Singer.objects.filter(id=id)
        if singerObj.exists():
            singer = Singer.objects.get(id=id)

            if singer.songs.count() < (index - 1) * limit or index < 0:
                return JsonResponse({'code': 405, 'message': '没有该信息'})

            songObj = singer.songs.all().order_by('play_count', 'star_count', 'id')[(index - 1) * limit: index * limit]
            songList = []
            for song in songObj:
                singerObj = song.singer_set.all()
                singerList = []
                for singer in singerObj:
                    singer_dict = {
                        'id': singer.id,
                        'name': singer.name
                    }
                    singerList.append(singer_dict)
                song_dict = {
                    'id': song.id,
                    'name': song.name,
                    'time': song.time,
                    'singers': singerList
                }
                songList.append(song_dict)
            singer_song = {
                'songs': songList,
                'count': singer.songs.count()
            }

            return JsonResponse({'code': 200, 'singerSong': singer_song})
        else:
            return JsonResponse({'code': 405, 'message': '没有该信息'})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_singer_album(request):
    if request.method == 'GET':
        id = int(request.GET.get('id', -1))
        index = int(request.GET.get('index', 1))
        limit = 12

        singerObj = Singer.objects.filter(id=id)
        if singerObj.exists():
            singer = Singer.objects.get(id=id)

            if singer.albums.count() < (index - 1) * limit or index < 0:
                return JsonResponse({'code': 405, 'message': '没有该信息'})

            albumObj = singer.albums.all().order_by('-publish', 'id')[(index - 1) * limit: index * limit]
            albumList = []
            for album in albumObj:
                album_dict = {
                    'id': album.id,
                    'url': album.url,
                    'name': album.name,
                    'publish': album.publish
                }
                albumList.append(album_dict)
            singer_album = {
                'albums': albumList,
                'count': singer.albums.count()
            }

            return JsonResponse({'code': 200, 'singerAlbum': singer_album})
        else:
            return JsonResponse({'code': 405, 'message': '没有该信息'})

    return JsonResponse({'code': 503, 'message': 'No method'})


def get_singer_mv(request):
    if request.method == 'GET':
        id = int(request.GET.get('id', -1))
        index = int(request.GET.get('index', 1))
        limit = 12

        singerObj = Singer.objects.filter(id=id)
        if singerObj.exists():
            singer = Singer.objects.get(id=id)

            if singer.mvs.count() < (index - 1) * limit or index < 0:
                return JsonResponse({'code': 405, 'message': '没有该信息'})

            mvObj = singer.mvs.all().order_by('-publish', 'id')[(index - 1) * limit: index * limit]
            mvList = []
            for mv in mvObj:
                mv_dict = {
                    'id': mv.id,
                    'url': mv.url,
                    'name': mv.name,
                    'play_count': mv.play_count
                }
                mvList.append(mv_dict)

            singer_mv = {
                'mvs': mvList,
                'count': singer.mvs.count()
            }

            return JsonResponse({'code': 200, 'singerMV': singer_mv})
        else:
            return JsonResponse({'code': 405, 'message': '没有该信息'})

    return JsonResponse({'code': 503, 'message': 'No method'})


# @ensure_csrf_cookie
# def check_jwt(request):
#     if request.method == 'GET':
#         get_token(request)
#         return JsonResponse({'code': 200})
#     if request.method == 'POST':
#         token = request.META.get('HTTP_AUTHORIZATION','')
#         payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
#         json_body = json.loads(request.body)
#         id = str(json_body.get('userId', None))
#         email = json_body.get('email', None)
#         if id + email == payload.get('info'):
#             return JsonResponse({'code': 200})
#         return JsonResponse({'code': 405, 'message': '登录无效'})

def insert(request):
    # -----------------------singer-tag
    # A = SingerTag(name='A')
    # A.save()
    # A = SingerTag(name='B')
    # A.save()
    # A = SingerTag(name='C')
    # A.save()
    # A = SingerTag(name='D')
    # A.save()
    # A = SingerTag(name='E')
    # A.save()
    # A = SingerTag(name='F')
    # A.save()
    # A = SingerTag(name='G')
    # A.save()
    # A = SingerTag(name='H')
    # A.save()
    # A = SingerTag(name='I')
    # A.save()
    # A = SingerTag(name='J')
    # A.save()
    # A = SingerTag(name='K')
    # A.save()
    # A = SingerTag(name='L')
    # A.save()
    # A = SingerTag(name='M')
    # A.save()
    # A = SingerTag(name='N')
    # A.save()
    # A = SingerTag(name='O')
    # A.save()
    # A = SingerTag(name='P')
    # A.save()
    # A = SingerTag(name='Q')
    # A.save()
    # A = SingerTag(name='R')
    # A.save()
    # A = SingerTag(name='S')
    # A.save()
    # A = SingerTag(name='T')
    # A.save()
    # A = SingerTag(name='U')
    # A.save()
    # A = SingerTag(name='V')
    # A.save()
    # A = SingerTag(name='W')
    # A.save()
    # A = SingerTag(name='X')
    # A.save()
    # A = SingerTag(name='Y')
    # A.save()
    # A = SingerTag(name='Z')
    # A.save()
    #
    # neidi = SingerTag(name='中国')
    # neidi.save()
    # neidi = SingerTag(name='欧美')
    # neidi.save()
    # neidi = SingerTag(name='日韩')
    # neidi.save()
    #
    # nan = SingerTag(name='男')
    # nan.save()
    # nan = SingerTag(name='女')
    # nan.save()
    # nan = SingerTag(name='组合')
    # nan.save()
    #
    # liuxing = SingerTag(name='流行')
    # liuxing.save()
    # liuxing = SingerTag(name='说唱')
    # liuxing.save()
    # liuxing = SingerTag(name='其他')
    # liuxing.save()

    # name = '国风集'
    # desc = 'QQ音乐原创音乐品牌「国风集」，致力于打造全新的国风音乐生态，为优秀的国风原创团队和音乐人提供多方位的扶持，创作精品国风音乐。'
    # url = '/media/singer'
    # tag = SingerTag.object.filter(name__in=['G','中国','组合','流行'])
    #
    # for i in range(10):
    #     if i == 0:
    #         singer = Singer(name=name, desc=desc, url=url)
    #     else:
    #         name1 = name + str(i+1)
    #         singer = Singer(name=name1, desc=desc, url=url)
    #     singer.save()
    #     singer.tags.add(*tag)

    # -----------------------mv-tag
    # a = MVTag(name='MV')
    # a.save()
    # a = MVTag(name='现场')
    # a.save()

    # name1 = 'Heart Of Peace'
    # desc1 = '《Heart Of Peace》是ZHANGYE和周深第一次合作，这是一支英文电音歌曲，由张也作曲、作词并担任制作人，周深演唱。歌曲表达了对和平生活的热爱，探讨在面对困难与挑战时，该如何保持一颗纯粹的心，以及在经历过迷茫后，继续在生活中寻找自我成长的希望感。'
    # publish1 = datetime.datetime(2023, 4, 25, 17, 0)
    #
    # name2 = '如愿'
    # desc2 = '电影《我和我的父辈》发布主题推广曲《如愿》，歌曲由王菲演唱，钱雷作曲，唐恬作词。父母一辈为之奋斗的一幕幕，在子女一辈的时代得以实现，这便是歌名“如愿”的含义。 自《我和我的祖国》之后，王菲再度献唱“国庆三部曲”系列。伴随着王菲空灵又深情的歌声，《如愿》歌词以极具诗意的比喻，娓娓道来了四个不同年代的家庭故事，呈现了在世代中国人的奋斗与传承中，祖国日益强大之景。作曲者钱雷透露，王菲在录制过程中打磨每一句唱词，为了非常细节的情绪反复录制，为歌曲注入情感。作词者唐恬则表示，曲的指引、王菲的语气和故事本身的力量，汇成了她的创作。 2019看“祖国”，2020看“家乡”，2021看“父辈”。作为陪伴观众第三年的国庆最强IP，电影《我和我的父辈》接棒“国庆三部曲”，继续以大时代下的小人物切入，以家庭关系为载体，讲述父母与子女深切的情感羁绊。电影由吴京、章子怡、徐峥、沈腾执导，将于今年9月30日上映，是全家人的国庆必看首选。'
    # publish2 = datetime.datetime(2023, 1, 22, 17, 0)
    #
    # name3 = 'Flying High'
    # desc3 = '新华社于2023年中国航天日推出原创英文歌曲《Flying High》，由青年歌手希林娜依·高和新华社记者路滨琪联袂演唱，聚焦中国航天人的精神世界，用动感的旋律和动人的歌声诉说中国航天人在浩瀚宇宙中上下求索，不断追梦的伟大实践。用音乐这一跨越国界和语种的艺术形式，面向全世界唱响新时代中国航天故事。'
    # publish3 = datetime.datetime(2023, 3, 24, 17, 0)
    #
    # url = '/media/mv'
    # play_count = 0
    # star_count = 0
    #
    # tag1 = MVTag.objects.filter(name__in=['MV'])
    # tag2 = MVTag.objects.filter(name__in=['现场'])
    #
    # for i in range(16):
    #     if i == 0:
    #         mv1 = MV(name=name1, desc=desc1, publish=timezone.make_aware(publish1), url=url, play_count=play_count, star_count=star_count)
    #         mv2 = MV(name=name2, desc=desc2, publish=timezone.make_aware(publish2), url=url, play_count=play_count, star_count=star_count)
    #         mv3 = MV(name=name3, desc=desc3, publish=timezone.make_aware(publish3), url=url, play_count=play_count, star_count=star_count)
    #     else:
    #         name11 = name1 + str(i+1)
    #         name21 = name2 + str(i+1)
    #         name31 = name3 + str(i+1)
    #         mv1 = MV(name=name11, desc=desc1, publish=timezone.make_aware(publish1 + datetime.timedelta(days=i, hours=i)), url=url, play_count=play_count, star_count=star_count)
    #         mv2 = MV(name=name21, desc=desc2, publish=timezone.make_aware(publish2 + datetime.timedelta(days=i, hours=i)), url=url, play_count=play_count, star_count=star_count)
    #         mv3 = MV(name=name31, desc=desc3, publish=timezone.make_aware(publish3 + datetime.timedelta(days=i, hours=i)), url=url, play_count=play_count, star_count=star_count)
    #     mv1.save()
    #     mv1.tags.add(*tag1)
    #     mv2.save()
    #     mv2.tags.add(*tag2)
    #     mv3.save()
    #     mv3.tags.add(*tag1)

    # -----------------------singer-mv
    # mv = MV.objects.all()[36:48]
    # singer = Singer.objects.get(id=51)
    # singer.mvs.add(*mv)
    # mv = MV.objects.all()[:6]
    # singer = Singer.objects.get(id=31)
    # singer.mvs.add(*mv)

    # -----------------------song
    # nameList = ['清河诀', '破阵 (《少年歌行 风花雪月篇》片尾主题曲)', '情人咒 (电视剧《琉璃美人煞》片尾曲)', '那个男人 (声入人心)', '鹿 Be Free (声入人心)',
    #         '风之旅人 (《将夜2》影视剧主题曲)', '我属于我自己 (声入人心)', 'OveR', 'Alone', '如果再见面']
    #
    # url = '/media/song'
    # play_count = 0
    # star_count = 0

    # for i in range(1, 16):
    #     if i <= 10:
    #         name = nameList[i%10-1]
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 1, 5, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()
    #     elif i <= 20:
    #         name = nameList[i%10-1] + str(2)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 1, 5, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()

    # for i in range(16, 31):
    #     if i <= 20:
    #         name = nameList[i%10-1] + str(2)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 1, 25, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()
    #     elif i <= 30:
    #         name = nameList[i%10-1] + str(3)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 1, 25, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()

    # for i in range(31, 46):
    #     if i <= 40:
    #         name = nameList[i%10-1] + str(4)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 2, 17, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()
    #     elif i <= 50:
    #         name = nameList[i%10-1] + str(5)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 2, 17, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()

    # for i in range(46, 61):
    #     if i <= 50:
    #         name = nameList[i%10-1] + str(5)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 3, 1, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()
    #     elif i <= 60:
    #         name = nameList[i%10-1] + str(6)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 3, 1, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()

    # for i in range(61, 76):
    #     if i <= 70:
    #         name = nameList[i%10-1] + str(7)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 4, 7, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()
    #     elif i <= 80:
    #         name = nameList[i%10-1] + str(8)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 4, 7, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()

    # for i in range(76, 101):
    #     if i <= 80:
    #         name = nameList[i%10-1] + str(8)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 4, 7, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()
    #     elif i <= 90:
    #         name = nameList[i%10-1] + str(9)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 4, 7, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()
    #     elif i <= 100:
    #         name = nameList[i%10-1] + str(10)
    #         song = Song(name=name, url=url, publish=timezone.make_aware(datetime.datetime(2023, 4, 7, 12, 0)), play_count=play_count, star_count=star_count)
    #         song.save()

    # for i in range(76, 101):
    #     song = Song.objects.get(id=i)
    #     song.publish = timezone.make_aware(datetime.datetime(2023, 4, 14, 12, 0) + datetime.timedelta(days=(i-76)))
    #     song.save()

    # for i in range(1, 101):
    #     song = Song.objects.get(id=i)
    #     if i % 10 == 1:
    #         song.time = timedelta(minutes=3, seconds=44)
    #     elif i % 10 == 2:
    #         song.time = timedelta(minutes=3, seconds=24)
    #     elif i % 10 == 3:
    #         song.time = timedelta(minutes=6, seconds=2)
    #     elif i % 10 == 4:
    #         song.time = timedelta(minutes=4, seconds=37)
    #     elif i % 10 == 5:
    #         song.time = timedelta(minutes=3, seconds=52)
    #     elif i % 10 == 6:
    #         song.time = timedelta(minutes=4, seconds=6)
    #     elif i % 10 == 7:
    #         song.time = timedelta(minutes=4, seconds=1)
    #     elif i % 10 == 8:
    #         song.time = timedelta(minutes=4, seconds=6)
    #     elif i % 10 == 9:
    #         song.time = timedelta(minutes=3, seconds=24)
    #     elif i % 10 == 0:
    #         song.time = timedelta(minutes=4, seconds=2)
    #     song.save()

    # -----------------------song-mv
    # for i in range(1, 16):
    #     song = Song.objects.get(id=i)
    #     mv = MV.objects.get(id=i)
    #     song.mv = mv
    #     song.save()

    # for i in range(18,23):
    #     song = Song.objects.get(id=i)
    #     mv = MV.objects.get(id=(i-2))
    #     song.mv = mv
    #     song.save()

    # for i in range(32,37):
    #     song = Song.objects.get(id=i)
    #     mv = MV.objects.get(id=(i-11))
    #     song.mv = mv
    #     song.save()
    #
    # for i in range(46,51):
    #     song = Song.objects.get(id=i)
    #     mv = MV.objects.get(id=(i-20))
    #     song.mv = mv
    #     song.save()
    #
    # for i in range(69,74):
    #     song = Song.objects.get(id=i)
    #     mv = MV.objects.get(id=(i-38))
    #     song.mv = mv
    #     song.save()
    #
    # for i in range(76, 89):
    #     song = Song.objects.get(id=i)
    #     mv = MV.objects.get(id=(i-40))
    #     song.mv = mv
    #     song.save()

    # for i in range(92, 95):
    #     song = Song.objects.get(id=i)
    #     mv = MV.objects.get(id=(i-60))
    #     song.mv = mv
    #     song.save()

    # -----------------------song-singer
    # for i in range(1, 76):
    #     song = Song.objects.get(id=i)
    #     if i <= 30:
    #         singer = Singer.objects.get(id=1)
    #         singer.songs.add(song)
    #     elif i <= 45:
    #         singer = Singer.objects.get(id=11)
    #         singer.songs.add(song)
    #     elif i <= 60:
    #         singer = Singer.objects.get(id=21)
    #         singer.songs.add(song)
    #     elif i <= 75:
    #         singer = Singer.objects.get(id=31)
    #         singer.songs.add(song)

    # for i in range(76, 101):
    #     song = Song.objects.get(id=i)
    #     if i <= 85:
    #         singer = Singer.objects.get(id=1)
    #         singer.songs.add(song)
    #     elif i <= 87:
    #         singer = Singer.objects.get(id=11)
    #         singer.songs.add(song)
    #     elif i <= 89:
    #         singer = Singer.objects.get(id=21)
    #         singer.songs.add(song)
    #     elif i <= 91:
    #         singer = Singer.objects.get(id=31)
    #         singer.songs.add(song)
    #     elif i <= 94:
    #         singer = Singer.objects.get(id=41)
    #         singer.songs.add(song)
    #     elif i <= 97:
    #         singer = Singer.objects.get(id=51)
    #         singer.songs.add(song)
    #     elif i <= 100:
    #         singer = Singer.objects.get(id=41)
    #         singer.songs.add(song)

    # -----------------------album
    # nameList = ['ON PLAY', '化风', '谒金门', '再见只是陌生人', '佛前叹两难'
    #             'Album 1', 'Album 2', 'Album 3', 'Album 4', 'Album 5', 'Album 6', 'Album 7', 'Album 8', 'Album 9', 'Album 10',
    #             'Album 11', 'Album 12', 'Album 13', 'Album 14', 'Album 15', 'Album 16', 'Album 17', 'Album 18', 'Album 19']
    # time_month = [1, 1, 2, 3, 4,
    #               4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    #               4, 4, 4, 4, 4, 4, 4, 5, 5]
    # time_day = [5, 25, 17, 1, 7,
    #             14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    #             24, 25, 26, 27, 28, 29, 30, 1, 2]
    # time_hour = 12
    # time_minute = 0
    # url = '/media/album'
    # for i in range(24):
    #     album = Album(name=nameList[i], url=url, publish=timezone.make_aware(datetime.datetime(2023, time_month[i], time_day[i], time_hour, time_minute)))
    #     album.save()

    # -----------------------album-song
    # for i in range(1, 6):
    #     songs = Song.objects.all()[(i-1)*15: i*15]
    #     print(i, '----', songs)
    #     album = Album.objects.get(id=i)
    #     for song in songs:
    #         album.songs.add(song)

    # for i in range(6, 25):
    #     song = Song.objects.get(id=(70+i))
    #     print(i, '----', song)
    #     album = Album.objects.get(id=i)
    #     album.songs.add(song)

    # -----------------------album-singer
    # for i in range(1, 25):
    #     album = Album.objects.get(id=i)
    #     if i in (1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15):
    #         singer = Singer.objects.get(id=1)
    #         singer.albums.add(album)
    #     elif i in (3, 16, 17):
    #         singer = Singer.objects.get(id=11)
    #         singer.albums.add(album)
    #     elif i in (4, 18, 19):
    #         singer = Singer.objects.get(id=21)
    #         singer.albums.add(album)
    #     elif i in (5, 20, 21):
    #         singer = Singer.objects.get(id=31)
    #         singer.albums.add(album)
    #     elif i in (22, 23, 24):
    #         singer = Singer.objects.get(id=41)
    #         singer.albums.add(album)
    
    print('done')
    return JsonResponse({'code': 200})
