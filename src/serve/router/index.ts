import Vue from 'vue';
import VueRouter from 'vue-router';

declare const require: any;

Vue.use(VueRouter);

/* async */
let Home: any = resolve => require(['@/views/home/Home.vue'], resolve); //首页
let Login: any = resolve => require(['@/views/login/Login.vue'], resolve); //首页
let RechargeList: any = resolve => require(['@/views/recharge/list/index.vue'], resolve); //充值列表
let RechargeResult: any = resolve => require(['@/views/recharge/result/index.vue'], resolve); //充值结果


/* sync */
let example = resolve => require(['@/views/example/example.vue'], resolve);

const routers = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    //components
    {
      path:'/example',
      component:example
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/recharge/list',
      component: RechargeList
    },
    {
      path: '/recharge/result',
      component: RechargeResult
    },

    //all
    {
      path: '*',
      redirect: '/home'
    }
  ]
})

routers.beforeEach((to, form, next) => {
  next();
})
export default routers
