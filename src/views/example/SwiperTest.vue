<template>
<div style="border:1px solid #000; width:100%; margin-top:0.3rem; overflow:hidden; padding:0.1rem;">
    <!--swiper start-->
    <div class="swiper-div">
        <div class="childtitle">swiper 应用</div>
        <div class="menu">
            <a @click="swiperClick(0)">111</a>
            <a @click="swiperClick(1)">222</a>
            <a @click="swiperClick(2)">333</a>
        </div>

        <div class="content">
            <swiper :options="swiperOption" ref="mySwiper" class="swiper-container">
                <!-- slides -->
                <swiper-slide>I'm Slide 1</swiper-slide>
                <swiper-slide>I'm Slide 2</swiper-slide>
                <swiper-slide>I'm Slide 3</swiper-slide>
                <swiper-slide>I'm Slide 4</swiper-slide>
                <swiper-slide>I'm Slide 5</swiper-slide>
                <swiper-slide>I'm Slide 6</swiper-slide>
                <swiper-slide>I'm Slide 7</swiper-slide>
            </swiper>
        </div>
    </div>
    <!--swiper end-->
</div>
</template>
<script lang="ts">
import BaseVue, {Vue, Component, Data, Bus} from "../../serve/BaseVue";
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import '../../assets/style/swiper.min.css';

@Component({
    components:{
        swiper, swiperSlide,
    }
})
export default class SwiperTest extends BaseVue {
    swiperOption:object = {
        autoplay:false
    }

    //==================computed
    get swiper() {
        return (this.$refs.mySwiper as any).swiper
    }

    //==================lifecycle hook
    mounted(){

    }
    beforeDestroy(){
      console.log("SwiperTest beforeDestroy")
    }


    //==================method
    /** swiper */
    swiperClick(_n):void {
        this.swiper.slideTo(_n, 500, false)
    }





}
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins/util';
.swiper-div {
    border:1px solid #888;
    padding: 0.2rem;
    @include ik-box;
    @include ik-box-orient(horizontal);
    @include ik-box-align(center);
    @include ik-box-pack(justify);
    .menu {
        @include ik-box;
        @include ik-box-orient(horizontal);
        @include ik-box-align(center);
        @include ik-box-pack(start);
        a {
            font-size: size(30);
            display: block;
            padding: size(10);
            background-color: #fff;
            margin-right: size(10);
        }
    }
    .content {
        border: 1px solid #aaa;
        margin-top: size(10);
        width: size(200);
        height: size(100);
    }

}
</style>

