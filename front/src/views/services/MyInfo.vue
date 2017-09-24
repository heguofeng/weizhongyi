<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="我的资料" name="first">
      <el-form :model="form" label-width="80px" style="width:30%;" ref="updateInfoForm">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" readonly placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio class="radio" v-model="form.sex" label="1">男</el-radio>
          <el-radio class="radio" v-model="form.sex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="出生年月" prop="birth">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button type="success" :loading="updateInfoLoading" @click.native="updateInfo(form._id)">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="更换头像" name="second">
      <el-upload class="avatar-uploader"
       action='/api/upload' 
       :show-file-list="false" 
       :on-success="handleAvatarSuccess" 
       :before-upload="beforeAvatarUpload" 
       :headers="{phone:form.phone,token:token,id:form._id}">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="fa fa-cloud-upload avatar-uploader-icon"></i>
        <div slot="tip" class="el-upload__tip" v-show="!uploadSuccess">只能上传jpg/png文件，且不超过2MB</div>
      </el-upload>
    </el-tab-pane>
    <el-tab-pane label="修改密码" name="third">
      <el-form :model="form" :rules="updatePswFormRules" ref="updatePswForm" label-width="120px" style="width:30%;">
        <el-form-item prop="old_password" label="旧密码">
          <el-input type="password" v-model="form.old_password" auto-complete="off" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="新密码">
          <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="password2" label="确认密码">
          <el-input type="password" v-model="form.password2" auto-complete="off" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="success" :loading="updatePswLoading" @click.native="updatePswSubmit(form._id)">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    //确认密码
    var validatePass = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致！"))
      } else {
        callback()
      }
    };
    //旧密码验证
    var validateOldPass=(rule,value,callback)=>{
      let id=JSON.parse(localStorage.getItem('user'))._id;
      this.axios.get('/api/user/'+id).then(res=>{
        if(res.data.result.password!==value){
          callback(new Error("旧密码不正确！"));
        }else{
          callback();
        }
      },err=>{
        alert("数据库读取密码错误"+err)
      });
    }
    return {
      activeName:'first',
      token:'',
      form: {
        _id: '',
        phone: '',
        name: '',
        sex: '1',
        birth: '',
        old_password:'',
        password: '',
        password2: ''

      },
      imageUrl: '',  //头像
      updatePswLoading: false,
      updatePswFormRules: {
        old_password:[
          {required:true,validator:validateOldPass,trigger:'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
          password2: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      updateInfoLoading:false,
      uploadSuccess:false,
    };
  },
  methods: {
    getToken: function() {
      this.axios.get('/api/token').then((response) => {
        this.token = response.data.result;
      }, (error) => {
        console.log("获取token失败：" + error);
      });
    },
    getInfo: function() {
      let id = this.form._id;
      this.axios.get('/api/user/' + id).then((response) => {
        var Data = response.data.result;
        var _Data = {
          _id: Data._id,
          phone: Data.phone,
          name: Data.name,
          sex: Data.sex,
          birth: Data.birth,
        };
        this.form = _Data;
      }).catch(function(err) {
        alert(err);
      });
    },
    updateInfo: function(id) {
      this.form.token = this.token;
      this.updateInfoLoading=true;
      this.axios.put('/api/user-info/' + id, this.form).then(response => {
        this.updateInfoLoading=false;
        this.$message({
          message: '已成功修改资料',
          type: 'success'
        });
      }, error => {
        alert(error)
      });
    },
    handleClick(tab, event) {
      // console.log(tab);
    },
    //上传成功后
    handleAvatarSuccess(res, file) {
      this.uploadSuccess=true;
      this.imageUrl = URL.createObjectURL(file.raw);

    },
    //上传图片前的判断
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;

    },
    updatePswSubmit:function(id) {
      this.$refs.updatePswForm.validate((valid) => {
        if (valid) {
          this.updatePswLoading = true;
          this.form.token = this.token;
          this.axios.put('/api/user-psw/' + id, this.form).then((response) => {
            this.updatePswLoading = false;
            this.$message({
              message: '密码修改成功！',
              type: 'success'
            });
          }).catch(function(err) {
            alert(err);
          });

        }
        else {
          console.log('表单验证没通过!!');
          return false;
        }
      })
    }


  },
  mounted: function() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.form._id = user._id;
    this.getToken();
    this.getInfo();
  }
};
</script>
<style scoped lang='scss'>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 300px; // margin: 0 auto;
  text-align: center;
  box-sizing: border-box;
  .el-upload__tip{
    width: 300px;
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.avatar-uploader:hover {
  border-color: #1D8CE0;
  color: #1D8CE0;
}

.avatar-uploader-icon {
  font-size: 50px;
  width: 300px;
  height: 300px;
  line-height: 300px;
  text-align: center;
}

.avatar {
  width: 300px;
  height: 300px;
  display: block;
}
</style>


