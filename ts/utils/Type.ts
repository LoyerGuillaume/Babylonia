class Type {

    public static getConstructorByName (className:string):any {
        if (typeof window[className] === 'undefined' || typeof window[className].constructor === 'undefined') {
            console.error('Can\'t resolve class ' + className + '. No such class or missing constructor.')
        }
        return window[className];
    }

}
