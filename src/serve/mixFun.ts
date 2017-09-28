import Vue from 'vue';


let mixFun = {
    data(){
        return {

        }
    },
    mounted(){

    },
    methods:{
        /**
         * @method routerShift  路由跳转方法
         * @param {string}  to  将要切入的路由
         * @param {any}     querys 路由参数
         *          {
                        xx:xxx
                    }
         */
        routerShift(to:String, querys?:any):void{
            if(querys){
                (this as any).$router.push({path:to,query:querys})
            }else {
                (this as any).$router.push({path:to})
            }
        }



    }
}

export { mixFun }