/**
 * Timeout based on framerate with delta time
 */
class Timeout {

    public static list: Timeout[] = [];

    private static TIME_TO_FRAME:number = 1 / 60;

    private timeoutCallback;
    private timeoutCounter;
    private timeoutTotal;
 
    public doAction;

    /**
     *  @parms pCallback
     *  @parms pDelay ms
     */
    constructor(pCallback:any, pDelay:number) {

        this.timeoutCallback = pCallback;
        this.timeoutCounter = 1;
        this.timeoutTotal = pDelay * Timeout.TIME_TO_FRAME;

        this.setModeTimeout();

        Timeout.list.push(this);
    }

    private setModeTimeout () {
        this.doAction = this.doActionTimeout;
    }

    private doActionTimeout (dt:number) {

        this.timeoutCounter += 1 * dt;

        if (this.timeoutCounter > this.timeoutTotal) {
            this.setTimeoutDone();
        }
    }

    private setTimeoutDone () {
        this.timeoutCallback();
        this.destroy();
    }

    public destroy () {
        this.timeoutCallback = undefined;
        Timeout.list.splice( Timeout.list.indexOf(this), 1 );
    }

}
