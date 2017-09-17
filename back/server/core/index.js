const _webHttp = require('../webhttp');
const APIError = require('../rest').APIError;
const config = require('../../config');

module.exports = {
    getToken: async(ctx, next) => {
        //异步方法一  async/await，同步形式
        return _webHttp.httpGet(`${config.serverIp}/token?user=admin&password=123456`).then(function(data) {
            let _data = JSON.parse(data).data.attributes.token; //为了隐藏data里的服务器ip，做一步数据处理
            ctx.rest({
                result: _data
            });
        }, function(error) {
            console.error("出错了：", error);
        });
    },
    getStudents: async(ctx, next) => {
        return _webHttp.httpGet(`${config.serverIp}/records?${config.sample_S}`).then(function(data) {
            let _data = JSON.parse(data).data;
            let dataArr = [];
            if (_data.length == 0) {
                ctx.rest({
                    result: _data
                });
            }
            _data.forEach(function(item) {
                let dataJson = {
                    _id: item.data.attributes._id,
                    sex: item.data.attributes.sex,
                    name: item.data.attributes.name,
                    age: item.data.attributes.age,
                    college: item.data.attributes.college,
                    student_id: item.data.attributes.student_id
                };
                dataArr.push(dataJson);
            });
            ctx.rest({
                result: dataArr
            });
        }, function(error) {
            console.error("读取学生数据出错了：", error);
        });
    },
    postStudent: async(ctx, next) => {
        var postDoc = {
                "sample": "student"
            },
            token = ctx.request.body.token;
        return _webHttp.httpPost(`${config.serverIp}/record?token=${token}`, JSON.stringify(postDoc)).then(function(data) {
            let _data = JSON.parse(data).data.id; //传递ID
            ctx.rest({
                result: _data
            });
        }, function(error) {
            console.log("新建出错了：" + error)
        });
    },
    deleteStudentById: async(ctx, next) => {
        console.log(`正在执行删除学生 ${ctx.params.id}`);
        var id = ctx.params.id;
        var token = ctx.params.token;
        return _webHttp.httpDelete(`${config.serverIp}/record/${id}?token=${token}&${config.sample_S}`).then(function(data) {
            let _data = JSON.parse(data).data.attributes;
            // console.log("删除数据为： " + data);
            ctx.rest({
                result: _data
            });
        }, function(error) {
            console.log("删除数据失败：" + error);
        });
    },
    putStudentById: async(ctx, next) => {
        console.log(`正在执行修改学生：${ctx.params.id}`);
        var id = ctx.params.id,
            token = ctx.request.body.token;
        var putDoc = {
            "$set": {
                "college": ctx.request.body.college,
                "name": ctx.request.body.name,
                "sex": ctx.request.body.sex,
                "age": ctx.request.body.age,
                "student_id": ctx.request.body.student_id
            }
        }
        return _webHttp.httpPut(`${config.serverIp}/record/${id}?token=${token}&${config.sample_S}`, JSON.stringify(putDoc)).then(function(data) {
            let _data = JSON.parse(data).data.attributes;
            ctx.rest({
                result: _data
            });
        }, function(error) {
            console.log("修改数据失败：" + error);
        });
    },
    getStudentById: async(ctx, next) => {
        var id = ctx.params.id;
        return _webHttp.httpGet(`${config.serverIp}/record/${id}?${config.sample_S}`).then(function(data) {
            let _data = JSON.parse(data).data.attributes;
            ctx.rest({
                result: _data
            });
        }, function(error) {
            console.log("查询一条数据失败：" + error);
        });
    },
    deleteAllStudents: async(ctx, next) => {
        console.log("删除所有学生");
        var token = ctx.params.token;
        return _webHttp.httpDelete(`${config.serverIp}/records?token=${token}&${config.sample_S}`).then(function(data) {
            ctx.rest({
                result: "删除所有数据成功"
            });
        }, function(error) {
            console.log("删除所有学生出错：" + error);
        });
    },
    deleteSelect: async(ctx, next) => {
        console.log("删除所选中的学生");
        var token = ctx.params.token,
            ids = ctx.request.body.ids;
        ids.forEach(function(id) {
            _webHttp.httpDelete(`${config.serverIp}/record/${id}?token=${token}&${config.sample_S}`).then(function(data) {
                console.log("删除成功！")
            }, function(error) {
                console.log("删除所选中的学生失败" + error);
            });
        });
        ctx.rest({
            result: "已删除所选中的学生"
        });
    }
}