/**
 * @method Data     公共数据
 *  {
        token
        sessionStorage 方法
    }
 */
class Data {
    platform:string = '';


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




}

export default new Data();