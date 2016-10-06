class CameraManager {

    private static camera:BABYLON.FollowCamera;

    private static get RADIUS()       { return 800;};
    private static get HEIGHT()       { return 500;};
    private static get ACCELERATION() { return 0.2;};
    private static get MAX_SPEED()    { return 30; };


    public static init(pScene: BABYLON.Scene, pEngine: BABYLON.Engine) {
        CameraManager.camera = new BABYLON.FollowCamera('FollowCamera', new BABYLON.Vector3(0, 5, -20), pScene);

        CameraManager.camera.radius = CameraManager.RADIUS;
        CameraManager.camera.heightOffset = CameraManager.HEIGHT;
        CameraManager.camera.cameraAcceleration = CameraManager.ACCELERATION;
        CameraManager.camera.maxCameraSpeed = CameraManager.MAX_SPEED;

        pScene.activeCamera = CameraManager.camera;
        CameraManager.camera.attachControl(pEngine.getRenderingCanvas());
    }


    public static setTarget(pMesh: BABYLON.AbstractMesh) {
        CameraManager.camera.target = pMesh;
    }



}
