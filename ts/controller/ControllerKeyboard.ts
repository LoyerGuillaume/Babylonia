/**
 * Controleur clavier
 */
class ControllerKeyboard extends Controller {

	    /**
	     * tableau stockant l'etat appuy� ou non des touches
	     */
        keys: Object;

        constructor() {

            super();

            this.keys = {};
            window.addEventListener(Keyboard.KEY_DOWN, this.onKeyDown.bind(this));
            window.addEventListener(Keyboard.KEY_UP, this.onKeyUp.bind(this));
        }

        get attack(): boolean {
            return this.keys[Keyboard.SPACE];
        }

        get pause(): boolean {
            return this.keys[Keyboard.P] || false;
        }

        get god(): boolean {
            return this.keys[Keyboard.G];
        }

        get horizontal (): number {
            if (this.keys[Keyboard.LEFT]) return -1;
            if (this.keys[Keyboard.RIGHT]) return 1;
            return 0;
        }

        get vertical (): number {
            if (this.keys[Keyboard.UP]) return 1;
            if (this.keys[Keyboard.DOWN]) return -1;
            return 0;
        }

	    /**
	     * d�truit l'instance unique et met sa r�f�rence interne � null
	     */
        public destroy(): void {
            window.removeEventListener(Keyboard.KEY_DOWN, this.onKeyDown);
            window.removeEventListener(Keyboard.KEY_UP, this.onKeyUp);
            super.destroy();
        }

        private onKeyDown(pEvent: KeyboardEvent): void {
            this.keys[pEvent.keyCode] = true;

            // traitement des touches antagonistes en favorisant la derni�re touche appuy�e
            if (pEvent.keyCode == Keyboard.LEFT) this.keys[Keyboard.RIGHT] = false;
            else if (pEvent.keyCode == Keyboard.RIGHT) this.keys[Keyboard.LEFT] = false;
        }

        private onKeyUp(pEvent: KeyboardEvent): void {
            this.keys[pEvent.keyCode] = false;
        }

    }
