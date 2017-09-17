var app = new Vue({
    el: '#app',
    data: {
        token: "",
        sample: "student",
        students: [],
        student: [],
        addStudent: {
            college: "信息与工程学院",
            sex: "男",
            name: "何小凤",
            age: "20",
            student_id: "88888888"
        },
        showFlag: false, //新建
        showFlag2: false, //修改
        checkAll: false, //是否都已选中
        noData: false,
        regFlag: false,
        loginFlag: false,
        admin: {
            phone: "",
            password: "",
            security_code: ""
        },
        getSecrityCode: "获取验证码",
        codeBtn: true

    },
    //加载完vue后执行，类似于jquery的ready
    mounted: function() {
        var _this = this;
        this.$nextTick(function() {
            _this.newLoad();
            this.websocket();
        });
    },
    methods: {
        //首次加载
        newLoad: function() {
            var ii = layer.msg("加载数据中", { icon: 16 }); //加载中。。。
            var _this = this;
            // 获取token值
            axios.get('/api/token').then(function(response) {
                _this.token = response.data.result;
            }).catch(function(error) {
                console.log("获取token失败：" + error);
            });
            //获取学生
            axios.get('/api/students').then(function(response) {
                let studentArr = []; //重置
                let data = response.data.result;
                // var _Date = JSON.parse(response.data.students);
                data.forEach(function(item) {
                    var Data = {
                        _id: item._id,
                        sex: item.sex,
                        name: item.name,
                        age: item.age,
                        college: item.college,
                        student_id: item.student_id
                    }
                    studentArr.push(Data);
                });
                _this.students = studentArr;
                layer.close(ii); //关闭加载
                //判断一下是否没有数据
                if (_this.students.length == 0) {
                    _this.noData = true;
                } else {
                    _this.noData = false;
                }
            }).catch(function(error) {
                console.log("获取学生失败：" + error);
            });
        },
        //添加学生
        submitForm: function() {
            var _this = this;
            axios.post('/api/student', { "token": _this.token }).then(function(response) {
                var id = response.data.result; //得到新建记录的id
                _this.addStudent.token = _this.token;
                axios.put('/api/student/' + id, _this.addStudent).then(function(response) {
                    _this.showFlag = false;
                    layer.msg("已成功添加学生： " + response.data.result.name, { icon: 1, time: 1500 });
                }).catch(function(err) {
                    console.log(err);
                });
            }).catch(function(err) {
                console.log(err);
            });
        },
        // 点击修改按钮1，查询某位信息
        getStudent: function(id) {
            var _this = this;
            _this.showFlag2 = true;
            axios.get('/api/student/' + id).then(function(response) {
                var Data = response.data.result;
                var _Data = {
                    _id: Data._id,
                    college: Data.college,
                    name: Data.name,
                    sex: Data.sex,
                    age: Data.age,
                    student_id: Data.student_id
                };
                _this.student = _Data;
            }).catch(function(err) {
                alert(err);
            });
        },
        //正式进行修改操作修改2
        putStudent: function(id) {
            var _this = this;
            //将token放进student里一起传过去
            var msg = layer.msg('正在修改。。。', { icon: 16 });
            _this.student.token = _this.token;
            axios.put('/api/student/' + id, _this.student).then(function(response) {
                layer.close(msg);
                layer.msg('已成功修改', { icon: 1, time: 1500 });
                _this.showFlag2 = false;
            }).catch(function(err) {
                alert(err);
            });
        },

        //点击删除
        deleteStudent: function(id) {
            var _this = this;
            layer.confirm('确定删除吗？?', { icon: 3, title: '提示' }, function(index) {
                axios.delete('/api/student/' + _this.token + '/' + id).then(function(response) {
                    // _this.newLoad();
                    layer.msg("已删除学生： " + response.data.result.name, { icon: 1, time: 1500 });
                }).catch(function(err) {
                    alert(err);
                })
                layer.close(index);
            });

        },
        //删除所有学生
        deleteAll: function() {
            var _this = this;
            var token = _this.token;
            axios.delete('/api/delAllStudents/' + token).then(function(response) {
                _this.newLoad();
                layer.msg("已删除所有学生", { icon: 1, time: 1500 });
            }).catch(function(err) {
                alert("删除失败" + err);
            });
        },
        //选择学生
        selectStudent: function(student) {
            if (typeof student.checked == "undefined") {
                this.$set(student, 'checked', true);
            } else {
                student.checked = !student.checked;
            }
            this.isCheckAll(); //每次判断是否全选
        },
        //全选
        selectAll: function(isCheck) {
            this.checkAll = isCheck; //直接给全选参数赋值
            this.students.forEach(function(item) {
                if (typeof item.checked == "undefined") {
                    Vue.set(item, "checked", isCheck); //这里传入的应该是isCheck，而不是true
                } else {
                    item.checked = isCheck;
                }
            });
        },
        //判断是否全选
        isCheckAll: function() {
            let flag = true;
            this.students.forEach(function(item) {
                if (!item.checked) {
                    flag = false;
                }
            })
            if (flag) {
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
        },
        //删除已选中
        deleteSelect: function() {
            var _this = this;
            var ids = [];
            layer.confirm('确定删除吗？?', { icon: 3, title: '提示' }, function(index) {
                _this.students.forEach(function(item) {
                    if (item.checked == true) {
                        ids.push(item._id);
                    }
                });

                if (ids.length == 0) {
                    alert("请先选择要删除的学生");
                } else {
                    console.log(ids);
                    axios({
                            method: "delete",
                            url: '/api/delSelect/' + _this.token,
                            data: {
                                ids: ids
                            }
                        })
                        .then(function(response) {
                            layer.msg(response.data.result, { icon: 1, time: 1500 });
                            // _this.newLoad();
                        }).catch(function(err) {
                            alert(err);
                        });
                }
                layer.close(index);
            });
        },
        //订阅消息--学生数据变化
        websocket: function() {
            var _this = this;
            axios.get('/api/token').then(function(response) {
                _this.token = response.data.result;
                var ws = new WebSocket(`ws://${location.hostname}:3000`);
                ws.onopen = function() {
                    console.log("打开了ws")
                    ws.send(_this.token);
                };
                ws.onmessage = function() {
                    console.log('收到了消息')
                    app.newLoad();
                };
            }).catch(function(error) {
                console.log("出错：" + error);
            });
        },
        //点击遮罩层关闭弹窗
        closeBox: function() {
            this.showFlag = false;
            this.showFlag2 = false;
            this.regFlag = false;
            this.loginFlag = false;
        },
        //获取验证码
        getCode: function() {
            var _this = this;
            var wait = 60;
            //60s倒计时
            function time() {
                if (wait == 0) {
                    _this.getSecrityCode = "获取验证码";
                    wait = 60;
                    _this.codeBtn = true;
                } else {
                    _this.getSecrityCode = "重新获取" + wait + "秒";
                    _this.codeBtn = false;
                    wait--;
                    setTimeout(function() {
                        time();
                    }, 1000);
                }
            }
            axios.post("/api/security_code", { "phone": _this.admin.phone }).then(function(response) {
                // console.log(response.data.result);
                time(); //倒计时
            }).catch(function(error) {
                console.log("获取验证码失败" + error);
            })
        },
        //注册
        signIn: function() {
            var _this = this;
            axios.post('/api/admin', { "token": _this.token, "security_code": _this.admin.security_code }).then(function(response) {
                if (response.data.success) {
                    var id = response.data.result; //得到新建记录的id
                    _this.admin.token = _this.token;
                    axios.put('/api/admin/' + id, _this.admin).then(function(response) {
                        _this.regFlag = false;
                        layer.msg("已成功注册账号： " + response.data.result.phone, { icon: 1, time: 1500 });
                    }).catch(function(err) {
                        alert("注册失败" + err);
                    });
                } else {
                    layer.msg(response.data.result,
                        function() {
                            _this.admin.security_code = ""; //清空输入框
                        });
                }
            }).catch(function(err) {
                console.log(err);
            });
        },
        //登录
        loginIn: function() {
            var _this = this;
            axios.post('/api/admin/login', _this.admin).then(function(response) {
                if (response.data.success == true) {
                    console.log("登陆成功")
                } else {
                    console.log("登陆失败")
                }
            }).catch(function(error) {
                console.log("登陆失败" + error)
            });
        }
    }
});
window.app = app;