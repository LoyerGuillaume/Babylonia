
class GameObject extends BABYLON.Mesh {

    public doAction: () => void;

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

    protected doActionNormal() {

    }

    private doActionVoid() { }

    public destroy () {
        this.dispose();
    }

}
