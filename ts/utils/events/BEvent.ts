class BEvent {

    private static callbacks:any = {};

    public id:string;

    private params:any;

    constructor (pId:string, pParams:any = undefined) {
        this.id = pId;
        this.params = pParams;
    }

    public static on (pId:string, pFunc:any, pThis:any) {

        if (!BEvent.callbacks[pId]) {
            BEvent.callbacks[pId] = []
        }

        BEvent.callbacks[pId].push(pFunc);
        BEvent.callbacks[pId].push(pThis);
    }

    public static off (pId:string, pFunc:any, pThis:any) {

        if (BEvent.callbacks[pId]) {

            var len:number = BEvent.callbacks[pId].length;
            for (var i = len - 3; i >= 0; i-=2) {

                if (BEvent.callbacks[pId][i+1] === pThis) {

                    if (pThis !== undefined && BEvent.callbacks[pId][i].name === pFunc.name || BEvent.callbacks[pId][i].toString() === pFunc.toString()) {
                        BEvent.callbacks[pId].splice(i, 2);
                        break;
                    }

                }
            }

        }
    }

    public static emit (pEvent:BEvent) {
        if (BEvent.callbacks[pEvent.id]) {

            var len:number = BEvent.callbacks[pEvent.id].length;
            for (var i = 0; i < len; i+=2) {
                BEvent.callbacks[pEvent.id][i].call(BEvent.callbacks[pEvent.id][i+1], pEvent.params);
            }
        }
    }
}
