<template>

  <div>
    <div class="card">
      <img src="../assets/images/png05.png" alt="资料" width="100">
      <span>你想要什么</span>
    </div>
  </div>

</template>
<style lang='scss' scoped>
.card {
    display: block;
    width: 13%;
    height: 140px;
    padding: 5px;
    text-align: center;
    float: left;
    margin: 10px;
    cursor: pointer;
    border: 1px solid #ccc;
    box-shadow: 0 0 4px #c8c8c8;
    /*水平阴影位置 垂直阴影位置 阴影大小  颜色*/
    transition: 0.2s;
    img {
        width: 80%;
        margin: 0 auto;
    }
    span {
        display: block;
        font-size: 16px;
        font-weight: 500px;
    }
}
</style>
<script>
export default {
  
}
</script>


