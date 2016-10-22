class CameraManager {

    private static camera:BABYLON.FreeCamera;

    private static get HEIGHT():number   { return 10;};
    private static get X_OFFSET():number { return 0;};
    private static get RADIUS():number   { return 12;};

    private static get LERP_AMOUNT():number { return 0.05;};

    private static target:GameObject;


    public static init(pScene: BABYLON.Scene, pEngine: BABYLON.Engine):void {
        CameraManager.camera = new BABYLON.FreeCamera('FreeCamera', new BABYLON.Vector3( CameraManager.X_OFFSET, CameraManager.HEIGHT, CameraManager.RADIUS), pScene);

        pScene.activeCamera = CameraManager.camera;
    } 


    public static setTarget(pTarget: GameObject):void {
        CameraManager.target = pTarget;
        var targetPosition:BABYLON.Vector3 = pTarget.position.clone();
        targetPosition.z                  += CameraManager.RADIUS;
        targetPosition.y                  += CameraManager.HEIGHT;
        targetPosition.x                  += CameraManager.X_OFFSET;
        CameraManager.camera.position = targetPosition;
        CameraManager.camera.setTarget(pTarget.position.clone());
    }

    public static updatePosition () {
        var targetPosition:BABYLON.Vector3 = CameraManager.target.position.clone();
        targetPosition.z                  += CameraManager.RADIUS;
        targetPosition.y                   = CameraManager.camera.position.y;
        CameraManager.camera.position      = BABYLON.Vector3.Lerp(CameraManager.camera.position, targetPosition, CameraManager.LERP_AMOUNT);
    }


}
