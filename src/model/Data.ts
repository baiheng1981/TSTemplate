/**
 * @method Data     公共数据
 *  {
        token
        sessionStorage 方法
    }
 */
class Data {
    platform:string = '';
    serverTime:number;

    constructor(){
        this.init();
    }
    private init():void {
        // this.token = "";
    }

    /* sessionStorage */
    storageSetItem(_key:string, _value:string):void {
        sessionStorage.setItem(_key, _value);
    }
    storageGetItem(_key:string):string{
        return sessionStorage.getItem(_key);
    }
    storageRemoveItem(_key:string):void {
        sessionStorage.removeItem(_key);
    }
    storageClear():void {
        sessionStorage.clear();
    }


    /**
     * setCookie
     * @param _name     cookie名称
     * @param _value    cookie值
     * @param _expire   过期时间(默认24)
     * @param _type     过期时间类型(d天/h小时/m分/s秒   默认h)
     */
    setCookie(_name:string, _value:string, _expire?:number, _type?:string):void{
        _expire = _expire || 24;
        _type = _type || "h";
        if (_type=="s"){
            _expire = _expire*1000;
        }else if (_type=="h"){
            _expire = _expire*60*60*1000;
        }else if (_type=="d"){
            _expire = _expire*24*60*60*1000;
        }

        let exp:Date = new Date();
        exp.setTime(exp.getTime() + _expire*1);
        document.cookie = _name + "="+ encodeURIComponent(_value) + ";expires=" + exp.toUTCString();
    }
    /**
     * getCookie
     * @param _name cookie名称
     * @return cookie值
     */
    getCookie(_name):string{
        let arr:string[] = [];
        let reg:RegExp = new RegExp("(^| )"+_name+"=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg)){
            return decodeURIComponent(arr[2]);
        }
        return null;
    }
    /**
     * delCookie
     * @param _name cookie名
     */
    delCookie(_name):void{
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let val = this.getCookie(_name);
        if(val!=null){
            document.cookie = _name + "="+val+";expires="+exp.toUTCString();
        }
    }
    /**
     * 清除所有cookie
     */
    clearCookie():void{
        let keys:RegExpMatchArray = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
          for (let i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }


}

export default new Data();