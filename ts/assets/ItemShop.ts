class ItemShop extends AssetGraphic {

    public static list:ItemShop[] = [];

    private startYPosition:number;
    private cost:number;
    private bonusCallback;

    private collisionSize:number = 1.5;

    private bindedFunction:any;
    private playerRef:Player;

    public get costCoin():number {
        return this.cost;
    }

    constructor(pScene:BABYLON.Scene, pAssetName:string, pCost:number, pCallback) {
        super(pAssetName, pScene);

        this.cost = pCost;
        this.bonusCallback = pCallback;
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);

        ItemShop.list.push(this);

        this.bindedFunction = this.onKeyUp.bind(this);
    }



    public setPosition (pPosition:BABYLON.Vector3):void {
        this.position = pPosition.clone();
        this.startYPosition     = this.position.y;
    }



    protected doActionNormal (deltaTime:number) {
        if (this.checkPlayerCollision()) {
            this.doAction = this.doActionOnPlayerCollision;
            UIManager.openShopPopin('TEST_ITEM', 'test de texte sur une description \nzigozjeifjze', this.cost);
            window.addEventListener(Keyboard.KEY_UP, this.bindedFunction);
            // this.bonusCallback(Player.list[i], this);
        }
    }


    private doActionOnPlayerCollision (deltaTime:number) {
        if (!this.checkPlayerCollision()) {
            this.doAction = this.doActionNormal;
            this.playerRef = null;
            window.removeEventListener(Keyboard.KEY_UP, this.bindedFunction);
            UIManager.closeShopPopin();
        }
    }


    private checkPlayerCollision () :boolean {
        for (var i in Player.list) {
            if (Tools.minusVector3(this.position, Player.list[i].position).length() < this.collisionSize) {
                this.playerRef = Player.list[i];
                return true;
            }
        }

        return false;
    }


    private onKeyUp (e:KeyboardEvent) {
        if ((e.keyCode || e.which) === Keyboard.SPACE && this.playerRef) {
            UIManager.closeShopPopin();
            window.removeEventListener(Keyboard.KEY_UP, this.bindedFunction);
            this.bonusCallback(this.playerRef, this);
        }
    }


    public destroy () {
        ItemShop.list.splice(ItemShop.list.indexOf(this), 1);
        super.destroy();
    }
}
