/**
 * App interactive API
 */
export default class API {
    //设置页面标题
    public setTitle:string = 'com.haochang.chunk.setTitle';
    //获取token
    public getToken:string = 'com.haochang.chunk.getToken';
    //返回键处理方式(Android)
    public interceptBack:string = 'com.haochang.chunk.interceptBack';
    //超链跳转
    public hyperLink:string = 'com.haochang.chunk.hyperLink';
    //获取网络状态
    public networkReachability:string = 'com.haochang.chunk.networkReachability';
    //关闭页面
    public finish:string = 'com.haochang.chunk.finish';
    //复制
    public copy:string = 'com.haochang.chunk.copy';
    //支付
    public pay:string = 'com.haochang.chunk.pay';
}
