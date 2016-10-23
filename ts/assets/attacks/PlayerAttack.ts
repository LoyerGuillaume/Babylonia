class PlayerAttack extends AssetGraphic {

    protected static get ASSET_NAME():string { return '';};

    public static list:PlayerAttack[] = [];
    private launcher:Player;

    constructor (pAssetName:string, pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pPlayer) {
        super(pAssetName, pScene)
        PlayerAttack.list.push(this);

        this.launcher = pPlayer;
        this.position = pPosition.clone();
    }

    public get getLauncher():Player {
        return this.launcher;
    }

    public destroy () {
        super.destroy();
        PlayerAttack.list.splice(PlayerAttack.list.indexOf(this), 1);
    }
}
