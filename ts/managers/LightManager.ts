class LightManager {

    private directionalLight1:BABYLON.DirectionalLight;
    private directionalLight2:BABYLON.DirectionalLight;
    private pointLight:BABYLON.PointLight;

    public static shadowObjects:BABYLON.AbstractMesh;

    constructor (pScene:BABYLON.Scene) {
        this.initDirectionalLight(pScene);
        this.initSkyBox(pScene);
        // this.initPointLight(pScene);
    }

    private initDirectionalLight (pScene:BABYLON.Scene):void {
        this.directionalLight1 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 0, 0), pScene);
        this.directionalLight1.direction                    = new BABYLON.Vector3(0.07110905, -0.273219258, -0.959320068);
        this.directionalLight1.diffuse                      = new BABYLON.Color3(1, 0.956862748, 0.8392157);
        this.directionalLight1.specular                     = new BABYLON.Color3(1, 1, 1);
        this.directionalLight1.intensity                    = 0.6;
        this.directionalLight1.range                        = 3.40282347E+38;


        this.directionalLight2 = new BABYLON.DirectionalLight("Dir1", new BABYLON.Vector3(0, 1, 0), pScene);
        this.directionalLight2.direction                    = new BABYLON.Vector3(0.4041313, -0.8933559, 0.1964519);
        this.directionalLight2.diffuse                      = new BABYLON.Color3(1, 0.9432049, 0.4852941);
        this.directionalLight2.specular                     = new BABYLON.Color3(1, 1, 1);
        this.directionalLight2.intensity                    = 0.76;
        this.directionalLight2.range                        = 3.40282347E+38;
    }

    private initPointLight (pScene:BABYLON.Scene):void {
        this.pointLight           = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 100, 0), pScene);
        this.pointLight.range     = 3000;
        this.pointLight.intensity = 10;
        this.pointLight.diffuse   = new BABYLON.Color3(24 / 255, 240 / 255, 1);
        this.pointLight.specular  = new BABYLON.Color3(1, 1, 1);
    }


    private initSkyBox (pScene:BABYLON.Scene) :void {
        var skybox        :BABYLON.Mesh                  = BABYLON.Mesh.CreateBox("skyBox", 500.0, pScene);
        var skyboxMaterial:BABYLON.StandardMaterial      = new BABYLON.StandardMaterial("skyBox", pScene);
        skyboxMaterial.backFaceCulling                   = false;
        skyboxMaterial.disableLighting                   = true;
        skyboxMaterial.diffuseColor                      = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor                     = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.ambientColor                      = new BABYLON.Color3(1, 0.8895538, 0.2720588);
        skyboxMaterial.reflectionTexture                 = new BABYLON.CubeTexture("assets/skybox/sky", pScene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


        skybox.material                                  = skyboxMaterial;
        skybox.infiniteDistance                          = true;
    }

}
