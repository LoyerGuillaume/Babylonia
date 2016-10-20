class FireBall extends AssetGraphic {

    public static list: FireBall[] = [];

    private static get ASSET_NAME():string { return 'elf';};
    private static get SPEED():number { return 25;};
    private static get MAX_LIFE_TIME():number { return 60;};

    private launcher:Player;

    private lifeTime:number;
    private direction:BABYLON.Vector3;


    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pRotation:BABYLON.Quaternion, pPlayer) {
        super(FireBall.ASSET_NAME, pScene);
        FireBall.list.push(this);

        this.launcher           = pPlayer;
        this.position           = pPosition;
        this.rotationQuaternion = pRotation;
        this.lifeTime           = 0;

        this.scaling = new BABYLON.Vector3(1, 0.5, 1);
    }


    public get getLauncher():Player {
        return this.launcher;
    }


    protected doActionNormal () {
        this.move();
        this.checkLifeTime();

        this.meshe.rotation = this.meshe.rotation.add(BABYLON.Vector3.Up());
    }


    private move() {
        var v         = new BABYLON.Vector3(0, 0, -1);
        this.computeWorldMatrix(true);
        var m         = this.getWorldMatrix();
        var movement  = BABYLON.Vector3.TransformCoordinates(v, m);
        movement.subtractInPlace(this.position).normalize().scaleInPlace(FireBall.SPEED);
        this.position = new BABYLON.Vector3(this.position.x + movement.x, this.position.y + movement.y, this.position.z + movement.z);
    }


    private checkLifeTime () {
        if (++this.lifeTime >= FireBall.MAX_LIFE_TIME) {
            this.destroy();
        }
    }


    public destroy () {
        super.destroy();
        FireBall.list.splice(FireBall.list.indexOf(this), 1);
    }
}
