class CameraManager {

    private static camera:BABYLON.FollowCamera;


    public static init(pScene: BABYLON.Scene, pEngine: BABYLON.Engine) {
        CameraManager.camera = new BABYLON.FollowCamera('FollowCamera', new BABYLON.Vector3(0, 0, 0), pScene);

        // pScene.activeCamera = camera;
    }


    public static setTarget(pMesh: BABYLON.AbstractMesh) {
        CameraManager.camera.target = pMesh;
    }



}
