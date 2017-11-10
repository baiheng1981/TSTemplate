import {VideoPlayer, VideoEventType, VideoLoadProgressItem} from './VideoPlayer';
import {ScrollBar, ScrollBarEventType} from '../scroll/ScrollBar';

/**
 * VideoPlayer 控制
 */
class VideoControl {
    userAgent:string;
    video:VideoPlayer;

    /**
     * VideoPlayer 控制
     * dependencies ScrollBar.ts VideoPlayer.ts
     * @param _video 要控制的VideoPlayer
     *
     * initButton 初始化：控制按钮
     *
     * initProgress 初始化：进度条
     *      html recommended structure:
                <div id="track" style="width:2rem;">                    //滚动条的长度(width, height)
                    <div id="loadProgress" style="width:0;"></div>
                    <div id="progress" style="width:0;"></div>
                    <div id="slide" style="position:absolute;"></div>   //slide须定位
                </div>
     * initTimeShow 初始化：时间显示
     *
     */
    constructor(_video:VideoPlayer){
        this.userAgent = "pc";
        let _ua = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i);
        if (_ua != null) {
            this.userAgent = "moblie";
        }

        this.video = _video;

        this.video.addEvent(VideoEventType.loadprogress, this.videoLoadprogressHandler);
        this.video.addEvent(VideoEventType.muted, this.videoMutedHandler);
        this.video.addEvent(VideoEventType.timeupdate, this.videoTimeupdateHandler);
        this.video.addEvent(VideoEventType.status, this.videoStatusHandler);
        this.video.addEvent(VideoEventType.loadedmetadata, this.videoLoadedmetadataHandler);
    }
    clear():void{
        if(this.progress){
            this.progress.clear();
            this.progress = null;
        }
        if( this.video ){
            this.video.removeEvent(VideoEventType.loadprogress);
            this.video.removeEvent(VideoEventType.muted);
            this.video.removeEvent(VideoEventType.timeupdate);
            this.video.removeEvent(VideoEventType.status);
            this.video.clear();
            this.video = null;
        }
        if(this.volumeProgress){
            this.volumeProgress.clear();
            this.volumeProgress = null;
        }
        this.inPanelWindowMouseClear();
    }
    //===========================================button control start
    private buttonDomDic:IButtonDomDic;
    initButton(_domDic:IButtonDomDic):void {
        this.buttonDomDic = _domDic;

        this.btnShowPlay(true);

        this.eleAddListener(this.buttonDomDic.btnPrev, "click", this.btnPrevClick);
        this.eleAddListener(this.buttonDomDic.btnNext, "click", this.btnNextClick);
        this.eleAddListener(this.buttonDomDic.btnPause, "click", this.btnPauseClick);
        this.eleAddListener(this.buttonDomDic.btnPlay, "click", this.btnPlayClick);
        this.eleAddListener(this.buttonDomDic.btnStop, "click", this.btnStopClick);
    }
    btnPrevClick = (e) => {
        this.video.playPrev();
    }
    btnNextClick = (e) => {
        this.video.playNext();
    }
    btnPauseClick = (e) => {
        this.video.pause();
    }
    btnPlayClick = (e) => {
        this.video.play();
    }
    btnStopClick = (e) => {
        this.video.stop();
    }


    updateButtonPlayStatus(_status:string):void {
        switch(_status) {
            case VideoEventType.play: this.btnShowPlay(false); break;
            case VideoEventType.pause: this.btnShowPlay(true); break;
            case VideoEventType.stop: this.btnShowPlay(true); break;
            case VideoEventType.ended: this.btnShowPlay(true); break;
            default: this.btnShowPlay(true);
        }
    }
        btnShowPlay(_bo:boolean):void {
            if(!this.buttonDomDic) return;
            if(_bo){
                this.showDom(this.buttonDomDic.btnPlay, true);
                this.showDom(this.buttonDomDic.btnPause, false);
            }else{
                this.showDom(this.buttonDomDic.btnPause, true);
                this.showDom(this.buttonDomDic.btnPlay, false);
            }
        }
    updateBtnVolume():void {
        if(!this.buttonDomDic) return;
    }

    //===========================================button control end


    //===========================================progress start
    progress:ScrollBar;
    private proDomDir:IProgressDomDic;

    initProgress(_dom:IProgressDomDic, _slideOffset?:number):void{
        this.proDomDir = _dom;
        _slideOffset = _slideOffset || 0;

        this.progress = new ScrollBar("horizontal", false, "progress");
        this.progress.enabled = false;
        this.progress.initDom(this.proDomDir, _slideOffset);
        this.progress.addEvent(ScrollBarEventType.scroll, this.progressScroll);
    }
    progressScroll = (e:{[key:string]:number}) => {
        // console.log(e)
        if (this.progress && this.progress.slideIsDarg == true) {
            this.updateTimeShow(e.value, e.valueMax);
        }else {
            // console.log("progressScroll:", e);
            this.videoSetCurrentTimePer(e.percent);
        }
    }
    //===========================================progress end


    //===========================================time show start
    private timeShowDomDic:ITimeShowDomDic;
    initTimeShow(_timeCOM:ITimeShowDomDic):void {
        this.timeShowDomDic = _timeCOM;
    }
    updateTimeShow(_curr?:number, _dur?:number):void {
        if(!this.timeShowDomDic) return;
        if(this.timeShowDomDic.current && _curr>-1)
            this.timeShowDomDic.current.innerHTML = this.timeFormat(_curr);
        if(this.timeShowDomDic.duration && _dur>-1)
            this.timeShowDomDic.duration.innerHTML = this.timeFormat(_dur);
    }

    //===========================================time show end

    //===========================================volume start
    private volumeDomDic:IVolumeDomDic;
    private volumeProgress:ScrollBar;
    private insideShow:boolean;
    initVolume(_volumeDic:IVolumeDomDic, _slideOffset?:number, _volume?:number):void{
        this.volumeDomDic = _volumeDic;
        _slideOffset = _slideOffset || 0;
        _volume = _volume || 1;

        this.eleAddListener(this.volumeDomDic.outside.outPanel, "click", this.outPanelClick);
        this.eleAddListener(this.volumeDomDic.inside.inBtn, "click", this.inBtnClick);

        if(this.volumeDomDic.inside){
            if(this.volumeDomDic.inside.progress){
                this.volumeProgress = new ScrollBar("vertical", true, "volume");
                this.volumeProgress.initDom(this.volumeDomDic.inside.progress, _slideOffset);
                this.volumeProgress.addEvent(ScrollBarEventType.scroll, this.volumeProgressScroll);
                this.volumeProgress.updateValue(_volume, 0, 1);
            }
            this.inPanelShow(false);
        }
        // console.log(this.volumeProgress)
    }
    //outside
    outPanelClick = (e:Event) => {
        // console.log("outPanelClick");
        this.inPanelShow(!this.insideShow);
    }
    //inside
    volumeProgressScroll = (e:{[key:string]:number}) => {
        // console.log(e)
        this.video.volume = e.value;
        if(e.value==0){
            this.video.soundClose();
        }else{
            this.video.soundOpen();
        }
    }
    inBtnClick = (e:Event) => {
        if(this.video.muted){
            this.video.soundOpen();
        }else {
            this.video.soundClose();
        }
    }
    inPanelShow(_bo:boolean):void {
        this.showDom(this.volumeDomDic.inside.inPanel, _bo);
        this.insideShow = _bo;
        if(this.insideShow==true){
            if (this.userAgent == "pc") {
                window.addEventListener("mousedown", this.inPanelWindowMouse);
            }else{
                window.addEventListener("touchstart", this.inPanelWindowMouse);
            }
        }else {
            this.inPanelWindowMouseClear();
        }
    }
    inPanelWindowMouse = (e:TouchEvent | MouseEvent) => {
        let _allow:boolean = judgeParentIsSelf(e.target as Node, this.volumeDomDic.inside.inPanel);
        if(_allow==false){
            _allow = judgeParentIsSelf(e.target as Node, this.volumeDomDic.outside.outPanel);
        }
        // console.log("inPanelWindowMouse:", e, _allow);
        if(_allow==false){
            this.inPanelWindowMouseClear();
            this.inPanelShow(false);
        }
    }
    inPanelWindowMouseClear = () => {
        window.removeEventListener("mousedown", this.inPanelWindowMouse);
        window.removeEventListener("touchstart", this.inPanelWindowMouse);
    }
    //===========================================volume end



    //=========================================video controller start
    videoSetCurrentTimePer(_per:number):void {
        this.video.setCurrentTimePer(_per);
    }
    //=========================================video controller end


    //=========================================under video controller start
    videoMutedHandler = (e:boolean) => {
        if(!this.buttonDomDic) return;
        if(e){//静音
            //inside
            this.showDom(this.volumeDomDic.inside.btnVolumeClose, true);
            this.showDom(this.volumeDomDic.inside.btnVolumeOpen, false);
            //outside
            this.showDom(this.volumeDomDic.outside.outBtnVolumeClose, true);
            this.showDom(this.volumeDomDic.outside.outBtnVolumeOpen, false);
        }else{
            //inside
            this.showDom(this.volumeDomDic.inside.btnVolumeClose, false);
            this.showDom(this.volumeDomDic.inside.btnVolumeOpen, true);
            //outside
            this.showDom(this.volumeDomDic.outside.outBtnVolumeClose, false);
            this.showDom(this.volumeDomDic.outside.outBtnVolumeOpen, true);
        }
    }
    videoTimeupdateHandler = (e:{[key:string]:number}) => {
        if(!this.progress) return;
        let per = e.currentTime / e.duration;
        if (this.progress.slideIsDarg == false) {
            this.progress.setSlidePositionPer(per);
            this.updateTimeShow(e.currentTime, e.duration);
        }
    }
    videoStatusHandler = (_status:string) => {
        this.updateButtonPlayStatus(_status);
        if(!this.progress) return;
        if(_status==VideoEventType.stop || _status==VideoEventType.ended){
            this.progress.reset();
            this.progress.enabled = false;
        }
        // console.log("videoStatusHandler status:", _status, this.progress.enabled)
    }
    videoLoadedmetadataHandler = () => {
        if(!this.progress) return;
        this.progress.enabled = true;
        this.progress.updateValue(0, 0, this.video.duration);
        // console.log("videoLoadedmetadataHandler:", this.progress.enabled)
    }
    videoLoadprogressHandler = (_arg:VideoLoadProgressItem) =>{
        // console.log("videoLoadprogressHandler:", _arg)
        if(!this.progress) return;
        this.progress.updateLoadProgressPer(_arg.loadPercent);
    }
    //=========================================under video controller end


    //==========================================utils
    eleAddListener(_ele:HTMLElement, _eventType:string, _listener:EventListener):void {
        if(!_ele) return;
        _ele.addEventListener(_eventType, _listener, false);
    }
    isVideoStop(){
        if(this.video){
            if(this.video.status==VideoEventType.stop || this.video.status==VideoEventType.ended){
                return true;
            }else{
                return false;
            }
        }
        return true;
    }
    getMouseX(e):number {
        let site = 0;
        if (this.userAgent == "pc") {
            site = e.pageX;
        } else {
            site = e.changedTouches[0].pageX;
        }
        return site;
    }
    getBoundingRect(_dom:HTMLElement):ClientRect {
        return _dom.getBoundingClientRect();
    }
    showDom(_dom:HTMLElement, _show:boolean):void {
        if(!_dom) return;
        if(_show==true){
            _dom.style.display = "block";
        }else {
            _dom.style.display = "none";
        }
    }
    /**
     * @method toFixed  保留小数
     * @param {number} _num  要计算的数字
     * @param {number} _dec  保留位数，默认2
     * @return {number}
     */
    toFixed(_num:number | string, _dec?:number):number {
        _dec = _dec || 2;
        let num = parseFloat(_num.toString()).toFixed(_dec);
        // console.log("toFixed:", num)
        return parseFloat(num);
    }
    //转成 00:00:00 (秒)
    timeFormat(_num:number) {
        _num = _num || 0;
        if(_num==0){
            return "00:00";
        }
        let h = "0";
        let m = "0";
        let s = "0";
        let _time = "";
        if (_num > 3600) {
            h = parseInt((_num / 3600).toString()).toString();
            if (h.length == 1) h = "0" + h;
            _time += h + ":";
        }
        m = parseInt((_num % 3600 / 60).toString()).toString();
        if (m.length == 1) m = "0" + m;
        _time += m + ":";
        s = parseInt((_num % 3600 % 60).toString()).toString();
        if (s.length == 1) s = "0" + s;
        _time += s;
        // console.log("time:", _num, _time)
        return _time;
    }

    disabledMove = () => {
        window.addEventListener('touchmove', this.preventDefault);
        window.addEventListener('mousemove', this.preventDefault);
    }
    ableMove = () => {
        window.removeEventListener('touchmove', this.preventDefault);
        window.removeEventListener('mousemove', this.preventDefault);
    }
        preventDefault = (e:TouchEvent | MouseEvent)=> {
            // console.log(e)
            if (e.cancelable) {
                // 判断默认行为是否已经被禁用
                if (!e.defaultPrevented) {
                    e.preventDefault();
                }
            }
            e.stopPropagation();
        }

    setRem(_num:number){
        // return _num/this.getRem()+"rem";
        return _num+"px";
    }
}
function judgeParentIsSelf(dom:Node, target:Node):boolean{
    if(dom==target){
        return true;
    }else{
        if(!dom.parentNode || dom.parentNode==document.body){
            return false;
        }else{
            return judgeParentIsSelf(dom.parentNode, target);
        }
    }
}

