class HUDManager {

    private static heartContainer:BABYLON.ScreenSpaceCanvas2D;
    private static get HEART_SIZE():number { return 64 };

    public static initHud(scene:BABYLON.Scene) {
        HUDManager.initLifeContainer(scene);
    }

    private static initLifeContainer (scene:BABYLON.Scene) {
        var texture = new BABYLON.Texture('../assets/heart.png', scene, false, true, 0, function () {
            var spriteScale = HUDManager.HEART_SIZE / texture.getSize().width;

            var sprites:BABYLON.Sprite2D[] = [];
            for (var i = 0; i < Player.LIFE_POINT; i++) {
                var sprite = new BABYLON.Sprite2D(texture, {
                    id: 'heart' + i,
                    x: HUDManager.HEART_SIZE * i,
                    y: window.innerHeight - HUDManager.HEART_SIZE,
                    scale: 0.03
                });
                sprites.push(sprite);
            }

            HUDManager.heartContainer = new BABYLON.ScreenSpaceCanvas2D(scene, {
                id: 'heartContainer',
                size: new BABYLON.Size(window.innerWidth, window.innerHeight),
                children: sprites
            });

            console.log('ok')
        });
    }

}
