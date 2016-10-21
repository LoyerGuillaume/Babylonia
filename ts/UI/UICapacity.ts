class UICapacity extends BABYLON.Group2D {

    private static get WIDTH():number { return 150; };

    private name:string;
    private capacity:any;

    constructor (property:any, capacity:any) {
        property.width = UICapacity.WIDTH;
        super(property);
        this.capacity = capacity;
        this.initContent();
    }


    private initContent ()  {
        new BABYLON.Text2D(this.capacity.name, {
            parent: this,
            fontName: '20pt Arial'
        })
        new BABYLON.Text2D(this.capacity.key, {
            parent: this,
            fontName: '20pt Arial',
            x: UICapacity.WIDTH / 2 - 10,
            y: 30
        })
    }


    public static loadTextures (pCallback:any) {

    }
}
