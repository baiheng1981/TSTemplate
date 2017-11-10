"use strict";
/**
 * VideoPlayer
 *
 */
class VideoPlayer {
    video:HTMLVideoElement;

    private _status:string = VideoEventType.stop;
    /**
     * video状态：stop停止 | play播放 | pause暂停 | ended播放完成
     */
    get status():string {
        return this._status;
    };
    set status(_type:string) {
        this._status = _type;
        this.triggerEvent(VideoEventType.status, this._status);
    }

    urlList:string[];//播放列表
    url:string = "";//当前播放url

    loadErrorInt:number = 0;//加载资源重试计数


    private _preload:string = "auto";
    private _autoplay:boolean = true;
    private _loop:boolean = true;
    private _volume:number = 1;
    private _width:number = 100;
    private _height:number = 100;
    private _poster:string = "";
    private _currentTime:number = 0;
    private _canPlay:boolean = false;
    private _index = 0;
    private _playMode:string = VideoPlayMode.order;

    private _progressRepeate:number;//下载时重复检查进度(临时计时)



    constructor(_video:HTMLVideoElement, _w?:number, _h?:number){
        this.video = _video;
        //不全屏
        this.video.setAttribute("webkit-playsinline", "true");
        this.video.setAttribute("x-webkit-airplay", "true");

        if(_w) this.width = _w;
        if(_h) this.height = _h;

        this.init();
    }

    init():void{
        this.preload = "auto";
        this.autoplay = true;
        this.loop = true;
        this.volume = 1;
        this.video.muted = false;
        this.urlList = [];

        this.video.addEventListener("loadstart", this.loadStart, false);
        this.video.addEventListener("progress", this.loadProgress, false);
        this.video.addEventListener("loadedmetadata", this.loadedMetadata, false);
        this.video.addEventListener("canplay", this.loadCanplay, false);
        this.video.addEventListener("canplaythrough", this.loadCanplaythrough, false);
        this.video.addEventListener("error", this.loadError, false);

        this.video.addEventListener("play", this.video_play, false);
        this.video.addEventListener("pause", this.video_pause, false);
        this.video.addEventListener("ended", this.video_ended, false);
        this.video.addEventListener("playing", this.video_playing, false);
        this.video.addEventListener("waiting", this.video_waiting, false);
        this.video.addEventListener("abort", this.video_abort, false);
        this.video.addEventListener("seeked", this.video_seeked, false);
        this.video.addEventListener("seeking", this.video_seeking, false);
        this.video.addEventListener("suspend", this.video_suspend, false);
        this.video.addEventListener("stalled", this.video_stalled, false);
        this.video.addEventListener("timeupdate", this.video_timeupdate, false);
        this.video.addEventListener("volumechange", this.video_volumechange, false);
    }
    clear() {
        this.stop();
        this.removeEvents();
        this.video = null;
    }
    //===================================prototype
    /** 预览图（海报图片） */
    get poster():string{
        return this._poster;
    }
    set poster(_url:string) {
        this._poster = _url;
        this.video.poster = this._poster;
    }
    /**
     *  auto - 当页面加载后载入整个视频
        meta - 当页面加载后只载入元数据
        none - 当页面加载后不载入视频
     */
    get preload():string{
        return this._preload;
    }
    set preload(_type:string) {
        this._preload = _type;
        this.video.preload = this._preload;
    }
    /** 自动播放 */
    get autoplay():boolean{
        return this._autoplay;
    }
    set autoplay(_bo:boolean) {
        this._autoplay = _bo;
        this.video.autoplay = this._autoplay;
    }

    get loop():boolean{
        return this._loop;
    }
    set loop(_bo:boolean) {
        this._loop = _bo;
    }
    /**
     * enum VideoPlayMode
     * order -> 顺序; random -> 随机; loop -> 循环; singleCycle -> 单曲循环;
     */
    get playMode():string {
        return this._playMode;
    }
    set playMode(_mode:string){
        this._playMode = _mode;
    }


    get volume():number{
        return this._volume;
    }
    set volume(_num:number) {
        this._volume = _num || 0;
        if(this._volume>1) this._volume = 1;
        if(this._volume<0) this._volume = 0;
        // console.log("set volume:", this._volume)
        this.video.volume = this._volume;
        if (this._volume <= 0) {
            this.soundClose();
        } else {
            this.soundOpen();
        }
    }

    get height():number{
        return this._height;
    }
    set height(_num:number) {
        this._height = _num || 0;
        this.video.height = this._height;
    }

