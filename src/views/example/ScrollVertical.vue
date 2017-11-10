<template>
    <!-- video start -->
    <div class="video-pt">
        <div class="track" id="trackv" style="height:3.2rem;">
            <div class="progress">
                <div class="load-progress" style="height:0;" id="loadProgressv"></div>
                <div class="progress" style="height:0;" id="progressv"></div>
                <div class="slide" id="slidev"></div>
            </div>
        </div>
        <div class="track" id="trackv2" style="height:4rem;">
            <div class="progress">
                <div class="load-progress" style="height:0;" id="loadProgressv2"></div>
                <div class="progress" style="height:0;" id="progressv2"></div>
                <div class="slide" id="slidev2"></div>
            </div>
        </div>
    </div>
    <!-- video end -->
</template>
<script lang="ts">
import {Vue, Component, Util} from "../../serve/BaseVue"
import { ScrollBar, ScrollBarEventType } from '../../serve/scroll/ScrollBar';
import REM from '../../serve/utils/REM'

@Component({

})
export default class ScrollVertical extends Vue {
    //==================data
    name:string = "ScrollVertical";
    scrollV:ScrollBar;
    scrollV2:ScrollBar;
    //==================computed

    //==================lifecycle hook
    mounted(){
        this.videoInit();
    }

    //===================video
    videoInit():void {
        this.scrollV = new ScrollBar("vertical", false, "V11");
        this.scrollV.initDom({
                domTrack:document.getElementById('trackv'),
                domSlide:document.getElementById('slidev'),
                domProgress:document.getElementById('progressv'),
                domLoadProgress:document.getElementById('loadProgressv'),
        });
        this.scrollV.updateValue(0, 0, 500);
        this.scrollV.addEvent(ScrollBarEventType.scroll, (_val:{[key:string]:number})=>{
            // console.log(this.scrollV.name+":", _val);
        })
        this.scrollV.slideRunGPS(0.5);


        this.scrollV2 = new ScrollBar("vertical", true, "V22");
        this.scrollV2.initDom({
                domTrack:document.getElementById('trackv2'),
                domSlide:document.getElementById('slidev2'),
                domProgress:document.getElementById('progressv2'),
                domLoadProgress:document.getElementById('loadProgressv2'),
        }, 0.5);
        this.scrollV2.updateValue(0, 0, 300);
        this.scrollV2.addEvent(ScrollBarEventType.scroll, (_val:{[key:string]:number})=>{
            // console.log(this.scrollV2.name+":", _val);
        })
        // this.scrollV2.slideRunGPS(0.5);
    }

}

</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins/util';
.video-pt {
    .track {
        padding: 0 size(20);
        margin: size(20) 0;
        float: left;
        .progress {
            position: relative;
            background-color: #eaeaea;
            width: size(12);
            height: 100%;
            // border: 1px solid #333;
            // @include border-radius(size(25));
            .load-progress {
                // @include border-radius(size(25));
                background-color: #bbdcef;
                width: size(12);
                position: absolute;
                left: 0;
                top: 0;
            }
            .progress {
                // @include border-radius(size(25));
                background-color: #f12644;
                width: size(12);
                position: absolute;
                left: 0;
                top: 0;
            }
            .slide {
                // background-image: url('./images/video_slide.png');
                width: size(40);
                height: size(40);
                background-size: cover;
                background-position: 50%;
                position: absolute;
                left: -(size((40-12)/2));
                @include border-radius(size(15));
                background-color: #1a7288;
                opacity: 0.5;
            }
        }
    }
    .time-start {
        font-size: size(16);
        color: #000;
        // border: 1px solid red;
    }
    .right10 {
        margin-right: size(10);
    }
}
</style>