class Character extends AssetGraphic {

    protected lifePoint:number;
    protected invicibleTime:number = 0;
    protected isInvicible:boolean = false;

    constructor(pScene:BABYLON.Scene, pAssetName:string, pPosition:BABYLON.Vector3, pLifePoint:number) {
        super(pAssetName, pScene);

        this.lifePoint = pLifePoint;
        this.position = pPosition.clone();
        this.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Up(), 0);
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
            this.meshe.isVisible = !this.meshe.isVisible;
        }
    }


    protected onHit () {
        if (--this.lifePoint > 0) {
            this.isInvicible = true;
        } else {
            this.destroy();
        }
    }

}
