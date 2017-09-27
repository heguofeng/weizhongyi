const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    var host = 'www.www.wmuoldstar.cn'
} else {
    var host = '127.0.0.1'
}
const config = {
    port: 3000,
    host: host,
    serverIp: "http://106.14.145.165:3333",
    sample_U: "sample=web_users", //用户表
    sample_A: "sample=student_admin",
    ucpaas_options: {
        accountsid: '4d34aed70a30405c8aba9a0d89330798',
        token: '471416c20b89d075cdc90a30e0a74d9b',
    }
}
module.exports = config;