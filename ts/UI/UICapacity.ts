interface Dictionnary {
    [name: string]: BABYLON.Texture;
}

class UICapacity extends BABYLON.Group2D {

    private static get WIDTH()     :number { return 150; };
    private static get TEXTURES()  :string[] { return [ 'babyboule', 'babyspread' ]; };
    private static get PICTO_SIZE():number { return 100; };

    private static textures:Dictionnary = {};

    private name:string;
    private capacity:any;

    constructor (property:any, capacity:any) {
        property.width = UICapacity.WIDTH;
        super(property);
        this.capacity = capacity;
        this.initContent();
    }


    private initContent ()  {
        var pictoTexture:BABYLON.Texture = UICapacity.textures[this.capacity.name.toLowerCase()];
        var pictoScale:number = UICapacity.PICTO_SIZE / pictoTexture.getSize().width;
        var sprite:BABYLON.Sprite2D = new BABYLON.Sprite2D(pictoTexture, {
            parent: this,
            origin: new BABYLON.Vector2(0, 0),
            scale: pictoScale
        })
        sprite.x = UICapacity.WIDTH / 2 - UICapacity.PICTO_SIZE / 2;

        var text:BABYLON.Text2D = new BABYLON.Text2D(this.capacity.name, {
            parent: this,
            fontName: '20pt Arial'
        })
        text.x = UICapacity.WIDTH / 2 - text.width / 2;

        var key:BABYLON.Text2D = new BABYLON.Text2D(this.capacity.key, {
            parent: this,
            fontName: '20pt Arial',
            y: UICapacity.PICTO_SIZE
        })
        key.x = UICapacity.WIDTH / 2 - key.width / 2;
    }


    public static loadTextures (scene:BABYLON.Scene, pCallback:any) {
        var count:number = 0;
        for (var i in UICapacity.TEXTURES) {
            var textureName:string = UICapacity.TEXTURES[i];
            UICapacity.textures[textureName] = new BABYLON.Texture('../assets/' + textureName + '.png', scene, false, true, 0, function () {
                if (++count === UICapacity.TEXTURES.length) {
                    pCallback();
                }
            });
        }
    }
}
