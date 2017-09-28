declare let require:any;
const crypto:any = require('crypto');

class MD5 {
    hash:any;

    constructor(){

    }

    parse(_str:string):any{
        this.hash = crypto.createHash('md5');
        this.hash.update(_str);
        let md5_str = this.hash.digest('hex');
        return md5_str;
    }
}

export default new MD5();