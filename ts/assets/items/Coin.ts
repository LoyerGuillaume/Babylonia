class Coin extends AssetGraphic {

    public static list:Coin[] = [];

    private static get ASSET_NAME()           :string { return 'Coin';};
    private static get ROTATION_SPEED()       :number { return 0.1;};
    private static get MIN_MULTIPLY_MOVEMENT():number { return 5;};
    private static get MAX_MULTIPLY_MOVEMENT():number { return 10;};
    private static get MOVEMENT_FRICTION()    :number { return 0.95;};
    private static get BOUNCING_FRICTION()    :number { return 0.95;};
    private static get BOUNCING_FREQUENCE()    :number { return 5;};
    private static get MIN_VELOCITY()    :number { return 0.01;};

    private vectorMovement:BABYLON.Vector3;
    private startYPosition:number;
    private frameCount    :number = 0;
    private bouncingRatio :number = 0.5;

    constructor(pScene:BABYLON.Scene, pPosition:BABYLON.Vector3, pVectorDirection:BABYLON.Vector3) {
        super(Coin.ASSET_NAME, pScene);

        this.position           = pPosition.clone();
        this.startYPosition = this.position.y;
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);

        // var randomNumber:number = Coin.MIN_MULTIPLY_MOVEMENT + Math.random() * (Coin.MAX_MULTIPLY_MOVEMENT - Coin.MIN_MULTIPLY_MOVEMENT);
        // this.vectorMovement     = pVectorDirection.multiplyByFloats(this.getNumberForVectorMovement(), this.getNumberForVectorMovement(), this.getNumberForVectorMovement());
        this.vectorMovement     = new BABYLON.Vector3(this.getNumberForVectorMovement(), 0, this.getNumberForVectorMovement());
        console.log('vectorMovement : '+this.vectorMovement);


        Coin.list.push(this);
    }


    private getNumberForVectorMovement () :number {
        return (Coin.MIN_MULTIPLY_MOVEMENT + Math.random() * (Coin.MAX_MULTIPLY_MOVEMENT - Coin.MIN_MULTIPLY_MOVEMENT)) * (Math.random() <= 0.5 ? 1 : -1);
    }


    protected doActionNormal (deltaTime:number) {
        this._rotate();
        this.movement(deltaTime);
        this.frameCount++;
    }


    protected movement (deltaTime:number):void {
        var minVelocity:number = Coin.MIN_VELOCITY;
        if (Math.abs(this.vectorMovement.x) <= minVelocity
         && Math.abs(this.vectorMovement.y) <= minVelocity
         && Math.abs(this.vectorMovement.z) <= minVelocity) {
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
        this.position.y = this.startYPosition + Math.sin(this.frameCount / Coin.BOUNCING_FREQUENCE) * this.bouncingRatio + this.bouncingRatio;
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