/** 播放时间显示 dom dic */
interface ITimeShowDomDic {
    /** dom 显示当前时间 */
    current?:HTMLElement,
    /** dom 显示总时间 */
    duration?:HTMLElement,
    // [name:string]:HTMLElement,
}
/** progress dom dictionary */
interface IProgressDomDic {
    /** 滑轨 */
    domTrack:HTMLElement;
    /** 下载进度 */
    domLoadProgress?:HTMLElement;
    /** 播放进度 */
    domProgress:HTMLElement;
    /** slide (position:absolute) */
    domSlide:HTMLElement;
}
/** 控制按钮 dom */
interface IButtonDomDic {
    btnPrev?:HTMLElement,
    btnNext?:HTMLElement,
    btnPause?:HTMLElement,
    btnPlay?:HTMLElement,
    btnStop?:HTMLElement,
}
/** 音量控制 */
interface IVolumeDomDic {
    //inside
    inside?:{
        inPanel?:HTMLElement;
        inBtn?:HTMLElement;
            btnVolumeClose?:HTMLElement,
            btnVolumeOpen?:HTMLElement,
        progress: {
            /** 滑轨 */
            domTrack:HTMLElement;
            /** 下载进度 */
            domLoadProgress?:HTMLElement;
            /** 播放进度 */
            domProgress:HTMLElement;
            /** slide (position:absolute 必须定位) */
            domSlide:HTMLElement;
        },
    },
    //outside
    outside?:{
        outPanel?:HTMLElement,
        outBtnVolumeClose?:HTMLElement,
        outBtnVolumeOpen?:HTMLElement,
    }

}

export { VideoControl, IProgressDomDic, ITimeShowDomDic, IButtonDomDic, IVolumeDomDic }