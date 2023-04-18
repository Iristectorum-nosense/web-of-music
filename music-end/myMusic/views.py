import hashlib
import json
import time
import jwt
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
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
        # password = hashlib.sha256(login_password.encode('utf-8')).hexdigest()

        if login_password != userObj.password:
            return JsonResponse({'code': 405, 'message': '密码错误'})

        remember = json_body.get('remember', False)
        response = JsonResponse({'code': 200, 'loginInfos': {'userId': userObj.id, 'email': userObj.email,
                                                                 'portrait': userObj.portrait.name}})
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
            if Captcha.objects.filter(email=register_email).exists():
                sendedCap = random.randint(100000, 999999)
                # 发送验证码
                # 更改验证码和时间到数据库
            else:
                sendedCap = random.randint(100000, 999999)
                # 发送验证码
                # 创建验证码和时间到数据库

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
        if int(login_captcha) != captchaObj.loginCaptcha:
            return JsonResponse({'code': 405, 'message': '验证码不正确'})

        lastTime = datetime.datetime.fromtimestamp(captchaObj.loginTime)
        delta = datetime.timedelta(minutes=5)  # 时间差定义
        nowTime = datetime.datetime.now()

        if nowTime - lastTime > delta:
            return JsonResponse({'code': 405, 'message': '验证码已过期'})

        userObj = User.objects.get(email=login_email)
        remember = json_body.get('remember', False)
        response = JsonResponse({'code': 200, 'loginInfos': {'userId': userObj.id, 'email': userObj.email,
                                                                 'portrait': userObj.portrait.name}})
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


# @ensure_csrf_cookie
# def register(request):
#     if request.method == 'GET':
#         get_token(request)
#         return JsonResponse({'code': 200})
#     if request.method == 'POST':
#         json_body = json.loads(request.body)
#         register_email = json_body.get('registerEmail', None)
#         gender = int(json_body.get('gender', 1))
#         register_password = json_body.get('registerPassword', None)
#         if register_email is None or register_password is None:
#             return JsonResponse({'code': 400, 'message': 'Params error'})
#         password = hashlib.sha256(register_password.encode('utf-8')).hexdigest()
#         if not User.objects.filter(email=register_email).exists():
#             # user = User(email=register_email, gender=gender, password=password)
#             # user.save()
#             token = createJWT(register_email)
#             return JsonResponse({'code': 200, 'info': {'token': token}})
#         else:
#             return JsonResponse({'code': 405, 'message': 'The email has been registered'})
