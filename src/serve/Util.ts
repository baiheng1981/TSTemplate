/**
 * @class pagingInfo  分页信息
 */
class pagingInfo {
    /** 当前页 */
    page:number;
    /** 总页数 */
    pages:number;
    /** 最小显示页码 */
    pageMin:number;
    /** 最大显示页码 */
    pageMax:number;
    /** 显示页面列表 */
    numberList:Array<number>;
}
/**
 * @class Utils 工具类
 */
class Util {
    getDPR(){
        let dpr = window.devicePixelRatio || 1;//获取屏幕像素比
        return dpr;
    }
    getRem(){
        let clientW=document.documentElement.clientWidth || document.body.clientWidth;
        let rem =clientW * this.getDPR() / 10;
        return rem;
    }


    /**
     * @method pagingCalculate 分页显示信息计算
     * @param {number}  _currpage         当前页码
     * @param {number}  _totalPage        总页数
     * @param {number}  _amount           每页数量
     * @return {}   返回分页显示信息
     */
    pagingCalculate(_currpage:number, _totalPage:number, _amount:number):any{
        var _min = _currpage-parseInt((_amount/2).toString());
        if(_min<1) _min = 1;
        var _max = _min+_amount-1;
        if(_max>_totalPage) _max = _totalPage;

        var _pageNumberlist = [];
        for(var i=_min; i<=_max; i++){
            _pageNumberlist.push(i);
        }

        var _page:pagingInfo = new pagingInfo();
        _page.page = _currpage;
        _page.pages = _totalPage;
        _page.pageMin = _min;
        _page.pageMax = _max;
        _page.numberList = _pageNumberlist;
        return _page;
    }


    /**
     * @method getRandomInt 获取范围内随机整数
     * @param minNum 起始值
     * @param maxNum 结束值
     * @return {number} 整数
     */
    getRandomInt(minNum:number, maxNum:number):number{
        return parseInt( (Math.random()*(maxNum-minNum+1)+minNum).toString(), 10)
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

    //=====================================================obj
    /**
     * @method deepClone 深度克隆
     * @param {object} obj
     * @return {object} 返回新的object
     */
    deepClone(obj):any{
        var str, newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        } else if(JSON){
            str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
        } else {
            for(var i in obj){
                newobj[i] = typeof obj[i] === 'object' ?
                this.deepClone(obj[i]) : obj[i];
            }
        }
        return newobj;
    }
    /**
     * @method isClass obj判断类型：返回传递给他的任意对象的类
     * @param {any}
     * @return {string}
     */
    isClass(o):any{
        if(o===null) return "Null";
        if(o===undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8,-1);
    }

    /** obj同key写入 */
    objWriteValue(_source, _objvalue):void{
        for(var _key in _objvalue){
            if(_source.hasOwnProperty(_key)){
                if(_key=='other'){
                    console.log("wv:",this.isClass(_objvalue[_key]))
                }
                if(this.isClass(_objvalue[_key])=="Object"){
                    if(_key=='not_disturb'){
                        console.log('not_disturb:',_source[_key], _objvalue[_key])
                    }
                    this.objWriteValue(_source[_key], _objvalue[_key]);
                }else{
                    _source[_key] = _objvalue[_key];
                }
            }
        }
    }
    /** obj判断是否为空{} */
    isEmptyObject(e:object):boolean{
        var t;
        for (t in e)
            return !1;
        return !0
    }

    /**
     * @method ArraySortKey 列表按key排序
     * @param {string}  key
     * @param {boolean} desc true升序 false降序
     */
    ArraySortKey(key:string,desc?:boolean):Function {
        desc = desc || false;
        return (a,b)=>{
            if(desc){
                return a[key]>b[key] ? -1 : 1;
            }else{
                return a[key]>b[key] ? 1 : -1;
            }
        }
    }

    /**
     * @method getQueryString   获取url参数
     * @param {string}  url
     * @param {string}  key
     * @param {string}
     */
    getQueryString(url:string, key:string):string {
        // url = "http://192.168.2.151:8009/?p1=xxxccc&p2=1122%33&p3=22ss22";
        let qulist = url.match(new RegExp("[^\?&]*"+key+"=+[^&]*"));
        return qulist ? qulist[0].split('=')[1] : null;
    }











    // 获取距今天dayCount天后的日期 "yy-mm-dd"
    getDateAfter(dayCount:number) {
        var dd = new Date();
        dd.setDate(dd.getDate() + dayCount);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    }
    /**
     * @method getDateByStr  "yy-mm-dd"转日期
     * @param _str "yy-mm-dd"
     * @return {Date}
     */
    getDateByStr(_str:string):Date{
        return new Date(Date.parse(_str.replace(/-/g, "/")));
    }
    /**
     * @method getDateStrByStamp  时间戳（毫秒）转"yy-mm-dd hh:mm:ss"
     * @param _stamp 时间戳
     * @return {string}  "yy-mm-dd hh:mm:ss"
     */
    getDateStrByStamp(_stamp:number):string{
        if(!_stamp || _stamp<=0) return "";
        let date = new Date(_stamp);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
    }
    /**
     * @method getDateStrLastByStamp  毫秒 转 “x天x小时”
     * @param _stamp 毫秒
     * @return {string} “x天x小时”
     */
    getDateStrLastByStamp(_stamp:number):string{
        let t = _stamp / 1000;//计算剩余的秒数
        let days = Math.floor(t / 60 / 60 / 24);
        let hours = Math.floor(t / 60 / 60 - (24 * days));
        let str = "";
        if(days>0){
            str += days + "天";
        }
        str += hours + "小时";
        return str;
    }



    /**
     * @method IOSScrollEmpty  ios下vue-router返回某个滚动列表时出现空白，自动滚动可解决
     */
    IOSScrollEmpty(_cb?:Function):void {
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
        setTimeout(()=>{
            if(_cb) _cb();
        },300);
    }


}

export { pagingInfo }

export default new Util();