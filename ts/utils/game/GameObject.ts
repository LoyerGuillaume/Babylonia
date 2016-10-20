
class GameObject extends BABYLON.Mesh {

    public doAction: (deltaTime:number) => void;
    private static get DEBUG_COLLISION_BOX():boolean { return false;};

    constructor(pName: string, pScene: BABYLON.Scene) {
        super(pName, pScene);

        this.setEnabled(false);
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

    protected doActionNormal(deltaTime:number) {

    }

    private doActionVoid(deltaTime:number) { }

    public destroy () {
        this.dispose(false);
    }
}
