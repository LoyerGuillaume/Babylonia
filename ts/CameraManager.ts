class CameraManager {

    private static camera:BABYLON.FollowCamera;

    private static get RADIUS() { return 800;};
    private static get HEIGHT() { return 500;};
    private static get ANGLE() { return 120;};


    public static init(pScene: BABYLON.Scene, pEngine: BABYLON.Engine) {
        CameraManager.camera = new BABYLON.FollowCamera('FollowCamera', new BABYLON.Vector3(0, 0, 0), pScene);
    }


    public static setTarget(pMesh: BABYLON.AbstractMesh) {
        CameraManager.camera.target = pMesh;
        CameraManager.camera.radius = CameraManager.RADIUS;
        CameraManager.camera.heightOffset = CameraManager.HEIGHT;
        CameraManager.camera.rotationOffset = CameraManager.ANGLE;
    }



}
