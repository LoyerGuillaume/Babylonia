class ItemShop extends AssetGraphic {

    public static list:ItemShop[] = [];

    private startYPosition:number;
    private cost:number;
    private bonusCallback;

    private title      :string = '';
    private description:string = '';

    private collisionSize:number = 1.5;

    private bindedFunction:any;
    private playerRef:Player;

    public get costCoin():number {
        return this.cost;
    }

    constructor(pScene:BABYLON.Scene, pAssetName:string, pCost:number, pTitle:string, pDescription:string, pCallback:any) {
        super(pAssetName, pScene);

        this.cost          = pCost;
        this.bonusCallback = pCallback;
        this.title         = pTitle;
        this.description   = pDescription;

        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);

        ItemShop.list.push(this);

        this.bindedFunction = this.onKeyUp.bind(this);
    }



    public setPosition (pPosition:BABYLON.Vector3):void {
        this.position       = pPosition.clone();
        this.startYPosition = this.position.y;
    }



    protected doActionNormal (deltaTime:number) {
        if (this.checkPlayerCollision()) {
            this.doAction = this.doActionOnPlayerCollision;
            UIManager.openShopPopin(this.title, this.description, this.cost);
            window.addEventListener(Keyboard.KEY_UP, this.bindedFunction);
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
            if (this.bonusCallback(this.playerRef, this)) {
                UIManager.closeShopPopin();
                window.removeEventListener(Keyboard.KEY_UP, this.bindedFunction);
            }
        }
    }


    public destroy () {
        ItemShop.list.splice(ItemShop.list.indexOf(this), 1);
        super.destroy();
    }
}
