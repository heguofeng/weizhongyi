import Vue from 'vue'
import VueRouter from 'vue-router'

//引入创建的页面
import Admin from '@/views/Login/Admin.vue'
import Home from '@/views/Home.vue'
import PutInfo from '@/views/services/PutInfo.vue'
import Main from '@/views/Main.vue'
import MyInfo from '@/views/services/MyInfo.vue'
import LoginIn from '@/views/Login/LoginIn.vue'
import SignIn from '@/views/Login/SignIn.vue'
import ForgetPsw from '@/views/Login/ForgetPsw.vue'
import Form from '@/views/nav1/Form.vue'
import Table from '@/views/nav1/Table.vue'
import User from '@/views/nav1/User.vue'
import NotFound from '@/views/404.vue'
import ExistServices from '@/views/ExistServices.vue'
import PayServices from '@/views/PayServices.vue'

//使用路由插件
Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: __dirname,
    linkActiveClass: "active",
    routes: [
        //路由
        { name: 'Admin', path: '/admin', component: Admin, hidden: true },
        { name: 'LoginIn', path: '/', component: LoginIn, hidden: true },
        { name: 'SignIn', path: '/signin', component: SignIn, hidden: true },
        { name: 'ForgetPsw', path: '/forgetpsw', component: ForgetPsw, hidden: true },
        {
            name: '主页',
            path: '/main',
            component: Main,
            hidden: true, //是否显示
            meta: { authUser: true },
            redirect: '/main/existservices',
            children: [
                //将页面和指定path的路由关联,不需要‘/’符号
                { name: '已开通服务', path: 'existservices', component: ExistServices, meta: { authUser: true } },
                { name: '未开通服务', path: 'payservices', component: PayServices, meta: { authUser: true } },
                { name: '我的资料', path: 'myinfo', component: MyInfo, meta: { authUser: true }, display: true, imgUrl: require('@/assets/images/png06.png') },
                { name: '修改资料', path: 'putinfo', component: PutInfo, meta: { authUser: true }, display: true, imgUrl: require('@/assets/images/png01.png') },
            ]
        },
        {
            name: 'Home',
            path: '/home',
            component: Home,
            name2: '功能模块',
            meta: { requiresAuth: true }, // 可以在路由元信息指定哪些页面需要登录权限
            iconCls: 'el-icon-message', //图标样式class           
            children: [
                { path: 'table', component: Table, name: 'Table', name2: '表格', meta: { requiresAuth: true } },
                { path: 'form', component: Form, name: 'Form', name2: '表单处理', meta: { requiresAuth: true } },
                { path: 'user', component: User, name: 'User', name2: '用户列表', meta: { requiresAuth: true } },
            ]
        },
        {
            name: 'Home',
            path: '/home',
            component: Home,
            name2: '功能模块',
            meta: { requiresAuth: true },
            iconCls: 'fa fa-address-card',
            leaf: true, //表示只有一个节点 ,则直接显示子节点，不显示父节点
            children: [
                { path: 'table', component: Table, name: 'Table', name2: '个人中心', meta: { requiresAuth: true } },
            ]
        },
        {
            path: '/404',
            component: NotFound,
            name: '',
            hidden: true
        },
        {
            path: '*',
            hidden: true,
            redirect: { path: '/404' }
        }
    ]
})