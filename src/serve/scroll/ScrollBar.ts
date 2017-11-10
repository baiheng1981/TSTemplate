/**
 * ScrollBar
 * html recommended structure:
    <div id="track" style="width:2rem;">                    //滚动条的长度(width, height)
        <div id="loadProgress" style="width:0;"></div>
        <div id="progress" style="width:0;"></div>
        <div id="slide" style="position:absolute;"></div>   //slide须定位
    </div>
 * @constructor _direction方向, _name名字
 * @method initDom 初始化dom(Interface IScrollBarDomDic)
 * @method reset    复位
 * @method updateValue  刷新数值
 * @method setSlidePositionPer  设置Slide的Position(百分比)
 * @method updateLoadProgress   刷新下载进度条(_loaded已下载数值, _total总数值)
 * @method updateLoadProgressPer   刷新下载进度条(_per百分比)
 * @method addEvent 添加事件侦听
 * @method triggerEvent 广播事件
 * @method removeEvent 删除事件
 * @method removeEvents 删除所有事件
 *
 * @property {boolean} slideIsDarg  slide是否处于拖动状态(默认:false)
 * @property {boolean} enabled  是否允许滚动(默认:true允许)
 * @property {get number} percent  当前进度百分比
 * @property {get set number} slideOffset  slide图形相对与track的偏移量
 * @event ScrollBarEventType  事件名称，enum ScrollBarEventType
 */
class ScrollBar {
    userAgent:string;
    name:string;
    //resize
    evt:string;
    resizeList:Array<HTMLElement> = [];

