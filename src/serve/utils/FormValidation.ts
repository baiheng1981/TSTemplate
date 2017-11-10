/**
 * FormValidation 表单验证
 *
 * example:
 * FormValidation.run([
            new FormPolicy(13123456789, FormENUM.isPhoneNumber, "手机号码是假的"),
        ],(val)=>{
            console.log(val);//输出："手机号码是假的"
        });
 */
class FormValidation {
    policy:VerifyPolicy;
    constructor(){
        this.policy = new VerifyPolicy();
    }
    /**
     *
     * @param {Array} _list [ new FormPolicy() ]
     */
    run(_list:FormPolicy[]):Promise<{}> {
        return new Promise((resolve, reject) => {
            for(let i=0; i<_list.length; i++){
                let _fp:FormPolicy = _list[i];
                let _msg:string = this.policy[_fp.method](_fp.value, _fp.errMsg);
                if(_msg){//验证未通过
                    reject(_msg);
                }
            }
            //验证通过
            resolve();
        })
    }
}
/**
 * 策略
 */
class FormPolicy {
    value:string|number;
    method:string;
    errMsg:string;
    /**
     * 策略
     * @param _val      要验证的 string | number
     * @param _method   验证方法(class VerifyPolicy)
     * @param _err      未通过验证时间返回的错误信息
     */
    constructor(_val:string|number, _method:string, _err?:string){
        this.value = _val;
        this.method = _method;
        this.errMsg = _err || "";
    }
}
/**
 * 方法名
 */
enum FormENUM {
    /** 判断值是否为空 */
    isEmpty = "isEmpty",
    /** 匹配url */
    isUrl = "isUrl",
    /** 匹配e-mail */
    isEmail = "isEmail",
    /** 匹配 ip */
    isIP = "isIP",
    /** 匹配 非零的正整数 */
    isNZInteger = "isNZInteger",
    /** 匹配 手机号码(1开头) */
    isPhoneNumber = "isPhoneNumber",
}


/**
 * @class VerifyPolicy 策略方法
 */
class VerifyPolicy{
    /**
     * @method regTest 正则匹配判断
     * @param {RegExp}  _reg    正则表达式
     * @param {string}  _str    要匹配的str
     */
    regTest(_reg, _str:string):boolean{
        if(_reg.test(_str)){
            return true;
        }else{
            return false;
        }
    }
    /**
     * string | number 判断值是否为空(数字0不为空)
     */
    isEmpty(value:string|number, errMsg?:string):string{
        errMsg = errMsg || "不能为空";
        // console.log("xxxxx:",Boolean(value))
        if(value==0) value = value.toString();
        if(!value){
            return errMsg;
        }
        return "";
    }
    /**
     * 匹配url (需完整路径，带http)
     */
    isUrl(value:string, errMsg?:string):string {
        errMsg = errMsg || "url格式错误";
        let _msg:string = "";

        let _reg:RegExp = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;//url
        _msg = this.regTest(_reg, value) ? '' : errMsg;
        return _msg;
    }
    /**
     * 匹配e-mail
     */
    isEmail(value:string, errMsg?:string):string {
        errMsg = errMsg || "邮件地址格式错误";
        let _msg:string = "";

        let _reg:RegExp = /\w+[@]{1}\w+[.]\w+/;//email
        _msg = this.regTest(_reg, value) ? '' : errMsg;
        return _msg;
    }
    /**
     * 匹配 ip
     */
    isIP(value:string, errMsg?:string):string {
        errMsg = errMsg || "IP地址格式错误";
        let _msg:string = "";

        let _reg:RegExp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;//ip
        _msg = this.regTest(_reg, value) ? '' : errMsg;
        return _msg;
    }
    /**
     * 匹配 非零的正整数
     */
    isNZInteger(value:string | number, errMsg?:string):string {
        value = value.toString();
        errMsg = errMsg || "不是非零的正整数";
        let _msg:string = "";

        let _reg:RegExp = /^[1-9]\d*$/;
        _msg = this.regTest(_reg, value) ? '' : errMsg;
        return _msg;
    }
    /**
     * 匹配 手机号码(1开头)
     */
    isPhoneNumber(value:string | number, errMsg?:string):string {
        value = value.toString();
        errMsg = errMsg || "手机号码格式错误";
        let _msg:string = "";

        let _reg:RegExp = /^1[34578]\d{9}$/;
        _msg = this.regTest(_reg, value) ? '' : errMsg;
        return _msg;
    }










}



export { FormPolicy, FormENUM };
export default new FormValidation();