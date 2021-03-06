import Vue from 'vue'
import VueRouter from 'vue-router'


//引入创建的页面
const Admin = resolve => require(['@/views/Login/Admin.vue'], resolve)
const Home = resolve => require(['@/views/Home.vue'], resolve)
const Appointment = resolve => require(['@/views/services/Appointment.vue'], resolve)
const Main = resolve => require(['@/views/Main.vue'], resolve)
const MyInfo = resolve => require(['@/views/services/MyInfo.vue'], resolve)
const LoginIn = resolve => require(['@/views/Login/LoginIn.vue'], resolve)
const SignIn = resolve => require(['@/views/Login/SignIn.vue'], resolve)
const ForgetPsw = resolve => require(['@/views/Login/ForgetPsw.vue'], resolve)
const Form = resolve => require(['@/views/nav1/Form.vue'], resolve)
const Table = resolve => require(['@/views/nav1/Table.vue'], resolve)
const User = resolve => require(['@/views/nav1/User.vue'], resolve)
const NotFound = resolve => require(['@/views/404.vue'], resolve)
const ExistServices = resolve => require(['@/views/ExistServices.vue'], resolve)
const PayServices = resolve => require(['@/views/PayServices.vue'], resolve)
const Step1 = resolve => require(['views/services/Appointment/Step1.vue'], resolve)
const Step2 = resolve => require(['views/services/Appointment/Step2.vue'], resolve)
const Step3 = resolve => require(['views/services/Appointment/Step3.vue'], resolve)

//使用路由插件
Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history', // 开启HTML5的history模式，可以让地址栏的url长得跟正常页面跳转的url一样。
    base: __dirname,
    // linkActiveClass: "active",
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
            hidden: true, //是否在后台管理侧方导航显示
            meta: { authUser: true }, //是否需要登录才能进
            redirect: '/main/existservices',
            children: [
                //将页面和指定path的路由关联,不需要‘/’符号   display:是否显示在主页面  authUser:是否需要用户登录  imgUrl:图标路径
                { name: '已开通服务', path: 'existservices', component: ExistServices, meta: { authUser: true } },
                { name: '未开通服务', path: 'payservices', component: PayServices, meta: { authUser: true } },
                { name: '我的资料', path: 'myinfo', component: MyInfo, meta: { authUser: true }, display: true, imgUrl: require('@/assets/images/png06.png') },
                {
                    name: '预约挂号',
                    path: 'appointment',
                    component: Appointment,
                    meta: { authUser: true },
                    display: true, //在服务列表中显示
                    imgUrl: require('@/assets/images/png01.png'), //图片路径
                    redirect: '/main/appointment/step1',
                    children: [
                        { name: '选择医院', path: 'step1', component: Step1 },
                        { name: '确认预约信息', path: 'step2', component: Step2 },
                        { name: '预约完成', path: 'step3', component: Step3 },
                    ]
                },
            ]
        },
        {
            name: 'Home',
            path: '/home',
            component: Home,
            name2: '功能模块', //name2可以由name代替，以后可以取消不使用
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
            redirect: '/404'
        }
    ]
})