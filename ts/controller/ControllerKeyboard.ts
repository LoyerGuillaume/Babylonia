/**
 * Controleur clavier
 */
class ControllerKeyboard extends Controller {

	    /**
	     * tableau stockant l'etat appuy� ou non des touches
	     */
        private keys: Object;

        private _h: number;
        private _v: number;

        constructor() {

            super();

            this.keys = {};
            this._h = this._v = 0;
            window.addEventListener(Keyboard.KEY_DOWN, this.onKeyDown.bind(this));
            window.addEventListener(Keyboard.KEY_UP, this.onKeyUp.bind(this));
        }

        get attack(): boolean {
            return this.keys[Keyboard.A];
        }

        get special_1(): boolean {
            return this.keys[Keyboard.Z];
        }

        get pause(): boolean {
            return this.keys[Keyboard.P] || false;
        }

        get god(): boolean {
            return this.keys[Keyboard.G];
        }

        get horizontal (): number {
            return this._h;
        }

        get vertical (): number {
            return this._v;
        }

	    /**
	     * detruit l'instance unique et met sa reference interne a null
	     */
        public destroy(): void {
            window.removeEventListener(Keyboard.KEY_DOWN, this.onKeyDown);
            window.removeEventListener(Keyboard.KEY_UP, this.onKeyUp);
            super.destroy();
        }

        private onKeyDown(pEvent: KeyboardEvent): void {
            this.keys[pEvent.keyCode] = true;

            // traitement des touches antagonistes en favorisant la derniere touche appuyee
            if (pEvent.keyCode == Keyboard.LEFT) this._h = -1;
            else if (pEvent.keyCode == Keyboard.RIGHT) this._h = 1;

            if (pEvent.keyCode == Keyboard.DOWN) this._v = -1;
            else if (pEvent.keyCode == Keyboard.UP) this._v = 1;
        }

        private onKeyUp(pEvent: KeyboardEvent): void {
            this.keys[pEvent.keyCode] = false;

            // traitement des touches antagonistes en considerant la touche opposee
            if (pEvent.keyCode == Keyboard.LEFT && this.keys[Keyboard.RIGHT]) this._h = 1;
            else if (pEvent.keyCode == Keyboard.RIGHT && this.keys[Keyboard.LEFT]) this._h = -1;
            else if (pEvent.keyCode == Keyboard.LEFT || pEvent.keyCode == Keyboard.RIGHT) this._h = 0;

            if (pEvent.keyCode == Keyboard.DOWN && this.keys[Keyboard.UP]) this._v = 1;
            else if (pEvent.keyCode == Keyboard.UP && this.keys[Keyboard.DOWN]) this._v = -1;
            else if (pEvent.keyCode == Keyboard.UP || pEvent.keyCode == Keyboard.DOWN) this._v = 0;
        }

    }