    /**
     * ScrollBar
     * @param _direction    //方向： "horizontal"水平(默认)，"vertical"垂直
     * @param _name         //name
     */
    constructor(_direction?:string, _invert?:boolean, _name?:string){
        this.direction = _direction || "horizontal";
        this.invert = _invert || false;
        this.name = _name;
        this.userAgent = "pc";
        let _ua = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i);
        if (_ua != null) {
            this.userAgent = "moblie";
        }
        // console.log(this.name+" invert:", this.invert);
    }
    clear():void{
        window.removeEventListener(this.evt, this.orientationHanlder, false);
        this.slideClearWindowListener();
        this.removeEvents();
    }
    /** 复位 */
    reset():void {
        this.updateLoadProgressPer(0);
        // console.log(this.name + " reset");
        this.updateValue(0, 0, 1);
    }
    //=====================================data
    private _direction:string = "horizontal";
    /**
     * 方向： "horizontal"水平，"vertical"垂直
     */
    get direction():string {
        return this._direction;
    }
    set direction(_d:string){
        this._direction = _d;
    }
    /** invert (boolean) 是否颠倒 */
    invert:boolean = false;

    private _value:number = 0;
    get value():number {
        return this._value;
    }
    set value(_num:number){
        this._value = _num;
        this.valueLimit();
        this.valueRun();
    }
    private _valueMin:number = 0;
    get valueMin() {
        return this._valueMin;
    }
    set valueMin(_num) {
        this._valueMin = _num;
        this.valueRun();
    }
    private _valueMax:number = 0;
    get valueMax() {
        return this._valueMax;
    }
    set valueMax(_num) {
        this._valueMax = _num;
        this.valueRun();
    }
    //===================================method data
    /**
     * 刷新数值
     * @param _val  当前值
     * @param _min  起始值
     * @param _max  终点值
     */
    updateValue(_val:number, _min:number, _max:number):void {
        this._value = _val;
        this._valueMin = _min;
        this._valueMax = _max;
        this.valueRun();
    }
    valueRun():void {
        let _per:number = 0;
        if(!this.enabled){
            _per = 0;
        }else {
            _per = this.value / this.valueMax || 0;
        }
        let _ty:number = 0;
        if (!this.isHorizontal() && this.invert) {//垂直翻转
            _ty = this.positionMax - _per * (this.positionMax - this.positionMin);
        } else {
            _ty = _per * (this.positionMax - this.positionMin) + this.positionMin;
        }
        this.slideTarget = _ty;
        // console.log("valueRun:", _ty, _per)
        this.slideRun();
    }

    valueLimit():void {
        if (this._value < this._valueMin) this._value = this._valueMin;
        if (this._value > this._valueMax) this._value = this._valueMax;
    }
    //=====================================dom
    private domDic:IScrollBarDomDic;

    private isInDomTrack:boolean;
    /** slide是否处于拖动状态 */
    slideIsDarg:boolean = false;
    /** 是否允许滚动 */
    enabled:boolean = true;

    private slideSize:number = 0;
    private slideStart:number = 0;;//slide拖动起始坐标
    private slideTarget:number = 0;//slide目标坐标
    private trackSize:number = 0;
    private trackStart:number = 0;//track起点
    private trackEnd:number = 0;//track终点
    private trackXMin:number = 0;//滑轨起始坐标
    private trackLeft:number;
    private trackRight:number;
    private trackTop:number;
    private trackBottom:number;

    private positionMin:number = 0;
    private positionMax:number = 0;
    _position:number = 0;
    get position():number {
        return this._position;
    }
    set position(_num:number) {
        if(!this.domDic) return;
        this._position = _num;
        this._value = this.valueMax * this.percent; //当前滑动值
        if(this.isHorizontal()){
            this.domDic.domSlide.style.left = this.setUnit(this._position - this.trackXMin);
        }else{
            this.domDic.domSlide.style.top = this.setUnit(this._position - this.trackXMin);
        }
        this.updateProgress();
    }

    /** 当前进度百分比 */
    get percent():number {
        let _per:number = 0;
        if(!this.isHorizontal() && this.invert){//垂直翻转
            _per = (this.positionMax - this.position) / (this.positionMax - this.positionMin);
        }else {
            _per = (this.position - this.positionMin) / (this.positionMax - this.positionMin);
        }
        return _per;
    }

    private _slideOffset:number = 0;
    /**
     * slide 图形偏移量(百分比)
     */
    get slideOffset():number {
        return this._slideOffset;
    }
    set slideOffset(_num:number) {
        this._slideOffset = _num;
        // this.updateDomData();
    }

    //====================================method dom
    /**
     * initDom 初始化dom
     * @param {Interface} _domDic Interface IScrollBarDomDic
     * @param {number} _slideOffset slide 图形偏移量(百分比)
     */
    initDom(_domDic:IScrollBarDomDic, _slideOffset?:number):void {
        this.domDic = _domDic;
        this.slideOffset = _slideOffset || 0;

        if (this.userAgent == "pc") {
            this.domDic.domSlide.addEventListener("mousedown", this.slideMouseDown, false);
            this.domDic.domTrack.addEventListener("mousedown", this.trackMouseDown, false);
            this.domDic.domTrack.addEventListener("mouseenter", this.trackMouseEnter, false);
            this.domDic.domTrack.addEventListener("mouseleave", this.trackMouseLeave, false);
        } else {
            this.domDic.domSlide.addEventListener("touchstart", this.slideMouseDown, false);
            this.domDic.domTrack.addEventListener("touchstart", this.trackMouseDown, false);
        }

        this.updateDomData();
        this.addResize();
    }
    updateDomData():void {
        if(!this.domDic) return;
        // console.log(this.name+" updateDomData >>>>");
        this.getResizeList(this.domDic.domTrack);
        if(this.resizeList.length>0) this.setResizeList(true);
        // console.log("resizeList:", this.resizeList)

        if(this.domDic.domSlide){
            this.domDic.domSlide.style.position = "absolute";
            this.slideSize = this.isHorizontal() ? this.domDic.domSlide.clientWidth : this.domDic.domSlide.clientHeight;
        }
        let _SOSize:number = this.slideSize * this.slideOffset;
        // console.log("xxxxxxxxxxx _SOSize:", _SOSize)
        let _pos = getElementPos(this.domDic.domTrack);
        this.trackLeft = _pos.left;
        this.trackTop = _pos.top;
        if(this.isHorizontal()){
            this.trackSize = this.domDic.domTrack.clientWidth;
            this.trackXMin = this.trackLeft;

            this.trackStart = this.trackLeft - this.slideSize;
            this.trackEnd = this.trackStart + this.trackSize + this.slideSize*2;
            this.positionMin = this.trackLeft - _SOSize;
            this.positionMax = this.positionMin + this.trackSize - this.slideSize + _SOSize*2;
        }else {
            this.trackSize = (this.domDic.domTrack.clientHeight);
            this.trackXMin = (this.trackTop);

            this.trackStart = (this.trackTop - this.slideSize);
            this.trackEnd = (this.trackStart + this.trackSize + this.slideSize*2);
            this.positionMin = (this.trackTop - _SOSize);
            this.positionMax = (this.positionMin + this.trackSize - this.slideSize + _SOSize*2);
        }
        /* console.log({
            trackLeft: this.trackLeft,
            trackTop: this.trackTop,
            trackSize: this.trackSize,
            trackEnd: this.trackEnd,
            positionMin: this.positionMin,
            positionMax: this.positionMax,
        }) */

        this.valueRun();

        this.resetResizeList();
    }

    slideMouseDown = (e:TouchEvent | MouseEvent):boolean => {
        // console.log("MouseDown:",e);
        if(!this.enabled) return;
        this.preventDefault(e);

        let _site:number = this.isHorizontal() ? this.getMouseX(e) : this.getMouseY(e);

        this.slideStart = _site;
        this.slideTarget = this.position;
        this.slideIsDarg = true;
        // console.log("slideMouseDown:", _site, this.slideTarget)
        window.addEventListener("selectstart", this.noSelectStart);
        if (this.userAgent == "pc") {
            window.addEventListener("mouseup", this.slideDargMouseup);
            window.addEventListener("mousemove", this.slideDargMousemove);
        } else {
            window.addEventListener("touchend", this.slideDargMouseup);
            window.addEventListener("touchmove", this.slideDargMousemove);
        }
        return false;
    }
    slideDargMousemove = (e:TouchEvent | MouseEvent) => {
        if(!this.enabled) return;
        this.preventDefault(e);
        let _site:number = this.isHorizontal() ? this.getMouseX(e) : this.getMouseY(e);
        if(this.slideIsDarg){
            _site = this.slideLimit(_site);
            // console.log("slideDargMousemove:", _site, this.trackStart, this.trackEnd)
            this.slideTarget += (_site - this.slideStart);
            this.slideRun();
            this.slideStart = _site;
        }
    }
    slideDargMouseup = (e:TouchEvent | MouseEvent) => {
        if(!this.enabled) return;
        // console.log("slideDargMouseup:",e)
        this.slideClearWindowListener();
        this.preventDefault(e);
        this.slideIsDarg = false;

        // let _site:number = this.isHorizontal() ? this.getMouseX(e) : this.getMouseY(e);
        // let _delta = _site - this.position; //本次滑动距离
        this.triggerScroll(0);
    }
        slideClearWindowListener(){
            window.removeEventListener("selectstart", this.noSelectStart);
            if (this.userAgent == "pc") {
                window.removeEventListener("mouseup", this.slideDargMouseup);
                window.removeEventListener("mousemove", this.slideDargMousemove);
            } else {
                window.removeEventListener("touchend", this.slideDargMouseup);
                window.removeEventListener("touchmove", this.slideDargMousemove);
            }
        }

    trackMouseDown = (e:TouchEvent | MouseEvent):void => {
        if(!this.enabled) return;
        // console.log("track:",e);
        this.preventDefault(e);

        let _site:number = this.isHorizontal() ? this.getMouseX(e) : this.getMouseY(e);;
        let _ty:number = _site-this.slideSize/2;
        this.slideTarget = _ty;
        this.slideTargetLimit();
        let _delta = this.slideTarget - this.position; //本次滑动距离
        this.position = this.slideTarget;

        this.triggerScroll(_delta);
    }
    noSelectStart = () => {
        return false;
    }
    trackMouseEnter = (e:MouseEvent):void => {
        this.isInDomTrack = true;
    }
    trackMouseLeave = (e:MouseEvent):void => {
        this.isInDomTrack = false;
    }

    slideRun():void {
        this.slideTargetLimit();
        let _delta = this.slideTarget - this.position; //本次滑动距离
        this.position = this.slideTarget;
        this.triggerScroll(_delta);
        /* if(this.resizeList.length>0){
            this.setResizeList(false)
            this.resizeList = [];
        }; */
    }
    slideRunGPS(_per:number):void {
        if (_per > 1) _per = 1;
        let _ty:number = 0;
        if (!this.isHorizontal() && this.invert) {//垂直翻转
            _ty = this.positionMax - _per * (this.positionMax - this.positionMin);
        } else {
            _ty = _per * (this.positionMax - this.positionMin) + this.positionMin;
        }
        this.slideTarget = _ty;
        this.slideRun();
    }

    /**
     * 设置Slide的Position
     * @param _per //百分比
     */
    setSlidePositionPer(_per:number):void {
        if(!this.enabled) return;
        if (_per > 1) _per = 1;
        let _ty:number = 0;
        if (!this.isHorizontal() && this.invert) {//垂直翻转
            _ty = this.positionMax - _per * (this.positionMax - this.positionMin);
        } else {
            _ty = _per * (this.positionMax - this.positionMin) + this.positionMin;
        }
        this.slideTarget = _ty;
        let _delta = this.slideTarget - this.position; //本次滑动距离
        this.position = this.slideTarget;
    }


    slideLimit(_num:number):number{
        if(_num < this.trackStart){
            _num = this.trackStart;
        }else if(_num > this.trackEnd){
            _num = this.trackEnd;
        }
        return _num;
    }
    slideTargetLimit():number{
        // console.log("slideTargetLimit:", this.slideTarget, this.positionMin)
        if (this.slideTarget < this.positionMin) this.slideTarget = this.positionMin;
        if (this.slideTarget > this.positionMax) this.slideTarget = this.positionMax;
        // console.log("slideTargetLimit:", this.slideTarget)
        return this.slideTarget;
    }


    triggerScroll(_delta:number):void {
        this.triggerEvent(ScrollBarEventType.scroll, {
            "delta": _delta,
            "percent": this.percent,
            "value": this._value,
            "valueMin": this.valueMin,
            "valueMax": this.valueMax
        });
    }

    //==============================================progress
    updateProgress():void {
        if (this.domDic.domProgress == null) return;
        if(this.isHorizontal()){
            this.domDic.domProgress.style.width = this.setUnit(this.percent * this.trackSize);
        }else {
            this.domDic.domProgress.style.height = this.setUnit(this.percent * this.trackSize);
            if(this.invert){
                this.domDic.domProgress.style.top = this.setUnit(this.trackSize - this.domDic.domProgress.clientHeight)
            }
        }
    }
    /**
     * 刷新下载进度条
     * @param _loaded   已下载数值
     * @param _total    总数值
     */
    updateLoadProgress(_loaded:number, _total:number):void {
        let _per:number = _loaded / _total || 0;
        this.updateLoadProgressPer(_per);
    }
        /**
         * 刷新下载进度条
         * @param _per 百分比
         */
        updateLoadProgressPer(_per:number):void {
            // console.log("updateLoadProgress:", _per)
            if (this.domDic.domLoadProgress == null) return;
            if(this.isHorizontal()){
                this.domDic.domLoadProgress.style.width = this.setUnit(_per * this.trackSize);
            }else {
                this.domDic.domLoadProgress.style.height = this.setUnit(_per * this.trackSize);
            }
        }




    addResize():void {
        this.evt = "onorientationchange" in window ? 'orientationchange' : 'resize';
        setTimeout(()=>{
            window.addEventListener(this.evt, this.orientationHanlder, false);
        }, 300);
    }
    orientationHanlder = (event:Event):void => {
        console.log("ScrollBar ", this.name, " resize:", event);
        setTimeout(()=>{
            this.updateDomData();
        }, 300);
    }
    getResizeList(_dom:HTMLElement):void {
        this.resizeList = [];
        // console.log("getResizeList---------------start", _dom)
        while(_dom!=document.body){
            if(_dom.style.display=='none'){
                this.resizeList.push(_dom);
            }
            _dom = _dom.parentElement;
            // console.log(_dom, _dom.style.display)
        }
        // console.log("getResizeList---------------end")
    }
    setResizeList(_show:boolean):void {
        for(let i:number=0; i<this.resizeList.length; i++){
            let _el:HTMLElement = this.resizeList[i];
            if(_show==true){
                _el.style.display = 'block';
            }else {
                _el.style.display = 'none';
            }
        }
    }
    resetResizeList():void {
        if(this.resizeList.length>0){
            this.setResizeList(false)
            this.resizeList = [];
        };
    }
    //==============================================event
    private listenerList:{[key: string]:Function[]} = {};
    /**
     * addEvent 添加事件侦听
     */
    addEvent = (_type:string, _fn:Function):void => {
        if (!this.listenerList[_type]) {
            let list:Function[] = [];
            this.listenerList[_type] = list;
        }
        this.listenerList[_type].push(_fn);
    }
    /**
     * triggerEvent 广播事件
     */
    triggerEvent = <T>(_type:string, _arg?:T):void => {
        let _arrayEvent:Function[] = this.listenerList[_type];
        if(_arrayEvent){
            for (let i = 0; i < _arrayEvent.length; i++) {
                _arrayEvent[i](_arg);
            }
        }
    }
    /**
     * removeEvent 删除事件
     */
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
    /**
     * removeEvents 删除所有事件
     */
    removeEvents():void{
        for (let type in this.listenerList) {
            this.removeEvent(type);
        }
    }
    //==============================================utils
    isHorizontal():boolean {
        return this._direction=="horizontal";
    }
    eleAddListener(_ele:HTMLElement, _eventType:string, _listener:EventListener):void {
        if(!_ele) return;
        _ele.addEventListener(_eventType, _listener, false);
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
    getMouseX(e):number {
        let site = 0;
        if (this.userAgent == "pc") {
            site = e.pageX;
        } else {
            site = e.changedTouches[0].pageX;
        }
        return site;
    }
    getMouseY(e):number {
        let site = 0;
        if (this.userAgent == "pc") {
            site = e.pageY;
        } else {
            site = e.changedTouches[0].pageY;
        }
        return site;
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
    setUnit(_num:number){
        return Math.ceil(_num)+"px";
    }


}
function getElementPos(_dom:HTMLElement):{[key:string]:number}{
    let pos = {"top":0, "left":0};
     if (_dom.offsetParent){
       while (_dom.offsetParent){
         pos.left += _dom.offsetLeft;
         pos.top += _dom.offsetTop;
         _dom = _dom.offsetParent as HTMLElement;
       }
     }else{
       pos.left += _dom.offsetLeft;
       pos.top += _dom.offsetTop;
     }
     return pos;
}
enum ScrollBarEventType {
    /** 滚动事件
     *  param {
                delta,      //本次滑动距离
                percent,    //当前滑动百分比
                value,      //当前值
                valueMin,   //最小值
                valueMax,   //最大值
              }
     */
    scroll = "scroll",
}
/** progress dom dictionary */
interface IScrollBarDomDic {
    /** 滑轨 */
    domTrack:HTMLElement;
    /** 下载进度 */
    domLoadProgress?:HTMLElement;
    /** 播放进度 */
    domProgress:HTMLElement;
    /** slide (position:absolute 必须定位) */
    domSlide:HTMLElement;
}

export { ScrollBar, ScrollBarEventType, IScrollBarDomDic }