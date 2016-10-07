﻿
class GameObject extends BABYLON.Mesh {

    public doAction: () => void;

    private collisionBox;

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


    protected initCollision() {
        this.checkCollisions = false;

        this.collisionBox                 = BABYLON.Mesh.CreateBox("collision", 2, this.getScene());
        this.collisionBox.parent          = this;
        this.collisionBox.checkCollisions = true;
        this.collisionBox.scaling         = new BABYLON.Vector3(1, 1, 1);
        this.collisionBox.isVisible       = false;
    }

}
