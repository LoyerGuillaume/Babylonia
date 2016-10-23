/**
 * Classe d�finissant ce que les controleurs doivent retourner aux objets qui les manipulent
 */
class Controller {

    protected _attack: boolean = false;
    protected _horizontal: number = 0;
    protected _vertical: number = 0;
    protected _pause: boolean = false;
    protected _god: boolean = false;

    /**
	 * type de controle actuel dans le jeu
	 */
    public static type:ControllerType = ControllerType.KEYBOARD;

    constructor() {

    }

    get attack(): boolean {
        return false;
    }

    get special_1(): boolean {
        return false;
    }

    get special_2(): boolean {
        return false;
    }

    get pause (): boolean {
        return false;
    }

    get god (): boolean {
        return false;
    }

    get horizontal(): number {
        return 0;
    }

    get vertical(): number {
        return 0;
    }

    public destroy (): void {

    }

}
