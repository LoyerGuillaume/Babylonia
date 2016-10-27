class ItemShop extends AssetGraphic {

    public static list:ItemShop[] = [];

    private startYPosition:number;
    private cost:number;
    private bonusCallback;

    public get costCoin():number {
        return this.cost;
    }

    constructor(pScene:BABYLON.Scene, pAssetName:string, pCost:number, pCallback) {
        super(pAssetName, pScene);

        this.cost = pCost;
        this.bonusCallback = pCallback;
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);

        ItemShop.list.push(this);
    }



    public setPosition (pPosition:BABYLON.Vector3):void {
        this.position = pPosition.clone();
        this.startYPosition     = this.position.y;
    }



    protected doActionNormal (deltaTime:number) {
        this.checkPlayerCollision();
    }


    private checkPlayerCollision () :void {
        for (var i in Player.list) {
            if (Tools.minusVector3(this.position, Player.list[i].position).length() < 0.8) {
                this.bonusCallback(Player.list[i], this);
                return;
            }
        }
    }


    public destroy () {
        ItemShop.list.splice(ItemShop.list.indexOf(this), 1);
        super.destroy();
    }
}
