<template>
    <div style="padding-bottom: 1.2rem; height:100%;">
        Example
        <div class="control">
            <a @click="goRoute('home')">进入home页面</a>
            <a @click="goRoute('login')">进入login页面</a>
        </div>


        <div class="control">
            <a @click="showLoading()">显示/隐藏 Loading</a>
            <a @click="showBubble()">显示气泡</a>
            <a @click="countdownClick(20000)">倒计时20秒</a>

            <a @click="show_video=!show_video">video test</a>
            <a @click="show_swiper=!show_swiper">swiper test</a>
            <a @click="show_pullUpUpdate=!show_pullUpUpdate">pullUpUpdate test</a>
            <!--a @click="show_pullDownUpdate=!show_pullDownUpdate">pullDownUpdate test</a-->
        </div>

        <!--video start-->
        <videotemplate v-if="show_video"></videotemplate>
        <!--video end-->
        <!--SwiperTest-->
        <swipertest v-if="show_swiper"></swipertest>

        <!--PullUpUpdate.ts -->
        <pullUpUpdate v-if="show_pullUpUpdate"></pullUpUpdate>

        <!--PullDownUpdate.ts -->
        <pullDownUpdate v-if="show_pullDownUpdate"></pullDownUpdate>


    </div>
</template>
<script lang="ts">
import BaseVue, {Vue, Component, Data, Bus, API, Util, FormValidation, FormPolicy, FormENUM, Countdown, validate} from "../../serve/BaseVue"
import Https from '../../serve/Https'
import videotemplate from './VideoTemplate.vue';
import pullUpUpdate from './PullUpUpdate.vue';
import pullDownUpdate from './PullDownUpdate.vue';
import ScrollBottomUpdate from '../../serve/utils/ScrollBottomUpdate'
import swipertest from './SwiperTest.vue';

@Component({
    components:{
        videotemplate, pullUpUpdate, pullDownUpdate, swipertest
    }
})
export default class Home extends BaseVue {
    //==================data
    title:string = "Home";

    show_video:boolean = false;
    show_swiper:boolean = false;
    show_pullUpUpdate:boolean = false;
    show_pullDownUpdate:boolean = true;


    scrollBottomUpdate:ScrollBottomUpdate;



    //==================computed


    //==================lifecycle hook
    mounted(){
        console.log(Util.getDateAfter(1));

        let md5:object = Https.formatData({a:"aaaa", b:'bbbbb'});
        console.log("[md5计算] : ",md5)

        /* loading */
        Bus.$emit("loading", false);


        /* 表单验证 */
        FormValidation.run([
            new FormPolicy(12123456789, FormENUM.isPhoneNumber, "[FormValidation] 手机号码是假的"),
        ]).then(()=>{
            console.log("[FormValidation] FormValidation success!");
        }).catch((err)=>{
            console.log("[FormValidation] FormValidation error:",err);
        });
        /** Parameter 参数验证 */
        this.validateTest();
        /** http测试 */
        this.httpsGetTest();

        this.scrollBottomUpdate = new ScrollBottomUpdate(this.scrollBottomUpdateHanlder);
    }
    beforeDestroy(){
        console.log("example beforeDestroy")
        if(this.countdown) this.countdown.stop();
        this.countdown = null;
    }

    httpsGetTest(){
        //获取资源
        Https.get(API.homeConfig).then((res:object) => {
            let _obj:object = res['data'];
            console.log("[Https] https get success！")
        }).catch((err)=>{
            console.log("[Https] https response fail:", err);
        })
    }

    validateTest(){
        let rule = {
            name: 'string',
            age: 'int',
            gender: ['male', 'female', 'unknown'],
            urllist:{
                type:'array',
                itemType:'string',
                required:true,
            }
        };
        let valid = {
            name: 'foo',
            age: 24,
            gender: 'male',
            urllist:["xxxx1"]
        };
        let invalid = {
            name: 'foo',
            age: 24,
            gender: 'male',
            urllist:"xxx"
        };
        //valid
        validate(rule, valid).then(()=>{
            console.log("[validate] validateTest valid:通过验证");
        }).catch((err)=>{
            Bus.$emit('bubble',"[validate] "+err)
        })
        //invalid
        validate(rule, invalid).then(()=>{
            // console.log("validateTest invalid:通过验证");
        }).catch((err)=>{
            console.log("[validate] validateTest invalid:未通过验证");
            Bus.$emit('bubble',"[validate] "+err)
        })
    }


    /* 倒计时 */
    countdown:Countdown;
    countdownClick(_n:number):void {
        console.log("[Countdown] last:", _n);
        this.countdown = new Countdown(_n, ()=>{
            console.log("[Countdown] countdown complate!")
        }, 1000, (val)=>{
            console.log("[Countdown] last:", val);
            if(val<_n/2+500 && val>_n/2-500){
                this.countdown.pause();
                console.log("[Countdown] countdown pause 1/5")
                setTimeout(()=>{
                    console.log("[Countdown] countdown goon")
                    this.countdown.start();
                }, _n/5)
            }
        });
        this.countdown.start();
    }

    showLoading(){
        Bus.$emit('loading', true);
        setTimeout(()=>{
            Bus.$emit('loading', false);
        }, 5000);
    }
    showBubble(){
        Bus.$emit('bubble','显示气泡')
    }

    //==================method
    goRoute(router){
        // (this as any).mixAlert({tips:'xxxxoooo'});
        (this as any).$router.push(router)

    }

    scrollBottomUpdateHanlder():void {
        console.log("[ScrollBottomUpdate] ScrollBottomUpdate~~~~~~~~~~~~~~")
    }

}
</script>
<style lang="scss">
@import '../../assets/style/mixins/util';
p {
    font-size: size(40);
}

.control {
    border:1px solid red; width:100%; overflow:hidden; padding:size(20); margin-top:size(10);

    a {
        font-size: size(30);
        display: inline-block;
        padding: size(10);
        background-color: #ccc;
        margin-right: size(10);
        margin-bottom: size(10);
    }
}
.childtitle {
    font-size:size(30);
    font-weight:bold;
    padding:0 0 size(15) 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active 在低于版本 2.1.8 中 */ {
  opacity: 0
}


</style>

