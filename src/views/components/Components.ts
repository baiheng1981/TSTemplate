import Vue from 'vue';

declare var require: any;

/* async */
// let alert:any = resolve => require(['@/module/components/Alert.vue'], resolve);

/* sync */
import Download from './Download.vue';
// import Error from './Error.vue';
import bubble from './bubble.vue';
import loading from './loading.vue';

const components = {
  Download,
  loading,
  bubble
};

for (let key in components) {
  Vue.component(key, components[key]);
}
