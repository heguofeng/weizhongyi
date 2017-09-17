const _webHttp = require('../webhttp');
const APIError = require('../rest').APIError;
const config = require('../../config');
//云之讯
var ucpaasClass = require('ucpaas-sdk/lib/ucpaasClass');
var ucpaas = new ucpaasClass(config.ucpaas_options);


module.exports = {
    postAdmin: async(ctx, next) => {
        var postDoc = {
                "sample": "student_admin"
            },
            token = ctx.request.body.token,
            security_code = ctx.request.body.security_code;
        //先判断验证码是否正确
        if (security_code == ctx.session.param) {
            return _webHttp.httpPost(`${config.serverIp}/record?token=${token}`, JSON.stringify(postDoc)).then(function(data) {
                ctx.rest({
                    success: true,
                    result: JSON.parse(data).data.id
                });
                console.log("新建管理员" + JSON.parse(data).data.id);
            });
        } else {
            ctx.rest({
                success: false,
                result: "验证码不正确!"
            });
        }
    },
    putAdminById: async(ctx, next) => {
        console.log(`正在执行修改管理员操作：${ctx.params.id}`);
        var id = ctx.params.id,
            token = ctx.request.body.token;
        var putDoc = {
            "$set": {
                "phone": ctx.request.body.phone,
                "password": ctx.request.body.password,
                "security_code": ctx.request.body.security_code,
            }
        }
        return _webHttp.httpPut(`${config.serverIp}/record/${id}?token=${token}&${config.sample_A}`, JSON.stringify(putDoc)).then(function(data) {
            ctx.rest({
                result: JSON.parse(data).data.attributes
            });
        }, function(error) {
            console.log("修改数据失败：" + error);
        });
    },
    postSecurityCode: async(ctx, next) => {
        var phone = ctx.request.body.phone;
        console.log("获取验证码:" + phone);
        //生成随机数
        var num = "";
        for (let i = 0; i < 6; i++) {
            num += Math.floor(Math.random() * 10);
        }
        //短信验证码
        var appId = '82376abb35ee46e3938f84477ec06e9d';
        var to = phone;
        var templateId = '136720'; //模板id
        var param = parseInt(num); //验证码
        ctx.session.param = param;
        ucpaas.templateSMS(appId, to, templateId, param, function(status, responseText) {
            console.log('code: ' + status + ', text: ' + responseText);
        });
        ctx.rest({
            result: '获取成功，已发送至您手机'
        });
    },
    postLogin: async(ctx, next) => {
        var postDoc = {
            phone: ctx.request.body.phone,
            password: ctx.request.body.password
        };
        var _postDoc = JSON.stringify(postDoc);
        return _webHttp.httpGet(`${config.serverIp}/records?${config.sample_A}&wjson=${_postDoc}`).then(function(res) {
            var _res = JSON.parse(res); //转json为字符串判断是否得到值
            if (_res.data.length == 0) {
                ctx.rest({
                    success: false,
                    result: "账号或密码错误"
                });
            } else {
                //设置cookies
                ctx.cookies.set("phone", postDoc.phone, {
                    // domain: 'localhost', // 写cookie所在的域名
                    // path: '/index', // 写cookie所在的路径
                    maxAge: 30 * 60 * 1000, // cookie有效时长
                    httpOnly: false, // 是否只用于http请求中获取
                    overwrite: false // 是否允许重写
                });
                ctx.session.phone = postDoc.phone;
                ctx.rest({
                    success: true,
                    result: _res.data[0].data.attributes,
                });
            }
        }, function(error) {
            console.log("查询管理员：" + error);
        });
    },
}