import Vue from 'vue';
import Component from "vue-class-component";
import Data from '../model/Data';
import Bus from './Bus';
import {validate} from './utils/Parameter';
import API from './API';
import Util from './Util';
import Https from './Https';
import FormValidation, { FormPolicy, FormENUM } from './utils/FormValidation';//表单验证
import {ComputingTime, Countdown} from './utils/ComputingTime';//倒计时


Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate' // for vue-router 2.2+
])

/**
 * Vue                  Vue
 * Component            Vue组件
 * Data                 公用数据记录类
 * Bus                  事件类
 * API                  http请求api
 * validate             api接口数据验证
 * Util                 工具类
 * FormValidation       表单验证
 * FormPolicy           表单验证 - 策略
 * FormENUM             表单验证 - 方法名
 * ComputingTime        流逝时间(精确到毫秒)
 * Countdown            倒计时(精确到毫秒)
 */
export {
    Vue, Component, Data, Bus, API, validate, Util, Https,
    FormValidation, FormPolicy, FormENUM,
    ComputingTime, Countdown
};


/**
 * BaseVue  用于*.vue组件继承的父类，添加以下公共数据
 */
export default class BaseVue extends Vue {
    xxoo():void {
        console.log("BaseVue: methods test - xxoo");
    }

    /**
     * @method routerShift  路由跳转方法
     * @param {string}  to  将要切入的路由
     * @param {any}     querys 路由参数
     *          {
                        xx:xxx
                    }
     */
    routerShift(to: String, querys?: any): void {
        if (querys) {
          (this as any).$router.push({path: to, query: querys})
        } else {
          (this as any).$router.push({path: to})
        }
    }
    /**
     * 设置页面标题
     * @method setTitle
     * @param {string} title 标题内容
     */
    setTitle(title: string): void {
        if(title) {
          let u: string = navigator.userAgent;
          let isAndroid: boolean = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
          let isiOS: boolean = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
          if (isAndroid) {
              document.title = title
          }else if(isiOS) {
              let i: HTMLIFrameElement = document.createElement('iframe');
              i.src = '/static/favicon.ico';
              i.style.display = 'none';
              document.title = title;
              i.onload = function () {
                setTimeout(function () {
                  i.remove();
                }, 1)
              };
              document.body.appendChild(i);
          }
      }
    }
}
