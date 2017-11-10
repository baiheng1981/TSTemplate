<template>
<div style="border:1px solid #000; width:100%; margin-top:0.3rem; overflow:hidden; padding:0.1rem;">
    <!-- video start -->
    <div class="video-container"  style="width:7.4rem; float:left;">
        <div class="childtitle">Video test</div>
        <div class="video" id="vc"><video id="video"></video></div>
        <div class="video-control">
            <div class="btn-icon mr10" id="btnPrev"><div class="btn btn-control-prev"></div></div>
            <div class="btn-control-play mr10">
                <div class="btn btn-play" id="btnPlay"></div>
                <div class="btn btn-pause" id="btnPause"></div>
            </div>
            <div class="btn-icon mr20" id="btnNext"><div class="btn btn-control-next"></div></div>
            <div class="video-pt">
                <div class="time-start" id="time-curr">00:00</div>
                <div class="track" id="track" style="width:2rem;">
                    <div class="progress">
                        <div class="load-progress" style="width:0;" id="loadProgress"></div>
                        <div class="progress" style="width:0;" id="progress"></div>
                        <div class="slide" id="slide"></div>
                    </div>
                </div>
                <div class="time-start" id="time-dur">00:00</div>
            </div>
            <div class="video-volume">
                <div class="volume-outside" id="v-out">
                    <div class="btn btn-open" id="out-v-open"></div>
                    <div class="btn btn-close" id="out-v-close"></div>
                </div>
                <div class="volume-inside" id="v-inside">
                    <div class="track-v" id="track-v" style="height:2rem;">
                        <div class="progress">
                            <div class="load-progress" style="height:0;" id="loadProgress-v"></div>
                            <div class="progress" style="height:0;" id="progress-v"></div>
                            <div class="slide" id="slide-v"></div>
                        </div>
                    </div>
                    <div class="inside-btn" id="v-in-btn">
                        <div class="btn btn-open" id="in-v-open"></div>
                        <div class="btn btn-close" id="in-v-close"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- video end -->
    <scrollvertical style="float:right;"></scrollvertical>
</div>
</template>
<script lang="ts">
import {Vue, Component, Util} from "../../serve/BaseVue"
import {VideoPlayer, VideoEventType} from '../../serve/video/VideoPlayer';
import {VideoControl, IProgressDomDic, ITimeShowDomDic, IButtonDomDic} from '../../serve/video/VideoControl';
import REM from '../../serve/utils/REM';
import scrollvertical from './ScrollVertical.vue';

@Component({
    components:{ scrollvertical }
})
export default class VideoTemplate extends Vue {
    //==================data
    name:string = "VideoTemplate";
    //==================computed

    //==================lifecycle hook
    mounted(){
        this.videoInit();


    }

    //===================video
    videoUrlList:string[];
    videoPlayer:VideoPlayer;
    videoControl:VideoControl;
    videoInit():void {
        this.videoPlayer = new VideoPlayer(
            document.getElementById('video') as HTMLVideoElement,
            document.getElementById('vc').clientWidth,
            document.getElementById('vc').clientHeight
        );
        this.videoUrlList = [
            "/static/media/IM214717.mp4",
            "../../static/media/wsfz.mp3",
            ];
        this.videoPlayer.load(this.videoUrlList);

        // console.log(document.getElementById('btnPlay'))

        this.videoControl = new VideoControl(this.videoPlayer);
        this.videoControl.initProgress({
                domTrack:document.getElementById('track'),
                domSlide:document.getElementById('slide'),
                domProgress:document.getElementById('progress'),
                domLoadProgress:document.getElementById('loadProgress'),
        }, 0.3);
        this.videoControl.initTimeShow({
                current:document.getElementById('time-curr'),
                duration:document.getElementById('time-dur'),
        })
        this.videoControl.initButton({
                btnPlay:document.getElementById('btnPlay'),
                btnPause:document.getElementById('btnPause'),
                btnPrev:document.getElementById('btnPrev'),
                btnNext:document.getElementById('btnNext'),
        })
        this.videoControl.initVolume({
                outside:{
                    outPanel:document.getElementById('v-out'),
                    outBtnVolumeClose:document.getElementById('out-v-close'),
                    outBtnVolumeOpen:document.getElementById('out-v-open'),
                },
                inside:{
                    inPanel:document.getElementById('v-inside'),
                    inBtn:document.getElementById('v-in-btn'),
                    btnVolumeClose:document.getElementById('in-v-close'),
                    btnVolumeOpen:document.getElementById('in-v-open'),
                    progress:{
                        domTrack:document.getElementById('track-v'),
                        domSlide:document.getElementById('slide-v'),
                        domProgress:document.getElementById('progress-v'),
                        domLoadProgress:document.getElementById('loadProgress-v'),
                    }
                },
        }, 0.3, 1);

        // this.videoControl.btnPlayClick("");

    }


}

