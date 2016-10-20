class UICapacity extends BABYLON.Group2D {

    private name:string;
    private capacity:{};

    constructor (property:{}, capacity:{}) {
        super(property);
        this.capacity = capacity;
    }
}
