import axios, {CancelTokenSource} from 'axios'
import Bus from './Bus'
import MD5 from '../assets/utils/MD5'
import AppInteractive from '../assets/utils/app_interactive/AppInteractive';
import Data from './Data';
import Qs from 'qs'
import Utils from './utils/Utils';

declare let process;

enum XHTTPMethod {
    patch   = "PATCH",
    put     = "PUT",
    delete  = "DELETE"
}
/**
 * @class Https
 *
 */
class Https {
    headerConf = {
        "app-version" :"1.0",
        "cli-os" : "web",
        "authorize-token": "",
        "app-code" : (window as any).escape("CK"),
        "app-platform": "ios"
    };
    config = {
        baseURL: '',
        timeout: 8000,
        withCredentials: false,
        cancelToken: null,
    };

    hostList = {
        default:{
            baseURL:"http://192.168.3.59:8084",
            signKey:"41a939289369cc56dcc80d8f0df66759"
        },
        development:{
            baseURL:"https://dev-eshop-api.haochang.tv",
            signKey:"41a939289369cc56dcc80d8f0df66759"
        },
        test:{
            baseURL:"https://test-eshop-api.haochang.tv",
            signKey:"41a939289369cc56dcc80d8f0df66759"
        },
        production:{
            baseURL:"https://dev-eshop-api.haochang.tv",
            signKey:"41a939289369cc56dcc80d8f0df66759"
        },
    }



    instance:any;
    CSource:CancelTokenSource;
    signKey:string;
    timeoutLock:boolean;
    timeout:number;

    constructor(){
        console.log("NODE_ENV:", process.env.NODE_ENV)
    }
    init(){
        if(process && process.env && process.env.NODE_ENV){
            this.config.baseURL = this.hostList[process.env.NODE_ENV].baseURL;
            this.signKey = this.hostList[process.env.NODE_ENV].signKey;
        }else{
            this.config.baseURL = this.hostList.default.baseURL;
            this.signKey = this.hostList.default.signKey;
        }
        this.timeoutLock = true;
        console.log("Https config:", this.config)
    }
    /**
     * @method updateToken 刷新token
     * @param _token token码
     */
    updateToken(_token:string):void {
        Data.token = _token;
        this.headerConf["authorize-token"] = _token;
        let pf = Data.platform;
        if(pf=="pc") pf = "android";
        this.headerConf["app-platform"] = pf;
        this.initHttp();
        console.log("Https headerConf update:", this.headerConf)
    }

    /**
     * @method get      get方法
     * @param _url      请求地址
     * @param _updata   提交参数
     * @param _lock     默认 true 阻塞
     */
    get(_url:string, _updata?:any, _lock?:boolean):any {
        _lock = _lock;
        if(_lock==undefined) _lock = true;

        if(!AppInteractive.inApp()){
            return this.getRequest(_url, _updata, _lock);
        }else {
            return new Promise((resolve, reject)=>{
                AppInteractive.networkReachability((res)=>{
                    if(res.errno==0){
                        if(res.data.status!='notReach'){
                            //联网
                            resolve(this.getRequest(_url, _updata, _lock));
                        }else {
                            if(this.timeoutLock==true){
                                Bus.$emit("showError");
                            }else{
                                Bus.$emit("Message", "暂无网络");
                            }
                            reject("notReach");
                        }
                    }else {
                        reject(res)
                    }
                })
            })
        }
    }
        getRequest(_url:string, _updata:any, _lock:boolean):any {
            this.timeoutCreate();
            let promise:any;
            if(_updata){
                promise = this.instance.get(_url, {params:this.formatData(_updata), lock:_lock});
            }else{
                promise = this.instance.get(_url, {lock:_lock});
            }
            return promise;
        }
    /**
     * @method post         post方法
     * @param _url          请求地址
     * @param _updata       提交数据
     * @param _lock         默认 true 阻塞
     */
    post(_url:string, _updata?:any, _lock?:boolean):any {
        return this.postT(_url, _updata, {lock:_lock});
    }
    /**
     * @method patch        patch方法
     * @param _url          请求地址
     * @param _updata       提交数据
     * @param _lock         默认 true 阻塞
     */
    patch(_url:string, _updata?:any, _lock?:boolean):any {
        return this.postT(_url, _updata, {MethodKey:"PATCH", lock:_lock});
    }
    /**
     * @method put          put方法
     * @param _url          请求地址
     * @param _updata       提交数据
     * @param _lock         默认 true 阻塞
     */
    put(_url:string, _updata?:any, _lock?:boolean):any {
        return this.postT(_url, _updata, {MethodKey:"PUT", lock:_lock});
    }
    /**
     * @method delete       delete方法
     * @param _url          请求地址
     * @param _updata       提交数据
     * @param _lock         默认 true 阻塞
     */
    delete(_url:string, _updata?:any, _lock?:boolean):any {
        return this.postT(_url, _updata, {MethodKey:"DELETE", lock:_lock});
    }



