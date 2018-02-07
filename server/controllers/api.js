const upload = require('../core/fileUpload')
const index = require('../core/index');
const login = require('../core/login');

module.exports = {
    //获取token
    'GET /api/token': index.getToken,
    //获取所有用户
    'GET /api/users': index.getUsers,
    //查询某位用户
    'GET /api/user/:id': index.getUserById,
    //查找是否注册重复账号
    'POST /api/user-phone': index.getUserByPhone,
    //删除用户
    'DELETE /api/user/:token/:id': index.deleteUserById,
    //修改用户密码
    'PUT /api/user-psw/:id': index.putUserPswById,
    //修改用户
    'PUT /api/user-info/:id': index.putUserInfoById,




    //注册用户新建
    'POST /api/user': login.postUser,
    //注册用户修改
    'PUT /api/user/:id': login.putUserById,
    //获取验证码
    'POST /api/security_code': login.postSecurityCode,
    //用户登录
    'POST /api/user/login': login.postLogin,

    //上传文件
    'POST /api/upload': upload.postUpload,
};