class UICapacity extends BABYLON.Group2D {

    private static get WIDTH()     :number { return 150; };
    private static get PICTO_SIZE():number { return 100; };

    private capacity:IPlayerAttack;

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
        }, this)
    }


    private initContent ()  {
        var pictoTexture:BABYLON.Texture = Babylonia.getLoadedContent(this.capacity.name.toLowerCase() + '.png', false);
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


    private cooldown () {
        var rect:BABYLON.Rectangle2D = this.shadePicto();
        var initialHeight:number = rect.height;
        var callback = this.cooldownTimeout.bind(this, rect)

        new Timeout(function () {
            callback();
        }, 16);
    }


    private cooldownTimeout (rect:BABYLON.Rectangle2D) {
        rect.height = this.picto.height - (this.capacity.countFrameAttack / this.capacity.cooldown * this.picto.height);
        if (this.capacity.countFrameAttack >= this.capacity.cooldown) {
            this.unshadePicto();
        } else {
            new Timeout(this.cooldownTimeout.bind(this, rect), 16);
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
