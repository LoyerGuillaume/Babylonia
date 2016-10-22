class Character extends AssetGraphic {

    private static get BOUNCING_RATIO()         :number { return 0.1;};
    private static get BOUNCING_FREQUENCE()     :number { return 15;};

    protected lifePoint:number;
    protected invicibleTime:number = 0;
    protected isInvicible:boolean = false;
    private startYPositionMeshe:number;
    private frameCount:number = 0;

    constructor(pScene:BABYLON.Scene, pAssetName:string, pPosition:BABYLON.Vector3, pLifePoint:number) {
        super(pAssetName, pScene);

        this.lifePoint = pLifePoint;
        this.position = pPosition.clone();
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);

        this.startYPositionMeshe = this.meshe.position.y;
    }


    protected _rotate (vectorMovement:BABYLON.Vector3, rotationSpeed:number) {
        vectorMovement = vectorMovement.multiplyByFloats(-1, -1, -1);
        var rotation = BABYLON.Tools.ToDegrees(Math.atan2(vectorMovement.z, vectorMovement.x));
        rotation -= 90;
        var q = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), BABYLON.Tools.ToRadians(-rotation));
        this.rotationQuaternion = BABYLON.Quaternion.Slerp(this.rotationQuaternion.clone(), q, rotationSpeed);
    }


    protected invicibilityCooldown (pInvicibility:number) {
        this.invicibiliyFeedback();
        if (++this.invicibleTime >= pInvicibility) {
            this.isInvicible = false;
            this.meshe.isVisible = true;
            this.invicibleTime = 0;
        }
    }


    protected invicibiliyFeedback () {
        if (this.invicibleTime % 5 === 0) {
            //isVisible isn't working
            this.meshe.setEnabled(!this.meshe.isEnabled());
        }
    }


    protected animationMovement (deltaTime:number):void {
        this.meshe.position.y = this.startYPositionMeshe + Math.sin(this.frameCount / Character.BOUNCING_FREQUENCE - 0.5) * Character.BOUNCING_RATIO;
        this.frameCount++;
    }


    protected onHit () {
        if (--this.lifePoint > 0) {
            this.isInvicible = true;
        } else {
            this.die();
        }
    }

    protected die () {

    }

}