    get width():number{
        return this._width;
    }
    set width(_num:number) {
        this._width = _num || 0;
        this.video.width = this._width;
    }
    /** 视频播放的当前位置（以秒计）*/
    get currentTime():number{
        return this.video.currentTime;
    }
    set currentTime(_num:number) {
        this._currentTime = _num || 0;
        this.video.currentTime = this._currentTime;
    }
    /** 是否已下载到足够的文件流，可以开始流播放 */
    get canPlay():boolean{
        return this._canPlay;
    }
    set canPlay(_bo:boolean) {
        this._canPlay = _bo;
    }
    /** 当前播放索引 */
    get index():number{
        return this._index;
    }
    set index(_index:number) {
        let _i:number = _index || 0;
        if (this.urlList.length == 0) {
            console.log("播放列表为空");
            this.stop();
            this.triggerEvent(VideoEventType.errors, "播放列表为空");
            return;
        }
        if (_i >= this.urlList.length) {
            console.log("列表播放结束");
            this.stop();
            this.triggerEvent(VideoEventType.listComplete);
            if(this.playMode==VideoPlayMode.loop){
                _i = 0;
            }else {
                this.triggerEvent(VideoEventType.errors, "列表播放结束");
                return;
            }
        }
        if (_i < 0) {
            console.log("已是第1首");
            if(this.playMode==VideoPlayMode.loop){
                _i = this.urlList.length - 1;
            }else {
                this.triggerEvent(VideoEventType.errors, "已是第1首");
                return;
            }
        }
        this._index = _i;
        this.url = this.urlList[this._index];
        this.video.pause();
        this.canPlay = false;
        console.log("开始第 " + this._index + " 首:", this.url)
        this.video.src = this.url;
        this.video.load();
    }
    /**
     * 总时长
     */
    get duration():number{
        return this.video.duration;
    }
    /**
     * 暂停状态
     */
    get paused():boolean{
        return this.video.paused;
    }
    /**
     * 静音状态
     */
    get muted():boolean{
        return this.video.muted;
    }
    //=================================method
    load(_list:string[]) {
        this.urlList = this.urlList.concat(_list);
    }
    play() {
        if(this.status==VideoEventType.stop){
            this.index = this._index;
        }else {
            if (this._currentTime == 0) {
                this.currentTime = this._currentTime;
            }
            if (this.video.paused == true) {
                this.video.play();
            }
        }
    }
    pause() {
        this.video.pause();
        this._currentTime = this.video.currentTime;
    }
    stop() {
        this.status = VideoEventType.stop;
        this.video.pause();
        this.video_stop();
    }
    playPrev() {
        this.playModeRun(-1);
    }
    playNext() {
        this.playModeRun(1);
    }
    soundOpen() {
        this.video.muted = false;
        this.triggerEvent(VideoEventType.muted, false);
    }
    soundClose() {
        this.video.muted = true;
        this.triggerEvent(VideoEventType.muted, true);
    }
    setCurrentTime(_num:number) {
        this.currentTime = _num;
    }
    setCurrentTimePer(_per:number) {
        this.currentTime = this.duration * _per;
    }

    playModeRun(_offset?:number):void {
        _offset = _offset || 1;
        if(this.playMode==VideoPlayMode.order){
            this.index += _offset;
        }else if(this.playMode==VideoPlayMode.loop){
            if(this.index>=this.urlList.length-1){
                this.index = 0;
            }else {
                this.index += _offset;
            }
        }else if(this.playMode==VideoPlayMode.random){
            this.index = this.getRandomInt(0, this.urlList.length-1);
        }else if(this.playMode==VideoPlayMode.singleCycle){
            this.index = this._index;
        }
    }




