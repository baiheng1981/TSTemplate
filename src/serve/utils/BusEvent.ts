/*自定义事件*/
enum BusEnentList {
    test = "test",
    loading = "Event_loading",
    bubble = "Event_bubble",
    alert = "Event_alert"
}
class BusEvent{
    listenterData:object = {};

    constructor(){

    }
    addEvent(type:string, fn:Function):BusEvent{
        if (typeof this.listenterData[type] === "undefined") {
            this.listenterData[type] = [];
        }
        if (typeof fn === "function") {
            this.listenterData[type].push(fn);
        }
        return this;
    }
    triggerEvent(type:string, _arg:any):void {
        var arrayEvent = this.listenterData[type];
        if (arrayEvent instanceof Array) {
            for (var i = 0; i < arrayEvent.length; i++) {
                if (typeof arrayEvent[i] === "function") {
                    arrayEvent[i].apply(this, [_arg]);
                }
            }
        }
    }
    removeEvent(type:string, fn?:Function):BusEvent {
        var arrayEvent = this.listenterData[type];
        if (typeof type == "string" && arrayEvent instanceof Array) {
            if (typeof fn === "function") {
                for (var i = arrayEvent.length - 1; i >= 0; i--) {
                    if (arrayEvent[i] === fn) {
                        this.listenterData[type].splice(i, 1);
                        break;
                    }
                }
            } else {
                delete this.listenterData[type];
            }
        }
        return this;
    }
    removeEvents():void {
        for (let type in this.listenterData) {
            this.removeEvent(type);
        }
    }



}


export { BusEnentList }
export default new BusEvent();