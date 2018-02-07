
# 目录  
    .  
    |——build    //vue-cli 生成，用于webpack监听、构建  
    │   ├── build.js  
    │   ├── check-versions.js  
    │   ├── dev-client.js  
    │   ├── dev-server.js
    │   ├── utils.js
    │   ├── webpack.base.conf.js
    │   ├── webpack.dev.conf.js
    │   └── webpack.prod.conf.js
    ├── config // vue-cli 生成自己加的一些配置文件
    │   ├── default.conf
    │   ├── dev.env.js
    │   ├── index.js
    │   └── prod.env.js
    ├── dist // Vue build 后的文件夹
    │   ├── index.html // 入口文件
    │   └── static // 静态资源
    ├── server // Koa后端，用于提供Api
    |   |——controllers  //restApi控制器
    |   |   └──api.js      // controller-控制器
    |   |——core   //restApi核心文件
    |   |   |——fileUpload.js    //文件上传 rest-Api
    |   |   |——index.js      //index事件 rest-Api
    |   │   └── login.js     // 登录注册事件 rest-Api
    |   |——controller.js    //扫描注册controllers
    |   |——rest.js      //支持REST的middleware
    |   |——static-files.js      //支持静态文件的middleware
    |   |——upload.js    //文件上传middleware
    |   └── webhttp.js   //访问服务器的ajax方法封装
    |——src      //Vue前端 vue-cli 生成&自己添加的utils工具类
    |   |——assets  //相关静态文件资源存放
    |   |——styles  //css样式存放
    |   |——views  //组件存放
    |   |   |——Login    //登录注册相关组件
    |   |   |——nav1     //home侧边栏导航1
    |   |   |——services     //服务
    |   |   |——Home.vue     //后台管理员主页面
    |   |   |——Main.vue     //前台主页面
    |   |   |——ExistServices.vue   //已开通服务
    |   |   |——PayServices.vue     //未开通服务
    |   |——App.vue  //主文件
    |   |——mian.js  //引入Vue等资源、挂载Vue的入口js
    |   └── routes.js //路由
    |——static   // 静态文件存放 vue-cli自己生成
    |——app.js   //后端node主入口，Koa入口文件
    |——index.html  
    |——package.json  //项目描述文件
    └── web_config.js   //服务器相关配置（服务器地址端口或数据库名称等变动需修改）

# 运行环境： 
    1.Node（v8.2.1）、Vue(v2.8.2)  
    2.反向代理可使用nginx：（可添加以下代码至nginx.conf文件），可实现无需在地址栏后面加端口号访问
        # 处理WebSocket连接:
            location ^~ /ws/ {
                proxy_pass         http://127.0.0.1:3000;
                proxy_http_version 1.1;
                proxy_set_header   Upgrade $http_upgrade;
                proxy_set_header   Connection "upgrade";
            }

        # 其他所有请求:
        location / {
            proxy_pass       http://127.0.0.1:3000;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

# 项目用到的依赖项
    Vue.js(v2.4.2)
    Vue-router: ^2.7.0
    Axios(0.16.2)
    ElementUi(1.4.4)
    Koa2(2.0.1)
    Koa-router(7.0.0)/koa-static/koa-session2/koa-bodyparser/koa-body等一系列koa中间件
    ucpaas-sdk(1.0.1) //手机短信
    ws(3.1.0)
    xmlhttprequest(1.8.0)
    其他依赖项具体可查看package.json文件

# 如何启动项目？
    1安装淘宝镜像cnpm
    npm install -g cnpm --registry=https://registry.npm.taobao.org

    2安装依赖
    cnpm install

    3启动项目dev开发模式/build构建项目
    npm run dev/npm run build

    4 启动服务
    npm run server

    5 本地直接访问127.0.0.1:3000即可，若配置了nginx，也可直接访问127.0.0.1

# 开发工具：VSCode（可根据习惯自行挑选）  开发环境：win10

# 注意事项：
    1.若发现直接输入地址无法访问，请先检查是否登录，许多页面需登录才可浏览，该判断写在main.js里面
    2.网站架构
        App
        |——后台登录Admin
        |		└──主页Center
        |——前台登录LoginIn
        |		└──个人中心Main
        |			|——未开通服务payservices
        |			|——已开通服务existservices
        |			|	|——我的资料MyInfo
        |			|	|	|——修改修改查看
        |			|	|	|——头像修改
        |			|	|	└──密码修改
        |           |   └──预约挂号  
        |			└──退出
        |——注册SignIn
        └──找回密码ForgetPsw
    3.未完成模块：
        1.预约挂号的医院科室信息都需要从数据库导，目前还没有建立相关数据。
        2.预约挂号需要实名认证
        3.预约挂号目前只做了界面，功能代码还未编写（前后端及数据库）
    4.目前短信验证码系统使用的是本人个人的云之讯，请尽快注册一个公司账户。