</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins/util';
.video-container {
    border:size(1) solid #aaa;
    padding: size(10);
    .video {
        border: size(1) solid #aaa;
        width: size(500);
        height: size(300);
    }
    .video-control {
        margin: size(10) 0;
        padding: size(15) size(30);
        background-color: #f4f4f4;
        border: size(1) solid #e9e9e9;
        @include border-radius(size(25));
        @include ik-box;
        @include ik-box-orient(horizontal);
        @include ik-box-align(center);
        .btn-control-play {
            width: size(48);
            height: size(48);
            position: relative;
            .btn {
                width: size(48);
                height: size(48);
                background-size: cover;
                background-position: 50%;
                position: absolute;
                left: 0;
                top: 0;
            }
            .btn-play {
                background-image: url('./images/video_play.png');
            }
            .btn-pause {
                background-image: url('./images/video_pause.png');
            }
        }
        .btn-icon {
            padding: size(6);
            .btn {
                width: size(34);
                height: size(34);
                background-size: cover;
                background-position: 50%;
            }
            .btn-control-next {
                background-image: url('./images/video_next.png');
            }
            .btn-control-prev {
                background-image: url('./images/video_prev.png');
            }
        }

        .video-pt {
            @include ik-box;
            @include ik-box-orient(horizontal);
            @include ik-box-align(center);
            @include ik-box-pack(justify);
            .track {
                padding: size(20) 0;
                margin: 0 size(15);
                .progress {
                    position: relative;
                    background-color: #eaeaea;
                    width: 100%;
                    height: size(12);
                    // border: size(1) solid #ccc;
                    @include border-radius(size(25));
                    .load-progress {
                        @include border-radius(size(25));
                        background-color: #bbdcef;
                        height: size(12);
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    .progress {
                        @include border-radius(size(25));
                        background-color: #f12644;
                        height: size(12);
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    .slide {
                        background-image: url('./images/video_slide.png');
                        width: size(26);
                        height: size(26);
                        background-size: cover;
                        background-position: 50%;
                        position: absolute;
                        left: -(size(3));
                        top: -(size((26-10)/2));
                        // opacity: 0.3;
                        // border: size(1) solid #333;
                    }
                }
            }
            .time-start {
                font-size: size(16);
                color: #000;
                // border: size(1) solid red;
            }
            .right10 {
                margin-right: size(10);
            }
        }
        .video-volume {
            position: relative;
            margin-left: size(20);
            .volume-outside {
                position: relative;
                width: size(34);
                height: size(34);
            }
            .volume-inside {
                position: absolute;
                @include border-radius(size(8));
                width: size(50);
                height: size(220);
                bottom: size(34);
                margin-left: -(size(8));
                // box-shadow: size(0) size(0) size(6) size(0) #d5d5d5;
                background-color: #fff;
                border: size(1) solid #d5d5d5;
                .inside-btn {
                    position: relative;
                    width: size(34);
                    height: size(34);
                    margin: size(5) auto;
                    margin-top: size(10);
                }
                .track-v {
                    width: size(40);
                    margin: size(15) auto auto auto;
                    // position: relative;
                    .progress {
                        position: relative;
                        background-color: #eaeaea;
                        width: size(12);
                        height: 100%;
                        // border: size(1) solid #ccc;
                        margin: 0 auto;
                        @include border-radius(size(25));
                        .load-progress {
                            @include border-radius(size(25));
                            background-color: #bbdcef;
                            width: size(12);
                            position: absolute;
                            left: 0;
                            top: 0;
                        }
                        .progress {
                            @include border-radius(size(25));
                            background-color: #f12644;
                            width: size(12);
                            position: absolute;
                            left: 0;
                            top: 0;
                        }
                        .slide {
                            background-image: url('./images/video_slide.png');
                            width: size(26);
                            height: size(26);
                            background-size: cover;
                            background-position: 50%;
                            position: absolute;
                            left: -(size((26-10)/2));
                            top: -(size(3));
                            // opacity: 0.3;
                            // border: size(1) solid #333;
                        }
                    }
                }
            }
            .btn {
                width: size(34);
                height: size(34);
                background-size: cover;
                background-position: 50%;
                position: absolute;
            }
            .btn-open {
                background-image: url('./images/video_volume0.png');
            }
            .btn-close {
                background-image: url('./images/video_volume1.png');
            }
        }
    }
}
.mr10 {
    margin-right: size(10);
}
.mr20 {
    margin-right: size(20);
}
</style>