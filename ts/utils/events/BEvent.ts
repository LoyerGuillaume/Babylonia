class BEvent {

    private static callbacks:any = {};

    public id:string;

    private params:any;

    constructor (pId:string, pParams:any = undefined) {
        this.id = pId;
        this.params = pParams;
    }

    public static on (pId:string, pFunc:any, pThis:any = undefined) {

        if (!BEvent.callbacks[pId]) {
            BEvent.callbacks[pId] = []
        }

        BEvent.callbacks[pId].push(pFunc.bind(pThis));
    }

    public static off (pId:string, pFunc:any, pThis:any = undefined) {

        if (BEvent.callbacks[pId]) {
            var lI = BEvent.callbacks[pId].indexOf(pFunc.bind(pThis));
            if (lI >= 0) {
                BEvent.callbacks[pId].splice(lI, 1);
            }
        }
    }

    public static emit (pEvent:BEvent) {
        if (BEvent.callbacks[pEvent.id]) {

            var len:number = BEvent.callbacks[pEvent.id].length;
            for (var i = 0; i < len; i++) {
                BEvent.callbacks[pEvent.id][i](pEvent.params);
            }
        }
    }
}
