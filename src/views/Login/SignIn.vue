<template>
  <div>
    <div class="bg">
      <img src="/static/images/background.jpg" alt="背景" width="100%" height="100%">
    </div>
    <div class="main login-container">
      <el-form :model="form" :rules="rule" ref="form" label-position="right" label-width="80px">
        <h2 class="title">账号注册</h2>
        <el-form-item prop="phone" label="手机号">
          <el-input type="text" v-model="form.phone" auto-complete="off" placeholder="请输入注册手机号码" required></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密 码">
          <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="password2" label="确认密码">
          <el-input type="password" v-model="form.password2" auto-complete="off" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item prop="security_code" label="验证码">
          <el-input type="text" v-model="form.security_code" auto-complete="off" placeholder="请输入验证码" style="width:45%;float:left;"></el-input>
          <el-button type="primary" @click.native.prevent="getCode" :loading="logining" style="width:53%;float:right;" :disabled=codeBtn>{{getSecrityCode}}</el-button>
        </el-form-item>
        <el-form-item style="width:100%;" label-width="0">
          <el-button type="primary" style="width:100%;" @click.native.prevent="signIn" :loading="logining2">注 册</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="text" @click="goLogin">前往登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    //自定义验证规则
    //确认密码
    var validatePass = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致！"))
      } else {
        callback()
      }
    };
    //确认是否已注册
    var validatePhone = (rule, value, callback) => {
      this.axios.post('/api/user-phone',{phone:value}).then(res=>{
        if (res.data.result.length!=0) {
          callback(new Error("该账号已注册"))
        } else {
          callback()
        }
      },error=>{

      });
    };
    return {
      token: '',
      logining: false, //获取验证码的
      logining2: false,
      form: {
        phone: '15888274549',
        password: '123456',
        password2: '123456',
        security_code: ''
      },
      rule: {
        phone: [
          { required: true, message: '请输入手机号码！', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位数字手机号！', trigger: 'blur' },
          {validator:validatePhone,trigger:'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        password2: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
      },
      getSecrityCode: "获取验证码",
      codeBtn: false,//控制验证码按钮disabled
    };
  },
  mounted: function() {
    this.$nextTick(()=> {
      this.newLoad();
    });
  },
  methods: {
    //首次加载
    newLoad: function() {
      // 获取token值
      this.axios.get('/api/token').then((response)=> {
        this.token = response.data.result;
      },(error) =>{
        this.message.error("获取token失败：" + error);
        console.log("获取token失败：" + error)
      });
    },
    //获取验证码
    getCode: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.logining = true;
          var wait = 60;
          //60s倒计时
          var time=()=> {
            if (wait == 0) {
              this.getSecrityCode = "获取验证码";
              wait = 60;
              this.codeBtn = false;
            } else {
              this.getSecrityCode = "重新获取(" + wait + ")秒";
              this.codeBtn = true;
              wait--;
              setTimeout(()=> {
                time();
              }, 1000);
            }
          };
          this.axios.post("/api/security_code", { "phone": this.form.phone }).then((response)=> {
            this.logining = false;
            time(); //倒计时
          },(error)=> {
            console.log("获取验证码失败" + error);
          });
        } else {
          console.log('表单验证没通过!!');
          return false;
        }
      });
    },
    //前往登录
    goLogin: function() {
      this.$router.push({name:'LoginIn',params:{phone:this.form.phone,password:this.form.password}});
    },
    //注册
    signIn: function(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.logining2 = true;
          this.axios.post('/api/user', { "token": this.token, "security_code": this.form.security_code }).then((response)=> {
            this.logining2 = false;
            if (response.data.success) {
              var id = response.data.result; //得到新建记录的id
              this.form.token = this.token;//把token放进form对象里传递
              this.axios.put('/api/user/' + id, this.form).then((response)=> {          
                this.$message.success("已成功注册账号： " + response.data.result.phone+"。3s后自动跳转至登录页面...");
                setTimeout(() =>{
                  this.$router.push({name:'LoginIn',params:{phone:this.form.phone,password:this.form.password}});
                }, 3000);
                
              },(err) =>{
                this.$message.error("注册失败,请稍后重试" + err);
              });
            } else {
              this.$message.error(response.data.result);
              this.form.security_code = ""; //清空输入框
            }
          },(err)=> {
            console.log(err);
          });
        } else {
          console.log('表单验证没通过!!');
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}

.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  /* 内容裁剪到内边距框 */
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.title {
  margin: 0px auto 20px auto;
  text-align: center;
  color: #505458;
}

</style>




