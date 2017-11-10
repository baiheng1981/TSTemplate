export default class AppInteractiveItem {
    public win:any;
    public callBack:Function;
    public callBackName:string;
    public id:string;
    private countTime:number;
    private count:number;
    private param:object;

    constructor(_id:string, _param:any, _callback?:Function){
        this.win = window;
        this.id = _id;
        this.callBack = _callback;
        if(this.callBack){
            this.callBackName = "cb"+this.id;
            this.win[this.callBackName] =this.toWeb.bind(this);
        }
        this.count = 1;
        this.param = this.createAppParam(_param);
        this.toApp(this.param);
    }
    /* App 返回 */
    toWeb(_response:any):void{
        this.clearTime();
        // alert("toWeb json:"+JSON.stringify(_response));
        if(this.callBack){
            let appdata = JSON.parse(_response);
            this.callBack(appdata);

            delete this.win[this.callBackName];
            this.callBack = null;
        }
    }
    /* 请求App */
    toApp(_param:any){
        if(this.callBack) {
            this.createTime();
        }
        // alert("to App param:"+JSON.stringify(param));
        if (this.win.hc) {//ios 7
            this.win.hc.call(JSON.stringify(_param));
        } else if (this.win.webkit) {//ios8/android
            this.win.webkit.messageHandlers.call.postMessage(JSON.stringify(_param));
        } else {//电脑端移动测试
            this.clearTime();
            return false;
        }
    }
    createAppParam(_param:any):any{
        let param:any = {};
        if(this.callBack) param.callback = this.callBackName;
        for(let key in _param){
            param[key] = _param[key];
        }
        // console.log("AppInteractiveItem->createAppParam:", param)
        return param;
    }

    createTime():number{
        this.clearTime();
        return setTimeout(()=>{
            this.count++;
            if(this.count>3){
                console.log("Failed to get information from App 3 times!  call off!");
            }else {
                console.log("Failed to get information from the App! retry...");
                this.toApp(this.param);
            }
        }, 2000);
    }
    clearTime():void {
        if(this.countTime) clearTimeout(this.countTime);
        this.countTime = NaN;
    }
}