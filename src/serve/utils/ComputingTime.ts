/**
 * 精确毫秒流逝
 * @param {Function} _cb 回调函数
 * @param {number} _interval 回调间隔时间(millisecond)
 * _cb 返回每_interval间隔流逝的毫秒数
 *
 *  example:
 *  new ComputingTime((_val)=>{
        console.log(_val);//输出从计时开始已流逝的时间(millisecond)
    }, 1000);
 */
class ComputingTime {
    private startTime:number;
    /** {number} 回调间隔时间 */
    private interval:number;
    private time:number;

    callBack:Function;
    /**
     * 精确毫秒流逝
     * @param {Function} _cb 回调函数
     * @param {number} _interval 回调间隔时间(millisecond)
     * _cb 返回每_interval间隔流逝的毫秒数
     */
    constructor(_cb:Function, _interval?:number){
        this.callBack = _cb;
        this.interval = _interval || 1000;

        this.start();
    }
    start():void{
        this.startTime = new Date().getTime();
        this.time = setInterval(()=>{
            let time_now = new Date().getTime();
            let dis = time_now - this.startTime;
            this.startTime = time_now;
            if(this.callBack){
                this.callBack(dis);
            }
        }, this.interval);
    }
    pause():void {
        if(this.time) clearInterval(this.time);
    }

    stop():void{
        this.pause();
        this.callBack = null;
    }
}

/* function Countdown2(_interval:number):Promise<{}> {
    let _promise:Promise<{}> = new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve();
        }, _interval);
    });

    return _promise;
} */

/**
 * 倒计时
 * @param _total        总时间(millisecond)
 * @param _complateFun  倒计时完成回调
 * @param _interval     间隔通知时间(millisecond)
 * @param _intervalFun  间隔回调( Fun(_cb) 返回剩余时间)
 *
 * example:
 * this.countdown = new Countdown(20000, ()=>{
            console.log("countdown complate!");//计时完成
        }, 1000, (val)=>{
            console.log("total:", val); //剩余时间
            if(val<15000 && val>14000){
                this.countdown.pause();//暂停计时
                console.log("countdown pause")
                setTimeout(()=>{
                    console.log("countdown goon")
                    this.countdown.start();//恢复计时
                }, 5000)
            }
        });
        this.countdown.start();//开始计时
 */
class Countdown {
    private total:number;
    private complateFun:Function;
    private interval:number;
    private intervalFun:Function;//间隔回调
    private computingTime:ComputingTime;
    /**
     * 倒计时
     * @param _total        总时间(millisecond)
     * @param _complateFun  倒计时完成回调
     * @param _interval     间隔通知时间(millisecond)
     * @param _intervalFun  间隔回调( Fun(_cb) 返回剩余时间)
     */
    constructor(_total:number, _complateFun:Function, _interval?:number, _intervalFun?:Function){
        this.total = _total;
        this.complateFun = _complateFun;
        this.interval = _interval || 1000;
        this.intervalFun = _intervalFun;
    }

    start(){
        if(this.computingTime){
            this.computingTime.start();
        }else{
            this.computingTime = new ComputingTime(this.intervalHandler, this.interval);
        }
    }
    pause(){
        if(this.computingTime) {
            this.computingTime.pause();
        }
    }
    stop(){
        if(this.computingTime){
            this.computingTime.stop();
            this.computingTime = null;
        }
        if(this.intervalFun){
            this.intervalFun = null;
        }
        if(this.complateFun){
            this.complateFun = null;
        }
    }

    intervalHandler = (_val)=>{
        this.total -= _val;
        if(this.total <= 0){//计时完成
            this.total = 0;
            this.complateHandler();
        }else {//剩余时间
            if(this.intervalFun){
                this.intervalFun(this.total);
            }
        }
    }
    complateHandler(){
        if(this.complateFun){
            this.complateFun();
        }
        this.stop();
    }
}

export { ComputingTime, Countdown }