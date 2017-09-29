import Vue from 'vue';
import Router from 'vue-router';

declare const require:any;

Vue.use(Router);

/* async */



/* sync */



const routers = new Router({
    routes: [
        {
            path: '/',
            redirect:'/'
        },
    ]
})

routers.beforeEach((to,form,next)=>{

})
export default routers
