const _webHttp = require('../webhttp');
const APIError = require('../rest').APIError;
const config = require('../../web_config');

const { uploadFile } = require('../upload');
const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';


module.exports = {
    //上传头像
    postUpload: async(ctx, next) => {
        // 上传文件请求处理
        //判断开发环境

        if (!isProduction) {
            var serverFilePath = path.resolve('static', 'uploads');
        } else {
            var serverFilePath = path.resolve('dist', 'static', 'uploads');
        }

        // 上传文件事件
        let phone = ctx.request.headers.phone,
            token = ctx.request.headers.token,
            id = ctx.request.headers.id;
        return uploadFile(ctx, {
            fileType: phone, // common or avatar 设置文件存放目录,每个人有单独一个以手机号命名文件
            path: serverFilePath
        }).then((result) => {
            //将图片路径保存至数据库
            var putDoc = {
                "$set": {
                    avatar: result.data.pictureUrl
                }
            }
            return _webHttp.httpPut(`${config.serverIp}/record/${id}?token=${token}&${config.sample_U}`, JSON.stringify(putDoc)).then(data => {
                let _data = JSON.parse(data).data.attributes;
                ctx.rest({
                    result: _data,
                    uploadResult: result
                });
            }, error => {
                console.log("修改数据失败：" + error);
            });
        }, (error) => {
            console.log("上传失败" + error);
        });
    }
}