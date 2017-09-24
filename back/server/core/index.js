const _webHttp = require('../webhttp');
const APIError = require('../rest').APIError;
const config = require('../../config');

module.exports = {
    getToken: async(ctx, next) => {
        //异步方法一  async/await，同步形式
        return _webHttp.httpGet(`${config.serverIp}/token?user=admin&password=123456`).then(data => {
            let _data = JSON.parse(data).data.attributes.token; //为了隐藏data里的服务器ip，做一步数据处理
            ctx.rest({
                result: _data
            });
        }, error => {
            console.error("出错了：", error);
        });
    },
    //获取学生
    getUsers: async(ctx, next) => {
        return _webHttp.httpGet(`${config.serverIp}/records?${config.sample_U}`).then(data => {
            let _data = JSON.parse(data).data;
            let dataArr = [];
            if (_data.length == 0) {
                ctx.rest({
                    result: _data
                });
            }
            _data.forEach((item) => {
                let dataJson = {
                    _id: item.data.attributes._id,
                    phone: item.data.attributes.phone,
                    password: item.data.attributes.password,
                };
                dataArr.push(dataJson);
            });
            ctx.rest({
                result: dataArr
            });
        }, error => {
            console.error("读取学生数据出错了：", error);
        });
    },
    postStudent: async(ctx, next) => {
        var postDoc = {
                "sample": "student"
            },
            token = ctx.request.body.token;
        return _webHttp.httpPost(`${config.serverIp}/record?token=${token}`, JSON.stringify(postDoc)).then(data => {
            let _data = JSON.parse(data).data.id; //传递ID
            ctx.rest({
                result: _data
            });
        }, error => {
            console.log("新建出错了：" + error)
        });
    },
    deleteUserById: async(ctx, next) => {
        // console.log(`正在执行删除学生 ${ctx.params.id}`);
        var id = ctx.params.id;
        var token = ctx.params.token;
        return _webHttp.httpDelete(`${config.serverIp}/record/${id}?token=${token}&${config.sample_U}`).then(data => {
            let _data = "删除成功"
            ctx.rest({
                result: _data
            });
        }, error => {
            console.log("删除数据失败：" + error);
        });
    },
    putUserPswById: async(ctx, next) => {
        console.log(`正在执行修改学生：${ctx.params.id}`);
        var id = ctx.params.id,
            token = ctx.request.body.token;
        var putDoc = {
            "$set": {
                "password": ctx.request.body.password
            }
        }
        return _webHttp.httpPut(`${config.serverIp}/record/${id}?token=${token}&${config.sample_U}`, JSON.stringify(putDoc)).then(data => {
            let _data = JSON.parse(data).data.attributes;
            ctx.rest({
                result: _data
            });
        }, error => {
            console.log("修改数据失败：" + error);
        });
    },
    getUserById: async(ctx, next) => {
        var id = ctx.params.id;
        return _webHttp.httpGet(`${config.serverIp}/record/${id}?${config.sample_U}`).then(data => {
            let _data = JSON.parse(data).data.attributes;
            ctx.rest({
                result: _data
            });
        }, error => {
            console.log("查询一条数据失败：" + error);
        });
    },
    getUserByPhone: async(ctx, next) => {
        var postDoc = {
            phone: ctx.request.body.phone
        };
        return _webHttp.httpGet(`${config.serverIp}/records?${config.sample_U}&wjson=${JSON.stringify(postDoc)}`).then(data => {
            let _data = JSON.parse(data).data;
            console.log(data.length)
            ctx.rest({
                result: {
                    length: _data.length,
                    id: _data[0].data.id
                }

            });
        }, error => {
            console.log("查询一条数据失败：" + error);
        });
    },
    putUserInfoById: async(ctx, next) => {
        var id = ctx.params.id,
            token = ctx.request.body.token;
        var putDoc = {
            "$set": {
                "name": ctx.request.body.name,
                "sex": ctx.request.body.sex,
                "birth": ctx.request.body.birth
            }
        }
        return _webHttp.httpPut(`${config.serverIp}/record/${id}?token=${token}&${config.sample_U}`, JSON.stringify(putDoc)).then(data => {
            let _data = JSON.parse(data).data.attributes;
            ctx.rest({
                result: _data
            });
        }, error => {
            console.log("修改数据失败：" + error);
        });
    }

}