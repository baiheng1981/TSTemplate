/**
 * ScrollBottomUpdate 向上滚动到底加载 (body)
 * @param {Function} _callBack 到达底部回调函数
 *
 */
class ScrollBottomUpdate {
    private scrollTop:number;
    private scrollTopTemp:number;
    public callBack:Function;

    constructor(_callBack:Function){
        this.callBack = _callBack;
        this.scrollTopTemp = 0;
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.update);
    }
    clear():void{
        window.removeEventListener('scroll', this.update);
    }

    update = ()=>{
        this.scrollTop = this.getScrollTop();
        if(this.scrollTopTemp<=this.scrollTop){
            if (this.getScrollTop() + this.getClientHeight()+100 >= this.getScrollHeight()) {
                if(this.callBack){
                    this.callBack();
                }
            }
        }
        this.scrollTopTemp = this.getScrollTop();
    }

    //获取滚动条当前的位置
    getScrollTop():number {
        let scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

        //获取当前可是范围的高度
    getClientHeight():number {
        let clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight,     document.documentElement.clientHeight);
        }else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    }

        //获取文档完整的高度
    getScrollHeight():number {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
}

export default ScrollBottomUpdate;