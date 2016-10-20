class Coin extends AssetGraphic {

    public static list:Coin[] = [];

    private static get ASSET_NAME():string { return 'elf';};
    private static get ROTATION_SPEED():number { return 0.1;};

    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3) {
        super(Coin.ASSET_NAME, pScene);

        this.position = pPosition.clone();
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);
        Coin.list.push(this);
    }


    protected doActionNormal (deltaTime:number) {
        this._rotate();
    }

    private _rotate ():void {
        this.meshe.rotation = this.meshe.rotation.add(BABYLON.Vector3.Up().multiplyByFloats(Coin.ROTATION_SPEED, Coin.ROTATION_SPEED, Coin.ROTATION_SPEED));
    }

    public destroy () {
        Coin.list.splice(Coin.list.indexOf(this), 1);
        super.destroy();
    }
}
