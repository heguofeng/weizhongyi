<template>
<div>
  <div class="bg">
    <img src="../assets/images/background.jpg" alt="背景" width="100%" height="100%">
  </div>
    <div class="login-container">
      <el-form :model="form" :rules="rule" ref="form" label-position="right" label-width="80px">
        <h2 class="title">系统登录</h2>
        <el-form-item prop="phone" label="手机号">
          <el-input type="text" v-model="form.phone" auto-complete="off" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
          <el-button @click="goForgetPsw" type="text" class="forget">忘记密码</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" style="width:100%;" @click.native.prevent="loginIn" :loading="logining">登录</el-button>
        </el-form-item>
        <div style="text-align:center">
          <el-button type="text" @click="goAdmin" class="admin">我是管理员</el-button>
          <el-button type="text" @click="goSign">前往注册</el-button>
        </div>
      </el-form>
      
    </div>
 </div>
</template>

<style scoped>
.bg{ 
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

.remember {
  float: left;
}
.forget{
  float: right;
  margin-right: 5px;
}
.admin{
  position: absolute;
  top: 0;
  left: 13px;
  color: #FF4949;
}

</style>

<script>
export default {
  data() {
    return {
      logining: false,
      form: {
        phone: '15888274549',
        password: '123456'
      },
      rule: {
        phone: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      },
      checked: true
    };
  },
  methods: {
    //提交
    loginIn(ev) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.logining = true;
          this.axios.post('/api/admin/login', this.form).then((response)=>{
            this.logining = false;
            if (response.data.success == true) {
              localStorage.setItem('user',JSON.stringify(this.form));
                this.$notify({
                  title: '成功',
                  message: '登陆成功啦',
                  type:'success',
                  duration:1000,
                  onClose:()=>{
                    this.$router.push({name:'Main'});
                  }
                });
            } else {
                this.$notify.error({
                  title: '失败',
                  message: '登录失败',
                });
            }
          }).catch((error)=>{
              console.log("登陆失败" + error)
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    goSign: function() {
      this.$router.push({ name: 'SignIn' });
    },
    goForgetPsw: function() {
      this.$router.push({ name: 'ForgetPsw',params:{img_url:"../assets/images/background.jpg"} });
    },
    goAdmin:function(){
      this.$router.push({name:'Admin'});
    },

        
  }
}
</script>


