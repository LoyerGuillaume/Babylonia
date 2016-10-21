class Coin extends AssetGraphic {

    public static list:Coin[] = [];

    private static get ASSET_NAME():string { return 'elf';};
    private static get ROTATION_SPEED():number { return 0.1;};
    private static get MIN_MULTIPLY_MOVEMENT():number { return 500;};
    private static get MAX_MULTIPLY_MOVEMENT():number { return 2000;};
    private static get MOVEMENT_FRICTION():number { return 0.95;};
    private static get BOUNCING_FRICTION():number { return 0.95;};

    private vectorMovement:BABYLON.Vector3;
    private startYPosition:number;
    private frameCount    :number = 0;
    private bouncingRatio :number = 100;

    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pVectorDirection:BABYLON.Vector3) {
        super(Coin.ASSET_NAME, pScene);

        this.position           = pPosition.clone();
        this.startYPosition = this.position.y;
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);

        var randomNumber:number = Math.floor(Coin.MIN_MULTIPLY_MOVEMENT + Math.random() * (Coin.MAX_MULTIPLY_MOVEMENT - Coin.MIN_MULTIPLY_MOVEMENT));
        this.vectorMovement     = pVectorDirection.multiplyByFloats(randomNumber, randomNumber, randomNumber);
        // console.log(this.vectorMovement);

        this.scalingDeterminant = 0.5;

        Coin.list.push(this);
    }


    protected doActionNormal (deltaTime:number) {
        this._rotate();
        this.movement(deltaTime);
    }


    protected movement (deltaTime:number):void {

        var minVelocity:number = 10;
        if (this.vectorMovement.x <= minVelocity && this.vectorMovement.y <= minVelocity && this.vectorMovement.z <= minVelocity) {
            this.vectorMovement = BABYLON.Vector3.Zero();
            return;
        }

        deltaTime *= 0.001;
        this.moveWithCollisions(this.vectorMovement.multiplyByFloats(deltaTime, deltaTime, deltaTime));

        var friction:number = Coin.MOVEMENT_FRICTION;
        this.vectorMovement = this.vectorMovement.multiplyByFloats(friction, friction, friction);

        this.boundingMovement();
    }


    private boundingMovement ():void {
        this.position.y = this.startYPosition + Math.sin(this.frameCount / 5) * this.bouncingRatio + this.bouncingRatio;

        console.log(this.position.y);
        this.frameCount++;
        this.bouncingRatio *= Coin.BOUNCING_FRICTION;
    }


    private _rotate ():void {
        this.meshe.rotation = this.meshe.rotation.add(BABYLON.Vector3.Up().multiplyByFloats(Coin.ROTATION_SPEED, Coin.ROTATION_SPEED, Coin.ROTATION_SPEED));
    }


    public destroy () {
        Coin.list.splice(Coin.list.indexOf(this), 1);
        super.destroy();
    }
}
