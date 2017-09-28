export default class AppInteractiveItem {
    public win:any;
    public callBack:Function;
    public callBackName:string;
    public id:string;

    constructor(_id:string, _param:any, _callback?:Function){
        this.win = window;
        this.id = _id;
        this.callBack = _callback;
        if(this.callBack){
            this.callBackName = "cb"+this.id;
            this.win[this.callBackName] =this.toWeb.bind(this);
        }
        this.toApp(_param);
    }
    /* App 返回 */
    toWeb(_response:any):void{
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
        let param = this.createAppParam(_param);
        // alert("to App param:"+JSON.stringify(param));
        if (this.win.hc) {//ios 7
            this.win.hc.call(JSON.stringify(param));
        } else if (this.win.webkit) {//ios8/android
            this.win.webkit.messageHandlers.call.postMessage(JSON.stringify(param));
        } else {//电脑端移动测试
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
}