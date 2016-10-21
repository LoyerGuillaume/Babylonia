class PlayerEvent extends BEvent {

    public static DEATH    :string = 'PLAYER_DEATH';
    public static HAS_HIT  :string = 'PLAYER_HAS_HIT';
    public static HIT      :string = 'PLAYER_HIT';
    public static GOT_COIN :string = 'GOT_COIN';
    public static ATTACK   :string = 'ATTACK';

    constructor(pEventName:string, pParams:any = undefined) {
        super(pEventName, pParams);
    }
}
