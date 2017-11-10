/*自定义事件*/
enum BusEventType {
    test = "test",
    loading = "Event_loading",
    bubble = "Event_bubble",
    alert = "Event_alert"
}
class BusEvent{
    private listenerList:{[key: string]:Function[]} = {};

    constructor(){

    }
    addEvent(type:string, fn:Function):BusEvent{
        if (!this.listenerList[type]) {
            let list:Function[] = [];
            this.listenerList[type] = [];
        }
        this.listenerList[type].push(fn);
        return this;
    }
    triggerEvent<T>(type:string, _arg?:T):void {
        let _arrayEvent:Function[] = this.listenerList[type];
        if(_arrayEvent){
            for (let i = 0; i < _arrayEvent.length; i++) {
                _arrayEvent[i](_arg);
            }
        }
    }
    removeEvent(type:string, fn?:Function):BusEvent {
        let _arrayEvent:Function[] = this.listenerList[type];
        if (_arrayEvent && fn) {
            for (let i = 0; i < _arrayEvent.length; i++) {
                if (_arrayEvent[i] === fn) {
                    this.listenerList[type].splice(i, 1);
                    break;
                }
            }
        } else {
            delete this.listenerList[type];
        }
        return this;
    }
    removeEvents():void {
        for (let type in this.listenerList) {
            this.removeEvent(type);
        }
    }



}


export { BusEvent, BusEventType }
export default new BusEvent();