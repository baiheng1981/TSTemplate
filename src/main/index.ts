// "use strict";
import 'babel-polyfill';
import '../serve/utils/REM';
/* css */
import '../assets/style/mixins/common';
/* lib */
import Vue from 'vue';
import router from "../serve/router";
import FastClick from 'fastclick';
import PlatForm, { IdentifyPlatform } from '../serve/utils/PlatForm';
import Https from '../serve/Https';

/* 组件 */
import App from '../views/App.vue';


/* init */
import Data from '../model/Data';
import '../views/components/Components';
import Bus from '../serve/Bus';



IdentifyPlatform();
FastClick.attach(document.body);
Https.init();
Https.updateToken("");




let vm = (window as any).vm = new Vue({
    router:router,
    render: h => h(App)
});

vm.$mount('#app');

// console.log(Data)