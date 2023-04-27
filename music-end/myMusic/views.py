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


    print(1)
    return JsonResponse({'code': 200})
