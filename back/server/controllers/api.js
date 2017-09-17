const upload = require('../core/fileUpload')
const index = require('../core/index');
const login = require('../core/login');

module.exports = {
    //获取token
    'GET /api/token': index.getToken,
    //获取所有学生
    'GET /api/students': index.getStudents,
    //新建学生
    'POST /api/student': index.postStudent,
    //删除学生
    'DELETE /api/student/:token/:id': index.deleteStudentById,
    //修改信息
    'PUT /api/student/:id': index.putStudentById,
    //查询某位学生
    'GET /api/student/:id': index.getStudentById,
    'DELETE /api/delAllStudents/:token': index.deleteAllStudents,
    'DELETE /api/delSelect/:token': index.deleteSelect,
    //注册管理员1新建
    'POST /api/admin': login.postAdmin,
    //注册管理员2修改
    'PUT /api/admin/:id': login.putAdminById,
    //获取验证码
    'POST /api/security_code': login.postSecurityCode,
    //登录
    'POST /api/admin/login': login.postLogin,
    //上传文件
    'POST /api/upload': upload.postUpload,
};