    /**
     * @method initHttp  初始化http；需获得token后使用
     */
    initHttp():void{
        this.instance = axios.create(this.config);
        // 添加请求拦截器
        this.instance.interceptors.request.use((req) => {
            //默认请求带上header
            req.headers = Utils.deepClone(this.headerConf);
            //请求序列化字符串
            if (req.method !== 'get') {
                req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
                req.data = Qs.stringify(req.data);
            }
            //分析请求添加header字段
            if((req as any).MethodKey){
                req.headers['X-HTTP-Method-Override'] = (req as any).MethodKey
            }
            //请求显示loding
            if(req.lock==true){
                Bus.$emit('showLoding', true);
            }
            this.CSource = axios.CancelToken.source();
            req.cancelToken = this.CSource.token;
            console.log("Https request:",req)
            return req;
        },(err) => {
            //请求失败关闭loding
            Bus.$emit('hideLoding', true);

            console.log('请求过程出错，错误信息：',err)
            return Promise.reject(err)
        })
        // 添加响应拦截器
        this.instance.interceptors.response.use((res) => {
            this.timeoutClear();
            //请求成功关闭loding
            Bus.$emit('hideLoding', true);
            return res;
        },(err) => {
            // alert("Https err:"+err.message)
            this.timeoutClear();
            //相应失败关闭loding
            Bus.$emit('hideLoding', true);
            this.httpsResponseError(err);

            return Promise.reject(err);
        })
    }
    /**
     * 请求错误处理
     */
    httpsResponseError(error:any) {
        let _err = {
            response:null,
            request:null,
            message:null,
            config:null
        }
        _err.response = error.response;
        _err.request = error.request;
        _err.message = error.message;
        _err.config = error.config;
        console.log("Https.ts Error:",_err);
        if(_err.response){
            Bus.$emit("Message", _err.response.data.error);
        }
        if(_err.message){
            //响应超时处理
            if(_err.message.indexOf('timeout')>-1){
                if(this.timeoutLock==true){
                    Bus.$emit("showError");
                }else {
                    Bus.$emit("Message", '网络异常，请稍后重试');
                }
            }
        }
    }








    //====================================工具
    /**
     * ios10以下频现timeout不回调catch，用计时来处理timeout事件
     */
    timeoutCreate(){
        this.timeoutClear();
        this.timeout = setTimeout(()=>{
            // alert("Https timeout cancel")
            this.CSource.cancel("timeout message");
        }, this.config.timeout);
    }
        timeoutClear(){
            if(this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        }

    /**
     * @method postT        包装post方法
     * @param _url          请求地址
     * @param _updata       提交数据
     * @param _param        自定义配置（ 预定义关键字:  lock -> true 阻塞 ）
     *      {
                lock:false  //阻塞
            }
     */
    postT(_url:string, _updata?:any, _param?:any):any {
        let param:any = _param || {};
        if(param.lock==undefined) param.lock = true;

        if(!AppInteractive.inApp()){
            return (this.postTRequest(_url, _updata, param));
        }else {
            return new Promise((resolve, reject)=>{
                AppInteractive.networkReachability((res)=>{
                    if(res.errno==0){
                        if(res.data.status!='notReach'){
                            //联网
                            resolve(this.postTRequest(_url, _updata, param));
                        }else {
                            if(this.timeoutLock==true){
                                Bus.$emit("showError");
                            }else{
                                Bus.$emit("Message", "暂无网络");
                            }
                            reject("notReach");
                        }
                    }else {
                        reject(res);
                    }
                })
            })
        }
    }
        postTRequest(_url:string, _updata:any, _param:any):any {
            this.timeoutCreate();
            let promise:any;
            _updata = _updata || {};
            if(_updata){
                promise = this.instance.post(_url, this.formatData(_updata), _param);
            }else{
                promise = this.instance.post(_url, {}, _param);
            }
            return promise;
        };

    /**
     * @method formatData           计算后台接口所需签名
     * @param data         {json}   后台接口所需参数集合
     * @param _time        {data}   <可选> 当前时间戳
     */
    formatData(data:any, _time?:string):object {
        let time:string | number = _time ? _time : Math.floor(Date.now() / 1000);
        let params:any = {};
        let sign:Array<string> = []
        let signStr:string = '';
        if (data) {
            for (var k in data) {
                sign.push(k + '=' + data[k]);
                params[k] = data[k];
            }
            sign.sort(); //排序
            signStr = sign.join('&') + '|' + time + '|' + this.signKey;
            let md5_str = MD5.parse(signStr);
            //   console.log("md5:", md5_str)
            params['_sign'] = md5_str;
        }
        params['_time'] = time;
        return params;
      }

}

export { XHTTPMethod };
export default new Https();