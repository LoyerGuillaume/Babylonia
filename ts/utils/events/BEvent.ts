class BEvent {

    private static callbacks:any = {};

    public id:string;

    constructor (pId:string) {
        this.id = pId;
    }

    public static on (pId:string, pFunc:any, pThis:any = undefined) {

        if (!BEvent.callbacks[pId]) {
            BEvent.callbacks[pId] = []
        }

        BEvent.callbacks[pId].push(pFunc.bind(pThis));
    }

    public static emit (pEvent:BEvent) {

        if (BEvent.callbacks[pEvent.id]) {

            var len:number = BEvent.callbacks[pEvent.id].length;

            for (var i = 0; i < len; i++) {
                BEvent.callbacks[pEvent.id][i](pEvent);
            }
        }
    }
}
