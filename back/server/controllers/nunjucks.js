module.exports = {
    'GET /': async(ctx, next) => {
        ctx.render('index.html', {
            title: "学生管理系统"
        });
    },
    'GET /upload': async(ctx, next) => {
        ctx.render('upload.html', {
            title: "学生管理系统上传"
        });
    }
};