class CameraManager {

    private static camera:BABYLON.FollowCamera;

    private static get RADIUS()       { return 800;};
    private static get HEIGHT()       { return 1200;};
    private static get ACCELERATION() { return 0.02;};
    private static get MAX_SPEED()    { return 10;};


    public static init(pScene: BABYLON.Scene, pEngine: BABYLON.Engine):void {
        CameraManager.camera = new BABYLON.FollowCamera('FollowCamera', new BABYLON.Vector3(0, 0, 0), pScene);

        CameraManager.camera.radius = CameraManager.RADIUS;
        CameraManager.camera.heightOffset = CameraManager.HEIGHT;
        CameraManager.camera.cameraAcceleration = CameraManager.ACCELERATION;
        CameraManager.camera.maxCameraSpeed = CameraManager.MAX_SPEED;
        // CameraManager.camera.rotationOffset = 0;

        pScene.activeCamera = CameraManager.camera;
        CameraManager.camera.attachControl(pEngine.getRenderingCanvas());
    }


    public static setTarget(pMesh: BABYLON.AbstractMesh):void {
        CameraManager.camera.target = pMesh;
    }



}
