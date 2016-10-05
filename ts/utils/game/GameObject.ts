
class GameObject {

    public doAction: () => void;

    constructor() {
        this.setModeVoid();
    }

    public start() {
        this.setModeNormal();
    }

    public setModeNormal() {
        this.doAction = this.doActionNormal;
    }

    protected setModeVoid() {
        this.doAction = this.doActionVoid;
    }

    protected doActionNormal() {

    }

    private doActionVoid() { }
    
}