# 享听音乐在线平台
<img src='https://github.com/Iristectorum-nosense/web-of-music/blob/master/assets/%E5%B1%95%E7%A4%BA1.png' />

<img src='https://github.com/Iristectorum-nosense/web-of-music/blob/master/assets/%E5%B1%95%E7%A4%BA2.png' />

## 项目简介
一款涵盖自定义音乐播放器和多样化内容呈现的 Web 应用，支持用户免登录管理播放队列。项目包含登录、我的音乐、首页、排行榜、MV、歌手、歌曲、专辑等页面的展示。
1. 实现自定义音乐播放器，包括缓存播放进度、滚动歌词、播放队列、选取播放进度、快进快退 15s、切换歌曲和模式、控制声音等功能；支持免登录管理播放队列，登录后自动同步歌曲对应状态。<br/>
2. 设计通用组件，复用标签栏、分页、歌曲列表的业务和状态逻辑，项目中复用 4~7 次。<br/>
3. 实现 JWT 鉴权，涉及用户隐私的请求借助 Django 中间件实现 CSRF 验证。<br/>
4. 实现搜索框实时查询并防抖，实现滚动加载事件和音乐播放器按钮的点击事件节流。<br/>
5. 实现全局路由守卫，拦截非法访问并跳转至兜底页。<br/>
6. 封装 axios，使用 Django 框架注册后端接口以处理请求，并操作数据库。<br/>

## 技术栈
### 前端
<img src='https://img.shields.io/badge/React.js-orange' />   <img src='https://img.shields.io/badge/React--router--dom-green' /> <img src='https://img.shields.io/badge/Redux-green' /> <img src='https://img.shields.io/badge/React--redux-green' /> <img src='https://img.shields.io/badge/Redux--toolkit-green' /> <img src='https://img.shields.io/badge/Redux--persist-green' />   
<img src='https://img.shields.io/badge/Antd-blue' /> <img src='https://img.shields.io/badge/Sass-blue' /> <img src='https://img.shields.io/badge/Axios-blue' />

React 框架相关详情可参阅 <a href='https://github.com/Iristectorum-nosense/web-of-music/blob/master/music-front/music/package.json' title='music-front/music/package.json' >music-front/music/package.json</a>

### 后端
<img src='https://img.shields.io/badge/Django-orange' />   <img src='https://img.shields.io/badge/MySQL-green' />

Django 框架建立于 python3.9 环境

## 项目结构及注释
```
.
├─ music-front/music  // 前端文件入口
│  ├─ public
│  ├─ src
│  │  ├─ api  // 前端请求接口
│  │  │  ├─ axios.jsx                    # axios 封装，请求拦截器和响应拦截器
│  │  |  └─ xxx.jsx                      # xxx = ['album', 'home', 'login', 'mv', 'search', 'singer', 'song', 'user']，相关页具体请求
│  │  |
│  │  ├─ component/BeforeEach  // 路由守卫
│  │  |  └─ BeforeEach.jsx
│  │  |
│  │  ├─ router  // 路由配置及组件按需加载
│  │  |  └─ index.jsx
│  │  |
│  │  ├─ source  // 静态资源
│  │  |
│  │  ├─ store  // 共享状态管理
│  │  |  ├─ index.jsx                    # 状态管理配置及数据持久化配置
│  │  |  └─ slice
│  │  |     └─ xxx.jsx                   # xxx = ['login', 'search', 'user']，相关共享状态的具体配置及定义，包括 state、action、reducer
│  │  |
│  │  ├─ utils // 工具函数
│  │  |  ├─ debounce.jsx                 # 防抖
│  │  |  ├─ throttle.jsx                 # 节流
│  │  |  ├─ format.jsx                   # 处理日期、文本等显示格式
│  │  |  └─ staticURL.jsx                # 图片、音乐、视频的请求地址
│  │  |
│  │  ├─ views // 组件
│  │  |  ├─ Common  // 公共
│  │  |  |  ├─ AudioPlayer               # 自定义音乐播放器，包括缓存播放进度、滚动歌词、播放队列、选取播放进度、快进快退 15s、切换歌曲和模式、控制声音等功能；支持免登录管理播放队列，登录后自动同步歌曲对应状态
│  │  |  |  ├─ Hooks  // 可复用组件
│  │  |  |  |  ├─ useTag.jsx             # 标签栏复用组件，标签栏 style 自定义，业务逻辑抽离在 useTag 函数中
│  │  |  |  |  ├─ usePagination          # 分页复用组件，业务逻辑抽离在 usePagination 函数中
│  │  |  |  |  ├─ useSongList            # 歌曲列表复用组件，可选组件的属性：批量操作、分页、歌曲图片、删除按钮，业务逻辑抽离在 useSongList 函数中
│  │  |  |  |  ├─ useBanner              # 轮播图复用组件，业务逻辑抽离在 useBanner 函数中
│  │  |  |  |  ├─ useAlbumList           # 专辑列表复用组件，可选组件的属性：分页、专辑图片，业务逻辑抽离在 useAlbumList 函数中
│  │  |  |  |  └─ useClickNavigator.jsx  # 跳转路由点击事件
│  │  |  |  ├─ Header  // 顶部导航栏
│  │  |  |  |  ├─ Login                  # 用户身份展示的头像及功能
│  │  |  |  |  ├─ Logout                 # 游客身份展示的登录功能，包括邮箱验证码或密码登录、注册和密码重置功能
│  │  |  |  |  ├─ SearchBar              # 实时搜索框，缓存历史记录
│  │  |  |  |  └─ SubNav                 # 子导航栏，包括歌手、排行榜、MV 的路由导航
│  │  |  |  ├─ Footer  // 底部信息
│  │  |  |  ├─ NotFound  // 404 页面
│  │  |  |  └─ Styles  // 公共样式表
│  │  |  ├─ Home  // 首页
│  │  |  ├─ Search  // 搜索展示页
│  │  |  ├─ Singer  // 歌手推荐及标签查询页
│  │  |  ├─ RankList  // 歌曲排行页
│  │  |  ├─ MV  // MV推荐及标签查询页
│  │  |  ├─ SingerDetail  // 歌手详情页
│  │  |  ├─ SongDetail  // 歌曲详情页
│  │  |  ├─ MVDetail  // MV 详情页
│  │  |  ├─ AlbumDetail  // 专辑详情页
│  │  |  ├─ MyMusic  // 我的音乐
│  │  |  ├─ MyMusicCreate  // 我创建的歌单页
│  │  |  ├─ MyMusicLike  // 我喜欢
│  │  |  ├─ MyPlayDetail  // 创建的歌单详情页
│  │  |  └─ MySetting  // 个人信息设置
│  │  |
|  |  ├─ index.js  // React 根组件
│  │  |...
│  │  └─
|  |
│  ├─ .gitignore
│  ├─ package-lock.json
│  ├─ package.json
│  └─ README.md
|
└─ music-end  // 后端文件入口
│  ├─ music
│  |  ├─ settings.py                     # 配置文件，包括跨域配置、数据库连接、中间件使用、邮箱发送配置、请求头配置等
│  |  |...
|  |  └─
|  |
|  ├─ myMusic  // 自定义app
|  |  ├─ migrations  // 数据库迁移文件，可删除
|  |  ├─ models.py                       # 数据模型定义
|  |  ├─ views.py                        # 视图文件，编写请求及操作数据模型
|  |  ├─ urls.py                         # 后端请求接口
|  |  |...
|  |  └─
|  |...
|  └─
|
├─ README.md
└─
```
