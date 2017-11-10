/**
 * PullUpUpdate 上拉加载(div)
 */
class PullUpUpdate {
    userAgent:string = "pc";
    public el:HTMLElement;
    public tagDom:HTMLElement;
    public callBack:Function;

    private tagHeight:number;
    private pullHeight:number = 80;
    private pullScale:number = 0.7;

    private isup:boolean = false;
    private isBottom:boolean = false;

    private touchmoveY_start:number = 0;
    private touchmoveY_move:number = 0;

    private _status:string = "wait";
    /**
     * 加载状态: wait等待 | ready准备加载 | loading正在加载 |
     */
    get status():string {
        return this._status;
    };
    set status(_s:string) {
        this._status = _s;
        this.callBack(this._status);
    }

    /**
     * PullUpUpdate 上拉加载(div)
     * @param _el           目标HTMLElement
     * @param _tagDom       信息提示HTMLElement
     * @param _callBack     状态变化回调
     */
    constructor(_el:HTMLElement, _tagDom:HTMLElement, _callBack:Function){
        let _agent = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i);
        this.userAgent = "pc";
        if (_agent != null) {
            this.userAgent = "moblie";
        }

        this.el = _el;
        this.callBack = _callBack;
        this.tagDom = _tagDom;
        this.tagHeight = this.tagDom.offsetHeight;
        this.pullHeight = this.tagHeight*2;

        this.el.addEventListener("touchstart", this.touchstart);

        this.init();
    }
    init():void {
        this.isBottom = false;
        this.status = "wait";
    }
    clear = ()=>{
        console.log("PullUpUpdate.clear()  ---- ")
        if(this.el){
            this.el.removeEventListener("touchstart", this.touchstart);
            this.el.removeEventListener('touchmove', this.touchmove);
        }
        document.removeEventListener('touchend', this.touchend);
    }

    restore = ()=>{
        this.touchmoveY_move = -this.tagHeight;
        this.updateSytle();
        this.status = "wait";
        this.el.appendChild(this.tagDom);
    }

    touchstart = (e)=>{
        if(this.status!="wait"){
            // console.log("与我无关")
            return;
        }
        this.touchmoveY_move = 0;
        this.touchmoveY_start = e.changedTouches[0].clientY;
        if(this.elScrollBottom()){
            this.isBottom = true;
            this.isup = true;
        }else{
            this.isBottom = false;
        }

        this.el.removeEventListener('touchmove', this.touchmove);
        document.removeEventListener('touchend', this.touchend);

        this.el.addEventListener('touchmove', this.touchmove);
        document.addEventListener('touchend', this.touchend);

    }
    touchmove = (e)=>{
        if(this.judgeParentIsSelf(e.target)==false) {
            return;
        }

        let _site = e.changedTouches[0].clientY;
        let _dis = _site - this.touchmoveY_start;

        this.touchmoveY_move += _dis;
        if(this.touchmoveY_move < -this.pullHeight) this.touchmoveY_move = -this.pullHeight;
        if(this.touchmoveY_move > -this.tagHeight) this.touchmoveY_move = -this.tagHeight;
        this.touchmoveY_start = _site;

        if(_dis>0){
            this.isBottom = false;
            this.isup = false;
            this.status = "wait";
            this.updateSytle();
            if(this.el.scrollTop!=0){
                e.stopPropagation();
            }
            return;
        }
        if(this.isBottom==false){
            return;
        }


        if(this.getNumberHeightPX(this.tagDom) > Math.abs(this.pullHeight)*this.pullScale){
            this.status = "ready";
        }else {
            this.status = "wait";
        }

        if(_dis<=0 && this.elScrollBottom()){
            // console.log("不能动了")
            this.isup = true;
            this.preventDefault(e);
            this.updateSytle();
            this.el.scrollTop = this.getScrollHeight();
        }else{
            // console.log("能动了")
            this.isup = false;
            this.touchmoveY_move = -this.tagHeight;
            this.updateSytle();
        }
    }
    touchend = (e)=>{
        this.el.removeEventListener('touchmove', this.touchmove);
        document.removeEventListener('touchend', this.touchend);
        if(this.isBottom==false){
            // alert("不")
            this.touchmoveY_move = -this.tagHeight;
            this.status = "wait";
            this.updateSytle();
            return;
        }else{
            if(this.status=="ready"){
                this.touchBack();
            }else {
                this.restore();
            }
        }
        this.isup = false;
    }
    touchBack():void{
        this.status = "loading";
        this.updateSytle();
    }

    noScroll(){
        if(this.getClientHeight()>this.getScrollHeight()){
            return true;
        }
        return false;
    }
    elScrollBottom(){
        if(this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()){
            return true;
        }
        return false;
    }
    //当前滚动位置
    getScrollTop(){
        return this.el.scrollTop;
    }
    //可视高度
    getClientHeight(){
        return this.el.clientHeight;
    }
    //文档高度
    getScrollHeight(){
        return this.el.scrollHeight;
    }
    getNumberHeightPX(dom){
        return parseFloat(dom.style.height.slice(0,-2))
    }



    preventDefault = (e)=>{
        e.stopPropagation();
        if (e.cancelable) {
            // console.log("cancelable")
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }
    }

    judgeParentIsSelf(dom){
        if(dom==this.el){
            return true;
        }else{
            if(dom.parentNode){
                if(dom.parentNode==document.body){
                    // console.log("找到body啦");
                    return false;
                }else{
                    return this.judgeParentIsSelf(dom.parentNode);
                }
            }else{
                return false;
            }
        }
    }



    updateSytle(){
        // console.log(this.tagDom)
        if(!this.tagDom) return;
        this.tagDom.style.height = Math.abs(this.touchmoveY_move)+'px';
    }


    setUnit(_num:number){
        return Math.ceil(_num)+"px";
    }
}

export default PullUpUpdate;