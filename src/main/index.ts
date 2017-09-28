"use strict";
declare const require:any;
/* css */
import 'babel-polyfill'
import './style/mixins/common';
/* lib */
import Vue from 'vue';
import router from "./router"
import FastClick from 'fastclick';
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// Vue.use(VueAwesomeSwiper)

/* utils */
import AppInteractive from './assets/utils/app_interactive/AppInteractive'
import Data from './assets/Data';
import Https from './assets/Https';

import './assets/Init';

/* 组件 */
import App from './views/App.vue';


console.log("platform:", (Data as any).platform)
FastClick.attach(document.body);


//数据请求工具
// import axios from './assets/utils/http'
// (Vue.prototype as any).http2 = axios;
(Vue.prototype as any).$http = Https;


/*历史记录管理*/
// (window as any).hashHistory = [];


let vm = (window as any).vm = new Vue({
    router:router,
    render: h => h(App)
});

(window as any).goBack = function(){
    //pop 删除并返回数组最后一个元素
    //进入下一个路由前把当前路由push进历史记录数组
    AppInteractive.interceptBack(1)
    AppInteractive.networkReachability((val)=>{
        //如果在首页，或者目前是断网状态则退出界面
        // alert('网络状态: '+val.data.status)
        // if((window as any).hashHistory.length == 0 || val.data.status == 'notReach'){
        //     AppInteractive.finish()
        // }else{//否则退回上一个页面
        //    vm.$router.go(-1)
        //    alert('调用go(-1)方法')
        // }
        if(vm.$route.path == '/home' || vm.$route.path == '/shopping' || vm.$route.path == '/OrderForm' || val.data.status == 'notReach'){
            AppInteractive.finish()
        }else{
            vm.$router.go(-1)
        }
        // if(vm.$route.path == '/' || 'home' || 'shopping' || 'OrderForm'){
        //     AppInteractive.finish()
        // }else if(vm.$route.path == '/choice_place'){
        //     vm.$router.replace('/choice_place')
        // }else{
        //     vm.$router.go(-1)
        // }
    });

}


// alert("inApp:"+AppInteractive.inApp())
if(!AppInteractive.inApp()){
    let _token = "MTIzMzc2MTgsMTUwNjQyNDU1MSxiYmY2YmUwNDg5MTE5MmIyMDViOTA3MzliODc2MmE2OQ==";
    // Data.token = "MSwxNTA2MDcxNDM3LGMzNWViMmQ2YzAxMmQxOGMzNzFmNGUwMjkyNjU3N2U0";
    Https.updateToken(_token);
    console.log("在"+AppInteractive.tag+"外运行");

    vm.$mount('#app');
}else{
    // alert("in App")
    /* 获取token */
    AppInteractive.getToken((res)=>{
        if(res.errno==0){
            let _token = res.data.token;
            Https.updateToken(_token);
            // alert("token:"+Data.token)
            vm.$mount('#app');
        }
    });
}