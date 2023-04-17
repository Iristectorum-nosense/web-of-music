import hashlib
import json
import time
import jwt
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import *
from django.core.mail import send_mail
from datetime import datetime
import random

EXPIRES_TIME = 60 * 60
SECRET_KEY = 'myMusicEnd'


# utils
def createJWT(data):
    payload = {'info': data, 'exp': int(time.time()) + EXPIRES_TIME + 60}
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return str(token, encoding='utf8')


# Create your views here.
def send_captcha(request):
    if 'registerEmail' in request.GET:
        register_email = request.GET['registerEmail']
        if User.objects.filter(email=register_email).exists():
            return JsonResponse({'code': 405, 'message': 'The email has been registered'})
        captcha = random.randint(100000, 999999)

        return JsonResponse({'code': 200})
    elif 'loginEmail' in request.GET:
        login_email = request.GET['loginEmail']
        if not User.objects.filter(email=login_email).exists():
            return JsonResponse({'code': 405, 'message': 'The email has not been registered'})
        captcha = random.randint(100000, 999999)
    else:
        return JsonResponse({'code': 400, 'message': 'Params error'})


def verify_captcha(request):
    if 'verifyEmail' or 'verifyCaptcha' not in request.POST:
        return JsonResponse({'code': 400, 'message': 'Params error'})
    verify_email = request.POST.get('verifyEmail')
    captcha = request.POST.get('verifyCaptcha')


@ensure_csrf_cookie
def login_by_password(request):
    if request.method == 'GET':
        get_token(request)
        return JsonResponse({'code': 200})
    if request.method == 'POST':
        json_body = json.loads(request.body)
        login_email = json_body.get('loginEmail', None)
        login_password = json_body.get('loginPassword', None)
        if login_email is None or login_password is None:
            return JsonResponse({'code': 400, 'message': 'Params error'})
        if not User.objects.filter(email=login_email).exists():
            return JsonResponse({'code': 405, 'message': '用户不存在'})
        user = User.objects.get(email=login_email)
        # password = hashlib.sha256(login_password.encode('utf-8')).hexdigest()
        if login_password == user.password:
            remember = json_body.get('remember', False)
            response = JsonResponse({'code': 200, 'loginInfos': {'userId': user.id, 'email': user.email,
                                                                 'portrait': user.portrait.name}})
            if remember:
                data = str(user.id) + login_email
                jwtToken = createJWT(data)
                response.set_cookie('jwtToken', jwtToken, expires=EXPIRES_TIME)
                return response
            else:
                data = str(user.id) + login_email
                jwtToken = createJWT(data)
                response.set_cookie('jwtToken', jwtToken)
                return response
        else:
            return JsonResponse({'code': 405, 'message': '密码错误'})


@ensure_csrf_cookie
def check_jwt(request):
    if request.method == 'GET':
        get_token(request)
        return JsonResponse({'code': 200})
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION')
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        json_body = json.loads(request.body)
        id = str(json_body.get('userId', None))
        email = json_body.get('userEmail', None)
        if id + email == payload.get('info'):
            return JsonResponse({'code': 200})
        return JsonResponse({'code': 405, 'message': '登录无效'})


@ensure_csrf_cookie
def register(request):
    if request.method == 'GET':
        get_token(request)
        return JsonResponse({'code': 200})
    if request.method == 'POST':
        json_body = json.loads(request.body)
        register_email = json_body.get('registerEmail', None)
        gender = int(json_body.get('gender', 1))
        register_password = json_body.get('registerPassword', None)
        if register_email is None or register_password is None:
            return JsonResponse({'code': 400, 'message': 'Params error'})
        password = hashlib.sha256(register_password.encode('utf-8')).hexdigest()
        if not User.objects.filter(email=register_email).exists():
            # user = User(email=register_email, gender=gender, password=password)
            # user.save()
            token = createJWT(register_email)
            return JsonResponse({'code': 200, 'info': {'token': token}})
        else:
            return JsonResponse({'code': 405, 'message': 'The email has been registered'})
