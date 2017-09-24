<template>
  <div>
    <div class="bg">
      <img :src="this.img_url" alt="背景" width="100%" height="100%">
    </div>
    <div class="login-container">
      <el-form :model="form" :rules="rule" ref="form" label-position="right" label-width="100px">
        <h2 class="title">找回密码</h2>
        <el-form-item prop="phone" label="手机号">
          <el-input type="text" v-model="form.phone" auto-complete="off" placeholder="请输入注册手机号码" required></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input type="text" v-model="form.security_code" auto-complete="off" placeholder="请输入验证码" style="width:45%;float:left;"></el-input>
          <el-button type="primary" @click.native.prevent="getCode" :loading="logining" style="width:53%;float:right;" :disabled=codeBtn>{{getSecrityCode}}</el-button>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="password2" label="确认新密码">
          <el-input type="password" v-model="form.password2" auto-complete="off" placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" style="width:100%;" @click.native.prevent="updatePsw" :loading="logining2">修改密码</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="text" @click="goLogin">前往登录</el-button>
      </div>
    </div>
  </div>
</template>

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
  text-align: center;
  color: #505458;
}
</style>

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
    return {
      img_url:'',//背景图片路径
      token: '',//token
      logining: false, //获取验证码的
      logining2: false,//修改密码的loading
      form: {
        phone: '',
        password: '',
        password2: '',
        security_code: ''
      },
      rule: {
        phone: [
          { required: true, message: '请输入手机号码！', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位数字手机号！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        password2: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      getSecrityCode: "获取验证码",
      codeBtn: false,//控制验证码按钮disabled
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getToken();
      this.img_url= this.$route.params.img_url;
      this.form.phone=this.$route.params.phone;
    });
  },
  methods: {
    goLogin: function() {
      this.$router.push({ name: 'LoginIn' });
    },
    // 获取token值
    getToken: function() {   
      this.axios.get('/api/token').then((response)=> {
        this.token = response.data.result;
      },(error)=> {
        this.$message.error("获取token失败：" + error);
      });
    },
    //获取验证码
    getCode: function() {;
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
              setTimeout(function() {
                time();
              }, 1000);
            }
          }
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
    updatePsw:function(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.logining2=true;
          this.axios.post('/api/user-phone', { phone: this.form.phone }).then(res => {
            var id=res.data.result.id;
            this.form.token = this.token;
            this.axios.put('/api/user-psw/' + id, this.form).then((response) => {
              this.logining2=false;
              this.$notify({
                title: '更新密码',
                message: '密码已更新成功,3秒后自动跳转至登录页，也可点击直接前往',
                type:'success',
                duration:3000,
                onClose:()=>{
                  this.$router.push({name:'LoginIn',params:{phone:this.form.phone,password:this.form.password}});
                },
                onClick:()=>{
                  this.$router.push({name:'LoginIn',params:{phone:this.form.phone,password:this.form.password}});
                }
            });
            },(err)=> {
              alert(err);
            });
          }, error => {
            alert(error);
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


