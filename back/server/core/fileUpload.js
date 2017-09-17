const _webHttp = require('../webhttp');
const APIError = require('../rest').APIError;
const config = require('../../config');

const { uploadFile } = require('../upload');
const path = require('path');

module.exports = {
    postUpload: async(ctx, next) => {
        // 上传文件请求处理
        let serverFilePath = path.resolve(__dirname, '../../static/uploads'); //该方法直接跳转至上级目录的static。。。
        // 上传文件事件
        return uploadFile(ctx, {
            fileType: 'album', // common or album 设置文件存放类别
            path: serverFilePath
        }).then(function(result) {
            ctx.rest({
                result: result
            });
        }, function(error) {
            console.log("上传失败" + error);
        });
    }
}