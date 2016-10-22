class LightManager {

    private pointLight:BABYLON.PointLight;


    constructor (pScene:BABYLON.Scene) {
        this.initDirectionalLight(pScene);
        // this.initPointLight(pScene);
    }

    private initDirectionalLight (pScene:BABYLON.Scene):void {
        var dir0:BABYLON.DirectionalLight = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 0, 0), pScene);
        dir0.direction                    = new BABYLON.Vector3(0.07110905, -0.273219258, -0.959320068);
        dir0.diffuse                      = new BABYLON.Color3(1, 0.956862748, 0.8392157);
        dir0.specular                     = new BABYLON.Color3(1, 1, 1);
        dir0.intensity                    = 0.6;
        dir0.range                        = 3.40282347E+38;


        var dir1:BABYLON.DirectionalLight = new BABYLON.DirectionalLight("Dir1", new BABYLON.Vector3(0, 1, 0), pScene);
        dir1.direction                    = new BABYLON.Vector3(0.4041313, -0.8933559, 0.1964519);
        dir1.diffuse                      = new BABYLON.Color3(1, 0.9432049, 0.4852941);
        dir1.specular                     = new BABYLON.Color3(1, 1, 1);
        dir1.intensity                    = 0.76;
        dir1.range                        = 3.40282347E+38;
    }
 
    private initPointLight (pScene:BABYLON.Scene):void {
        this.pointLight           = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 100, 0), pScene);
        this.pointLight.range     = 3000;
        this.pointLight.intensity = 10;
        this.pointLight.diffuse   = new BABYLON.Color3(24 / 255, 240 / 255, 1);
        this.pointLight.specular  = new BABYLON.Color3(1, 1, 1);
    }

}
