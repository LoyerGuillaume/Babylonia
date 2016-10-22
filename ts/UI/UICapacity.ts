interface Dictionnary {
    [name: string]: BABYLON.Texture;
}

class UICapacity extends BABYLON.Group2D {

    private static get WIDTH()     :number { return 150; };
    private static get TEXTURES()  :string[] { return [ 'babyboule', 'babyspread' ]; };
    private static get PICTO_SIZE():number { return 100; };

    private static textures:Dictionnary = {};

    private capacity:any;

    private picto:BABYLON.Sprite2D;


    constructor (property:any, capacity:any) {
        property.width = UICapacity.WIDTH;
        super(property);
        this.capacity = capacity;
        this.initContent();
        this.initEvents();
    }


    private initEvents () {
        var that = this;
        BEvent.on(PlayerEvent.ATTACK, function (pParams) {
            if (pParams.name === that.capacity.name) {
                that.cooldown();
            }
        })
    }


    private initContent ()  {
        var pictoTexture:BABYLON.Texture = UICapacity.textures[this.capacity.name.toLowerCase()];
        var pictoScale:number = UICapacity.PICTO_SIZE / pictoTexture.getSize().width;
        this.picto = new BABYLON.Sprite2D(pictoTexture, {
            id: 'picto' + this.capacity.name,
            parent: this,
            origin: new BABYLON.Vector2(0, 0),
            scale: pictoScale
        })
        this.picto.x = UICapacity.WIDTH / 2 - UICapacity.PICTO_SIZE / 2;

        var text:BABYLON.Text2D = new BABYLON.Text2D(this.capacity.name, {
            id: 'text' + this.capacity.name,
            parent: this,
            fontName: '20pt Arial'
        })
        text.x = UICapacity.WIDTH / 2 - text.width / 2;

        this.picto.y = text.height;

        var key:BABYLON.Text2D = new BABYLON.Text2D(this.capacity.key, {
            id: 'key' + this.capacity.name,
            parent: this,
            fontName: '20pt Arial',
            y: this.picto.y + UICapacity.PICTO_SIZE
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


    private cooldown () {
        var rect:BABYLON.Rectangle2D = this.shadePicto();
        var initialHeight:number = rect.height;
        var callback = this.cooldownTimeout.bind(this, rect)

        setTimeout(function () {
            callback();
        }, 16);
    }


    private cooldownTimeout (rect:BABYLON.Rectangle2D) {
        rect.height = this.picto.height - (this.capacity.countFrameAttack / this.capacity.cooldown * this.picto.height);
        if (this.capacity.countFrameAttack >= this.capacity.cooldown) {
            this.unshadePicto();
        } else {
            setTimeout(this.cooldownTimeout.bind(this, rect), 16);
        }
    }


    private shadePicto ():BABYLON.Rectangle2D {
        this.unshadePicto();
        var rect:BABYLON.Rectangle2D = new BABYLON.Rectangle2D({
            id: 'secondRect',
            parent: this.picto,
            size: this.picto.size.clone(),
            fill: '#000000AF'
        })

        return rect;
    }


    private unshadePicto () {
        if (this.picto.children.length > 0) {
            this.picto.children.splice(0, 1)[0].dispose();
        }
    }

}
