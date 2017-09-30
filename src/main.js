import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
// import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import router from './routes'
import axios from 'axios'
// import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.axios = axios;

router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.name == 'Admin') {
        localStorage.removeItem('admin');
    }
    let admin = JSON.parse(localStorage.getItem('admin'));
    let user = JSON.parse(localStorage.getItem('user'));
    //后台
    if (to.meta.requiresAuth && !admin) {
        // next({ name: 'Admin' });
        next()
    } else {
        next()
    }
    //前台
    if (to.meta.authUser && !user) {
        next({ name: 'LoginIn' })
    } else {
        next()
    }

});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})