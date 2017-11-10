<template>
  <div class="Home">
    <!--div style="border:1px solid #888; overflow:hidden;">
        <a @click="swiperClick(0)">111</a>
        <a @click="swiperClick(1)">222</a>
        <a @click="swiperClick(2)">333</a>
        <a @click="swiperClick(3)">333</a>
    </div-->
    <div class="list" id="banner">
      <swiper :options="swiperOption" ref="mySwiper" class="swiper-container">
        <!-- slides -->
        <swiper-slide>
          <li>
            <div class="download"
                 @click="helpExplorerStatus(true)"></div>
            <div class="pay"
                 @click="routerShift('/recharge/list')"></div>
            <div class="upswipe"
                 @click="swiperClick(1)"></div>
          </li>
        </swiper-slide>
        <swiper-slide>
          <li>
            <div class="upswipe"
                 @click="swiperClick(2)"></div>
          </li>
        </swiper-slide>
        <swiper-slide>
          <li>
            <div class="upswipe"
                 @click="swiperClick(3)"></div>
          </li>
        </swiper-slide>
        <swiper-slide>
          <li>
          </li>
        </swiper-slide>
      </swiper>
    </div>
    <!--help-erplorer-->
    <Download ref="download" :foot-visible="false"></Download>
  </div>
</template>
<script lang="ts">
  import BaseVue, {Component, Data, Https, Bus, API} from "../../serve/BaseVue";
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  import '../../assets/style/swiper.min.css';

  import PlatForm, {download} from '../../serve/utils/PlatForm';

  @Component({
    components: {
      swiper, swiperSlide
    }
  })
  export default class Home extends BaseVue {
    //==================data
    name: string = "Home";
    swiperOption = {
      autoplay: false,
      direction: 'vertical',
    }

    bannerlist:NodeListOf<Element>;
    reslist:Array<string> = [];

    //==================computed
    get swiper() {
      return (this.$refs.mySwiper as any).swiper
    }


    //==================lifecycle hook
    mounted(): void {
      console.log(this.name + " loaded!")
      this.setTitle("欢迎来到好唱Party");

      this.init();
    }

    destroyed(): void {
      // console.log("destroyed~~~~~~", this.title)

    }

    //==================method
    init(): void {
      //
      this.bannerlist = document.querySelectorAll("#banner li");
      // console.log(this.bannerlist[0])
      //获取资源
      Https.get(API.homeConfig).then((res:object) => {
          let _obj:object = res['data'];
          this.reslist = _obj["urllist"];
          for( let i:number=0; i<this.bannerlist.length; i++){
            let el:HTMLLIElement = this.bannerlist[i] as HTMLLIElement;
            el.style.backgroundImage = "url("+this.reslist[i]+")";
          }
      }).catch((err)=>{
          console.log("homeConfig:"+ err);
      })
    }


    swiperClick(_n): void {
      this.swiper.slideTo(_n, 600, false)
    }

    helpExplorerStatus(): void {
      (this.$refs.download as any).helpExplorerStatus(true);
    }


  }
</script>
<style lang="scss" scoped>
  @import './Home.scss';
</style>

