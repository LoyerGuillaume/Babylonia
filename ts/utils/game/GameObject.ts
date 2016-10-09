﻿
class GameObject extends BABYLON.Mesh {

    public doAction: (deltaTime:number) => void;
    private static get DEBUG_COLLISION_BOX():boolean { return false;};

    private collisionBox;

    constructor(pName: string, pScene: BABYLON.Scene) {
        super(pName, pScene);

        this.setEnabled(false);
        this.setModeVoid();
        this.checkCollisions = false;
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


    protected createCollisionBox(scale:BABYLON.Vector3 = new BABYLON.Vector3(1, 1, 1)) {
        this.collisionBox                 = BABYLON.Mesh.CreateBox("collision", 2, this.getScene());
        this.collisionBox.parent          = this;
        this.collisionBox.checkCollisions = true;
        this.collisionBox.scaling         = scale;
        this.collisionBox.isVisible       = GameObject.DEBUG_COLLISION_BOX;
    }

    public destroy () {
        this.dispose();
    }
}