    //==================================load
    loadStart = (e) => {
        console.log("loadStart:");
        this.triggerEvent(VideoEventType.loadstart);
    }
    loadProgress = (e) => {
        // console.log("video progress:", e.target.currentTime, e.target.duration);
    }
    loadedMetadata = (e) => {
        // console.log("loadedMetadata:", e);
        this.triggerEvent(VideoEventType.loadedmetadata);
        this.watchProgress();
    }
        watchProgress = () => {
            if(this._progressRepeate){
                clearTimeout(this._progressRepeate);
            }
            this._progressRepeate = setTimeout(this.triggerProgress, 100);
        }
        triggerProgress = () => {
            if(this.status==VideoEventType.stop || this.status==VideoEventType.ended){
                console.log("播放已停止，下载中断...");
                clearTimeout(this._progressRepeate);
                return;
            }
            let timeRanges:TimeRanges = this.video.buffered;
            let time:number = this.video.currentTime;
            if (timeRanges.length == 0) {
                this._progressRepeate = setTimeout(this.triggerProgress, 100);
                return;
            }
            let range:number = 0;
            while (!(timeRanges.start(range) <= time && time <= timeRanges.end(range))) {
                if (range < timeRanges.length - 1) {
                    range++;
                } else {
                    break;
                }
            }

            let percentStart:number = timeRanges.start(range) / this.video.duration;
            let percentEnd:number = timeRanges.end(range) / this.video.duration;
            let percent:number = percentEnd - percentStart;

            let pitem = new VideoLoadProgressItem();
            pitem.loadPerStart = percentStart;
            pitem.loadPerEnd = percentEnd;
            pitem.loadPercent = percent;
            pitem.duration = this.video.duration;
            pitem.rangeStart = timeRanges.start(range);
            pitem.rangeEnd = timeRanges.end(range);
            this.triggerEvent(VideoEventType.loadprogress, pitem);
            if (percent >= 1 || pitem.rangeEnd >= this.video.duration) {
                // console.log("下载完成！");
                this.triggerEvent(VideoEventType.loadend);
                if(this._progressRepeate){
                    clearTimeout(this._progressRepeate);
                }
            } else {
                this._progressRepeate = setTimeout(this.triggerProgress, 100);
            }
        }
    loadCanplay = (e) => {
        // console.log("loadCanplay:");
        this.canPlay = true;
        this.triggerEvent(VideoEventType.canplay);
    }
    /**
     * 在媒体的readyState变为CAN_PLAY_THROUGH时触发，表明媒体可以在保持当前的下载速度的情况下不被中断地播放完毕。注意：手动设置currentTime会使得firefox触发一次canplaythrough事件，其他浏览器或许不会如此。
     */
    loadCanplaythrough = (e) => {
        // console.log("loadCanplaythrough:");
    }
    loadError = (e) => {
        // console.log("loadError:");
        this.triggerEvent(VideoEventType.errors, e);

        this.loadErrorInt++;
        console.log(this.url + " 加载错误：" + this.loadErrorInt + "   error:", JSON.stringify(e));
        if (this.loadErrorInt >= 5) {
            // window.location.reload(true);
            console.log("加载错误 重试超过5次，终止请求")
            this.triggerEvent(VideoEventType.errors, "加载错误 重试超过5次，终止请求");
            return;
        }
        this.stop();
        this.video.load();
    }


    //====================================Video custom event
    video_play = (e)=>{
        // console.log("video_play:");
        this.status = VideoEventType.play;
    }
    video_pause = (e)=> {
        // console.log("video_pause:");
        if(this.status != VideoEventType.stop){
            this.status = VideoEventType.pause;
        }
    }
    video_stop() {
        // console.log("video_stop");
    }
    video_ended = (e)=> {
        // console.log("video_ended:", this.video.paused);
        this.status = VideoEventType.ended;
        this.playModeRun(1);
    }
    video_playing = (e)=> {
        // console.log("video_playing:");
        this.triggerEvent(VideoEventType.playing);
    }
    video_waiting = (e)=> {
        // console.log("video_waiting:");
        this.triggerEvent(VideoEventType.waiting);
    }
    video_abort = (e)=> {
        // console.log("video_abort:");
        this.triggerEvent(VideoEventType.abort);
    }
    video_seeked = (e)=> {
        // console.log("video_seeked:");
        this.triggerEvent(VideoEventType.seeked);
    }
    video_seeking = (e)=> {
        // console.log("video_seeking:");
        this.triggerEvent(VideoEventType.seeking);
    }
    video_suspend = (e)=> {
        // console.log("video_suspend:");
        this.triggerEvent(VideoEventType.suspend);
    }
    video_stalled = (e)=> {
        // console.log("video_stalled:");
        this.triggerEvent(VideoEventType.stalled);
    }
    video_timeupdate = (e)=> {
        let _param:{[key:string]:number} = {};
        _param.duration = this.duration;
        _param.currentTime = this.currentTime;
        this.triggerEvent(VideoEventType.timeupdate, _param);
        // console.log("video_timeupdate:", this.duration, this.currentTime);
    }
    video_volumechange = (e)=>{
        // console.log("video_volumechange:", this.video.volume)
        let _param:{[key:string]:number} = {};
        _param.volume = this.video.volume;
        this.triggerEvent(VideoEventType.volumechange, _param);
    }



