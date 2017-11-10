/**
 * PullDownUpdate 下拉刷新(div)
 * sfss
 */
class PullDownUpdate {
    userAgent:string = "pc";
    touchmoveYStart:number = 0;
    touchmoveYMove:number = 0;

    private pullDownLimit:number = 80;
    private pullScale:number = 0.7;
    isup:boolean = false;
    holdChildScroll:boolean = false;//如果子元素包含滚动，false屏蔽, true不屏蔽

    callback:Function;

    tagDom:HTMLElement;

    private _status:string = "wait";
    /**
     * 加载状态: wait等待 | ready准备加载 | loading正在加载 |
     */
    get status():string {
        return this._status;
    };
    set status(_s:string) {
        this._status = _s;
        this.callback(this._status);
    }

    /**
     * PullDownUpdate 下拉刷新
     * @param _el               目标(HTMLElement)
     * @param _cb               下拉回调函数
     * @param _holdChildScroll      如果子元素包含滚动，false屏蔽, true不屏蔽
     */
    constructor(_tagDom:HTMLElement, _callBack:Function, _holdChildScroll?:boolean){
        let _agent = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i);
        this.userAgent = "pc";
        if (_agent != null) {
            this.userAgent = "moblie";
        }
        this.tagDom = _tagDom;
        this.callback = _callBack;
        this.holdChildScroll = _holdChildScroll || false;

        this.pullDownLimit = this.tagDom.clientHeight*2;

        this.init();
    }
    init():void {
        this.tagDom.style.height = this.setUnit(0);

        document.body.insertBefore(this.tagDom, document.body.childNodes[0]);
        document.addEventListener("touchstart", this.touchstart);
        this.status = "wait";
    }
    clear = ()=>{
        document.removeEventListener("touchstart", this.touchstart);
        this.clearTouch();
    }
    clearTouch(){
        document.removeEventListener("touchmove", this.touchmove);
        document.removeEventListener("touchend", this.touchend);
    }
    restore = ()=> {
        this.moveBack();
    }

    touchstart = (e)=>{
        if(this.status!="wait"){
            return;
        }
        if(this.holdChildScroll==false){
            if(this.judgeDomIsScroll(e.target)==true){
                return;
            }
        }

        this.touchmoveYMove = 0;
        this.isup = false;
        this.touchmoveYStart = this.getMouseY(e);

        if(this.getScrollTop()==0){
            document.addEventListener("touchmove", this.touchmove);
            document.addEventListener("touchend", this.touchend);
        }else{
            this.clearTouch();
            return;
        }
    }
    touchmove = (e)=>{

        let _site = this.getMouseY(e);
        let _dis = _site - this.touchmoveYStart;
        this.touchmoveYMove += _dis;
        this.touchmoveYStart = _site;

        if(this.touchmoveYMove > this.pullDownLimit) this.touchmoveYMove = this.pullDownLimit;
        if(this.touchmoveYMove <= 0) this.touchmoveYMove = 0;

        this.tagDom.style.height = this.setUnit(this.touchmoveYMove);

        if(this.touchmoveYMove > this.pullDownLimit*this.pullScale){
            this.status = "ready";
        }else{
            this.status = "wait";
        }

        if(this.isup){
            if(this.touchmoveYMove<=0){
                this.isup = false;
                this.clearTouch();
                this.touchmoveYMove = 0;
                this.tagDom.style.height = this.setUnit(this.touchmoveYMove);
            }else{
                this.setScrollTop(0);
            }
        }else{
            if(_dis=>0 && this.getScrollTop()==0){
                this.updateSytle();
                this.isup = true;
                this.preventDefault(e);
            }else{
                this.clearTouch();
            }
        }
    }
    touchend = (e)=>{
        document.removeEventListener("touchmove", this.touchmove);
        document.removeEventListener("touchend", this.touchend);
        if(this.isup ==false){
            this.clearTouch();
            this.touchmoveYMove = 0;
            this.tagDom.style.height = this.touchmoveYMove+'px';
            return;
        }
        this.touchmoveYStart = 0;
        if(this.isup){
            this.isup = false;
            if(this.status=="ready"){
                this.touchBack();
            }else {
                this.moveBack();
            }
        }
    }
        touchBack(){
            this.status = "loading";
        }
    moveBack(){
        setTimeout(()=>{
            let step = (0-this.touchmoveYMove)/4;
            step = step>0?Math.ceil(step):Math.floor(step);
            this.touchmoveYMove += step;

            this.updateSytle();
            if(Math.abs(this.touchmoveYMove)<1){
                this.touchmoveYMove = 0;
                this.updateSytle();
                this.clearTouch();
                this.status = "wait";
            }else{
                this.moveBack();
            }

        }, 20)
    }
    updateSytle(){
        if(this.touchmoveYMove > this.pullDownLimit) this.touchmoveYMove = this.pullDownLimit;
        if(this.touchmoveYMove <= 0) this.touchmoveYMove = 0;
        this.tagDom.style.height = this.setUnit(this.touchmoveYMove);
        this.setScrollTop(0);
    }

    getScrollTop():number{
        let _scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        return _scrollTop;
    }
    setScrollTop(value):void{
        if(document.body.scrollTop){
            document.body.scrollTop = value;
        }else if(document.documentElement.scrollTop){
            document.documentElement.scrollTop = value;
        }
    }
    getDOMHeight(dom):number{
        return parseFloat(dom.style.height.slice(0,-2))
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

    judgeDomIsScroll(dom:HTMLElement):boolean{
        if(dom==document.body){
            if(dom.scrollTop<=0){
                return false;
            }else {
                return true;
            }
        }else {
            if(dom.scrollTop<=0){
                return this.judgeDomIsScroll(dom.parentElement);
            }else {
                return true;
            }
        }
    }


    getMouseY(e):number {
        let site = 0;
        if (this.userAgent == "pc") {
            site = e.clientY;
        } else {
            site = e.changedTouches[0].clientY;
        }
        return site;
    }

    setUnit(_num:number){
        return Math.ceil(_num)+"px";
    }
}

export default PullDownUpdate;