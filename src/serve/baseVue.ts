import Vue from 'vue';
// declare var Vue:any;
import Component from "vue-class-component";
Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate' // for vue-router 2.2+
])

import Bus from './Bus';
import CMD from './CMD';
import Utils from './utils/Utils';
import Data from './Data';
import Https from './Https';
import {mixFun} from './utils/mixFun';

import PullUpUpdate from './utils/PullUpUpdate';
import AppInteractive from './utils/app_interactive/AppInteractive';


let MixinComponent = Vue.extend({
    mixins: [ mixFun ]
})


export {
    Vue, Component, MixinComponent,
    Bus, CMD, Utils, Data, Https,
    PullUpUpdate, AppInteractive
};