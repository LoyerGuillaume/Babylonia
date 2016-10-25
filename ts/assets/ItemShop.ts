class ItemShop extends AssetGraphic {

    public static list:ItemShop[] = [];

    private startYPosition:number;

    constructor(pScene:BABYLON.Scene, pAssetName:string, pPosition:BABYLON.Vector3) {
        super(pAssetName, pScene);

        this.position           = pPosition.clone();
        this.startYPosition = this.position.y;
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);

        ItemShop.list.push(this);
    }
}
