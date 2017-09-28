/* App通信

*/
import API from './API';
import AppInteractiveItem from './AppInteractiveItem';

declare let unescape:any;


class AppInteractive {
    public tag:string = "party";
    public win:any;
    public api:API;

    constructor(){
        // this.init();
    }
    init():void{
        this.win = window;
        this.api = new API();

        console.log("AppInteractive inited !", this)
    }

    /** 请求App
     * @method toApp
     * @param {{api:"", data:{}}}   _param      请求参数
     * @param {Function}            _callBack   回调
     */
    toApp(_param:any, _callBack?:Function):void{
        let _id:string = new Date().getTime().toString();
        new AppInteractiveItem(_id, _param, _callBack);
    }


    //=====================================功能
    /** 检测app是否注入js桥梁
     * @method checkBridge
     * @returns {any} window.hc | window.webkit
     */
    checkBridge():any{
        return this.win.hc || this.win.webkit;
    };
    /** 是否在标签 _tag 的App内
     * @method inApp
     * @returns {boolean} true|false
    */
    inApp(_tag?:string):boolean{
        if (_tag === '' || _tag === undefined) {
            _tag = this.tag;
        }
        return navigator.userAgent.toLowerCase().indexOf(_tag) > -1;
    }

    /**
     * 设置页面标题
     * @method setTitle
     * @param {String} title 标题内容
    */
    setTitle(_title):void{
        let _param:any = {
            api:this.api.setTitle,
            data:{
                title:_title
            }
        }
        this.toApp(_param);
    }

    /**
     * 获取保存的token
     * @method getToken
     * @param {Function} _callback 回调函数
     * 回调方法参数
     *  {
     *    errno:(integer) ，
     *    error:(string)  ，
     *    data:{
     *        token:(string)
     *
     *    }
     *  }
    */
    getToken(_callback:Function):void{
        let _param:any = {
            api: this.api.getToken
        };
        this.toApp(_param, _callback);
    }
    /**
     * 物理返回键处理方式(Android)
     * @method interceptBack
     * @param  {int} intercept  是否拦截 1 拦截 0 不拦截（退出app）
    */
    interceptBack(_intercept:number):void{
        let _param:any = {
            api: this.api.interceptBack,
            data: {
                intercept: _intercept
            }
        };
        this.toApp(_param);
    }
    /**
     * 超链跳转
     * @method hyperLink
     * @param  {string}     _type       枚举: app(跳转至应用内部页面)、webview(跳转至应用内部浏览器)、explorer(跳转至外部应用)
     * @param  {string}     _link       超链
     * @param  {int}        _bridge     当target=webview时，代表是否需要js桥。 0：不需要  1：需要 没有时传''
     * @param  {Function}   _callback   回调函数
     * 回调方法参数：
     *  {
     *      errno:(integer) ，  //0 成功  1:失败  2：取消
     *      error:(string) //失败信息(失败的情况才会出现)
     *  }
    */
    hyperLink(_type:string, _link:string, _bridge:number|string, _callback:Function):void{
        let _forMCObj:any = {};
        if (_type === 'webview') {
            _forMCObj = {
                url: _link,
                target: _type,
                jsBridgeEnabled: _bridge
            };
        } else {
            _forMCObj = {
                url: _link,
                target: _type
            };
        }
        let _like:string = 'michong://h5.michong.com/' + this.base64encode(JSON.stringify(_forMCObj));
        let _param:any = {
            api: this.api.hyperLink,
            data: {
                link: _like
            }
        };
        this.toApp(_param, _callback);
    };
    /**
     * 关闭页面
     * 关闭前端App当前WebView的页面（主要用于超链跳转打开其他页面使用）
     * @method finish
    */
    finish():void {
        let _param:any = {
            api: this.api.finish
        };
        this.toApp(_param);
    };
    /**
     * 获取网络状态
     * @method networkReachability
     * @param {Function} _callback  回调函数
     * 回调方法参数
     *  {
     *    errno:(integer) ，
     *    error:(string)  ，
     *    data:{
     *        status:(string) // 枚举值：未知 unknown, 未联网 notReach, 移动网络 viaWWAN, WIFI viaWIFI
     *    }
     *  }
    */
    networkReachability(_callback:Function):void {
        let _param:any = {
            api: this.api.networkReachability,
        };
        this.toApp(_param, _callback);
    };


    /**
     * 复制
     * @param {string} _txt   要复制的文本
     */
    copy(_txt:string):void{
        let _param:any = {
            api: this.api.copy,
            data: {
                text: _txt
            }
        }
        this.toApp(_param);
    }

    /**
     * 支付
     * @param {any}         _data      支付数据
        {
            productId: (string),       // 商品ID
            vendor: (string),          // 第三方支付类型(alipay, weixin, ...)
            total:(integer),           //总价
            purchaseInfo: {
                quantity: (integer),   // 商品数量
                address: (string),     // 地址
                realName: (string),    // [可选待定,保留字段] 用户真实姓名
                phone: (string),       // [可选待定,保留字段] 手机号码
                postCode: (string),    // [可选待定,保留字段] 邮编
            }
        }
     * @param {Function}    _callback  回调函数
     * 回调方法参数
        {
            errno:(integer) ，
            error:(string)  ， //0 成功 //1 失败 2// 取消 支付成功、失败或者取消
            data:{
            transactionId:(string)  ， 支付成功事务id
            }
        }
     */
    pay(_data:any, _callback:Function):void{
        let _param:any = {
            api: this.api.pay,
            data: _data
        }
        this.toApp(_param, _callback);
    }




    //=================================tools
    /**
     * Javascript base64encode() base64加密函数
     * @param {string} input 原始字符串
     * @return {string} 加密后的base64字符串
    */
    base64encode(str):string{
        var rv;
        rv = encodeURIComponent(str);//json_encode
        rv = unescape(rv);//转义 decodeURI
        rv = window.btoa(rv);
        return rv;
    };

}






export default new AppInteractive();