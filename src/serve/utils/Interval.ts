/**
 * @method Interval 精确毫秒计时
 * _cb 返回每_interval间隔流失的毫秒数
 */
export default class Interval {
    private start:number;
    /** {number} 回调间隔时间 */
    private interval:number;
    private time:number;

    callBack:Function;
    /**
     * @method Interval 精确毫秒计时
     * @param {Function} _cb 回调函数
     * @param {number} _interval 回调间隔时间
     * _cb 返回每_interval间隔流失的毫秒数
     */
    constructor(_cb:Function, _interval?:number){
        this.callBack = _cb;
        this.interval = _interval || 1000;

        this.init();
    }
    private init():void{
        this.start = new Date().getTime();
        this.time = setInterval(()=>{
            let time_now = new Date().getTime();
            let dis = time_now - this.start;
            this.start = time_now;
            if(this.callBack){
                this.callBack(dis);
            }
        }, this.interval);
    }

    clear():void{
        if(this.time) clearInterval(this.time);
        this.callBack = null;
    }
}
