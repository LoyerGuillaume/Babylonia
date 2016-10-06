class Tools {

    public static forEach(pElems: any[], pAction: (elem: any) => void) {
        var lLen = pElems.length;
        for (var i = 0; i < lLen; i++) {
            pAction(pElems[i]);
        }
    }

}