    private listenerList:{[key: string]:Function[]} = {};
    addEvent = (_type:string, _fn:Function):void => {
        if (!this.listenerList[_type]) {
            let list:Function[] = [];
            this.listenerList[_type] = list;
        }
        this.listenerList[_type].push(_fn);
    }
    triggerEvent = <T>(_type:string, _arg?:T):void => {
        let _arrayEvent:Function[] = this.listenerList[_type];
        if(_arrayEvent){
            for (let i = 0; i < _arrayEvent.length; i++) {
                _arrayEvent[i](_arg);
            }
        }
    }
    removeEvent = (_type:string, _fn?:Function):void => {
        let _arrayEvent:Function[] = this.listenerList[_type];
        if (_arrayEvent && _fn) {
            for (let i = 0; i < _arrayEvent.length; i++) {
                if (_arrayEvent[i] === _fn) {
                    this.listenerList[_type].splice(i, 1);
                    break;
                }
            }
        } else {
            delete this.listenerList[_type];
        }
    }
    removeEvents():void{
        for (let type in this.listenerList) {
            this.removeEvent(type);
        }
    }

    //=====================================utils
    /**
     * @method getRandomInt 获取范围内随机整数
     * @param minNum 起始值
     * @param maxNum 结束值
     * @return {number} 整数
     */
    getRandomInt(minNum:number, maxNum:number):number{
        return parseInt( (Math.random()*(maxNum-minNum+1)+minNum).toString(), 10)
    }
}
class VideoLoadProgressItem {
    /** 下载百分比 start */
    loadPerStart:number;
    /** 下载百分比 end */
    loadPerEnd:number;
    /** 下载百分比 */
    loadPercent:number;
    /** 播放文件总时长 */
    duration:number;
    /** 视频缓冲范围 返回使用指定索引开始范围的时间 */
    rangeStart:number;
    /** 视频缓冲范围 返回指定范围结束的时间 */
    rangeEnd:number;

    constructor(_param?:{[key:string]:number}){
        if(_param){
            this.loadPerStart = _param['loadPerStart'];
            this.loadPerEnd = _param['loadPerEnd'];
            this.loadPercent = _param['loadPercent'];
            this.duration = _param['duration'];
            this.rangeStart = _param['rangeStart'];
            this.rangeEnd = _param['rangeEnd'];
        }
    }
}
class VideoEvent<K> {
    type:string;
    target:VideoPlayer;
    param:K;
    constructor(_type:string, _target:VideoPlayer, _param?:K){
        this.type = _type;
        this.target = _target;
        this.param = _param;
    }
}
enum VideoEventType {
    /** 在媒体回放被暂停后再次开始时触发。即，在一次暂停事件后恢复媒体 */
    play = "play",
    /** 播放停止 */
    stop = "stop",
    /** 播放暂停时触发 */
    pause = "pause",
    /** 播放结束时触发 */
    ended = "ended",


    /** 在媒体开始播放时触发（不论是初次播放、在暂停后恢复、或是在结束后重新开始）。 */
    playing = "playing",
    /** 在一个待执行的操作（如回放）因等待另一个操作（如跳跃或下载）被延迟时触发。 */
    waiting = "waiting",

    /** 当音频/视频的加载已放弃时 */
    abort = "abort",
    /** 在跳跃操作完成时触发 */
    seeked = "seeked",
    /** 在跳跃操作开始时触发 */
    seeking = "seeking",
    /** 在媒体资源加载终止时触发，这可能是因为下载已完成或因为其他原因暂停 */
    suspend = "suspend",
    /** 当浏览器尝试获取媒体数据，但数据不可用时 */
    stalled = "stalled",

    /** 下载开始 */
    loadstart = "loadstart",
    /** 媒体的元数据已经加载完毕 */
    loadedmetadata = "loadedmetadata",
    /** 在媒体数据已经有足够的数据（至少播放数帧）可供播放时触发。这个事件对应CAN_PLAY的readyState。 */
    canplay = "canplay",
    /** 下载完成 */
    loadend = "loadend",
    /** 下载进度 */
    loadprogress = "loadprogress",
    /** 错误信息 */
    errors = "errors",

    /** 静音 */
    muted = "muted",
    /** 当目前的播放位置已更改时 */
    timeupdate = "timeupdate",
    /** 当音量已更改时 */
    volumechange = "volumechange",
    /** 播放状态改变时触发 */
    status = "status",

    /** 列表播放完成 */
    listComplete = "listComplete",
}
/** 播放模式 */
enum VideoPlayMode {
    /** 列表顺序 */
    order = "order",
    /** 列表随机 */
    random = "random",
    /** 列表循环(顺序) */
    loop = "loop",
    /** 单曲循环 */
    singleCycle = "singleCycle",
}

export {VideoPlayer, VideoEventType, VideoLoadProgressItem}