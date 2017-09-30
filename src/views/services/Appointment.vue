<template>
  <div class="app">
      <section class="step clearfix">
        <el-steps :space="200" :active="active" finish-status="success" align-center center >
          <el-step title="选择医院"></el-step>
          <el-step title="确认预约信息"></el-step>
          <el-step title="预约成功"></el-step>
        </el-steps>
      </section>
      <div class="main">
        <router-view></router-view>
      </div> 
  </div>
</template>
<style lang="scss" scoped>
.step{
  padding-top: 15px;
  background-color:#fafafa;
  width: 100%;
}
.main{
  padding: 15px;
}



</style>
<script>
export default {
  data(){
    return{
      active:1
    }
  },
  watch:{
    '$route'(to,form){
      this.active=this.$route.params.active||1;
    }
  }
}
</script>


