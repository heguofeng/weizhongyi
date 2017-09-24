<template>
  <div>
    <header>
      <div class="header">
        <el-row>
          <el-col :span="4">

            <span class="title">
              <a href="/main" title="首页">
                <i class="fa fa-stethoscope"></i> 微中医
              </a>
            </span>

          </el-col>
          <el-col :span="10">
            <el-menu theme="dark" :default-active="activeIndex" class="nav" mode="horizontal" @select="handleSelect" router>
              <el-menu-item index='1' :route="{name:'已开通服务'}">
                <i class="el-icon-menu"></i>已开通服务</el-menu-item>
              <el-menu-item index="2" :route="{name:'未开通服务'}">
                <i class="el-icon-plus"></i>未开通服务</el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="10" class="userinfo">
            <a @click="logout">
              <i class="fa fa-sign-out"></i>退出</a>
            <a>
              <i class="fa fa-cog "></i>设置</a>
            <span class="userinfo-inner">
              <img :src="userAvatar" />
              <span>{{userName}}</span>
            </span>
          </el-col>
        </el-row>
      </div>
    </header>

    <section>
      <el-row>
        <el-col :span="12" class="breadcrumb-container">
          <!-- 面包屑 -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path" :to="{name:item.name}">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col :span="12">
          <strong class="bc_title">{{$route.name}}</strong>
        </el-col>
        <el-col :span="24">
          <router-view></router-view>
        </el-col>
      </el-row>
    </section>
    <footer>
      <div>—— 杭州微中医健康管理有限公司 ——</div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: '',
      activeIndex: '1',
      userName: '',  //名字
      userAvatar: '', //头像
      form: [],//资料
      routersArr: [],//当前路由子路由集合
    }
  },
  methods: {
    handleSelect: function(key, keyPath) {
      // console.log(key,keyPath)
    },
    //退出登录
    logout: function() {
      this.$confirm('确认退出吗?', '提示', {
        //type: 'warning'
      }).then(() => {
        localStorage.removeItem('user');
        this.$router.push({ name: 'LoginIn' });
      }).catch((error) => { });


    },
    getInfo: function() {
      let id = JSON.parse(localStorage.getItem('user'))._id;
      this.axios.get('/api/user/' + id).then((response) => {
        var Data = response.data.result;
        var _Data = {
          _id: Data._id,
          phone: Data.phone,
          name: Data.name,
          sex: Data.sex,
          birth: Data.birth,
          avatar: Data.avatar
        };
        this.form = _Data;
        this.userName = this.form.name == '' ? this.form.phone : this.form.name;
        this.userAvatar = this.form.avatar != '' ? this.form.avatar : '../../static/images/jingyu.png';
      }).catch(function(err) {
        alert(err);
      });
    },
    //从路由中找到主页下面的子路由
    arrIndex(arr, val) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == val) {
          return i;
        }
      }
    },
    websocker: function() {
      this.axios.get('/api/token').then((response) => {
        this.token = response.data.result;
        var ws = new WebSocket(`ws://${location.hostname}:3000`);
        ws.onopen = () => {
          // console.log("打开了ws")
          ws.send(this.token);
        };
        ws.onmessage = () => {
          // console.log('收到了消息')
          this.getInfo();
        };
      }, (error) => {
        console.log("出错：" + error);
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getInfo();
      //找到主页子路由
      var allRoutes = this.$router.options.routes;
      var index = this.arrIndex(allRoutes, '主页');
      this.routersArr = this.$router.options.routes[index].children;

      this.websocker();
    });
  },

}
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 60px;
  background-color: #324157;
  color: #A9B7B7;
  line-height: 60px;
  margin-bottom: 15px;
}


.header {
  width: 1080px;
  margin: 0 auto;
  .title {
    a {
      text-decoration: none;
      color: #fff;
      line-height: 60px;
      font-size: 22px;
      padding-left: 20px;
      i {
        font-size: 30px;
        position: relative;
        top: 5px;
      }
    }
    a:hover {
      color: #FF4949;
    }
  }
  .nav i {
    font-size: 20px;
  }
}


section {
  box-sizing: border-box;
  width: 56%;
  margin: 0 auto;
  min-height: 650px; // border: 1px solid #A9B7B7;
  background-color: #fff;
  padding: 10px 25px;
  margin-bottom: 20px;
  .bc_title {
    float: right;
    color: #475669;
    font-size: 30px; // margin-bottom: 10px;
  }
  .breadcrumb-container {
    line-height: 30px;
    display: block;
    height: 30px;
    margin-top: 15px;
  }
}

.userinfo {
  text-align: right;
  float: right;
  a {
    float: right;
    margin-right: 15px;
    cursor: pointer;
    i {
      font-size: 26px;
      padding-right: 8px;
      position: relative;
      top: 5px;
    }
  }
  a:hover {
    color: #fff;
  }
  .userinfo-inner {
    font-size: 15px;
    cursor: pointer;
    float: right;
    margin-right: 25px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin: 10px 10px 10px 10px;
      float: left;
    }
  }
}

footer {
  text-align: center;
  font-size: 16px;
  padding: 20px;
}
</style>

