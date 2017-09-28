<template>
<div>
    <router-link :to="{name:item.name}" v-for="(item,index) in routersArr" v-if="item.display" :key="item.path">
        <div class="card">
            <img :src='item.imgUrl' :alt="item.name" width="100">
            <span>{{item.name}}</span>
        </div>
    </router-link>
</div>
</template>
<style lang='scss' scoped>
.card {
    display: block;
    width: 140px;
    height: 140px;
    padding: 5px;
    text-align: center;
    float: left;
    margin: 10px;
    cursor: pointer;
    border: 1px solid #ccc;
    box-shadow: 0 0 4px #c8c8c8;
    /*水平阴影位置 垂直阴影位置 阴影大小  颜色*/
    transition: 0.5s;
    img {
        width: 80%;
        margin: 0 auto;
        transition: 0.5s;
    }
    span {
        display: block;
        font-size: 16px;
        font-weight: 500px;
        color:#2c3e50;
    }
}
.card:hover {
    box-shadow: 2px 2px 16px #324157;
    /*水平阴影位置 垂直阴影位置 阴影大小  颜色*/
    transform: translateX(-2px) translateY(-2px);
    /*移动位置*/
}
.card:hover img{
    transform: scale(1.1);

}
</style>
<script>
export default {
    data() {
        return {
            routersArr:[],//主页子路由集合
        }
    },
    methods: {
        //从路由中找到主页下面的子路由
        arrIndex(arr, val) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name == val) {
                    return i;
                }
            }
        }
    },
    mounted(){
        this.$nextTick(function(){
            //找到主页子路由
            var allRoutes=this.$router.options.routes;
            var index=this.arrIndex(allRoutes,'主页');
            this.routersArr=this.$router.options.routes[index].children;
        });
    }
}
</script>


