class Player extends AssetGraphic {


    private static get ASSET_NAME():string { return 'elf';};

    constructor(pScene:BABYLON.Scene) {
        super(Player.ASSET_NAME, pScene);

    }

    public start() {

    }

}
