const config = {
    port: 3000,
    serverIp: "http://106.14.145.165:3333",
    sample_U: "sample=web_users", //用户表
    sample_A: "sample=student_admin",
    //手机短信配置  目前为我个人账户，需要公司建立一个新账户
    ucpaas_options: {
        accountsid: '4d34aed70a30405c8aba9a0d89330798',
        token: '471416c20b89d075cdc90a30e0a74d9b',
    }
}
module.exports = config;