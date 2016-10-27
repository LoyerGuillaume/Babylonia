class PlayerEvent extends BEvent {

    public static DEATH    :string = 'PLAYER_DEATH';
    public static HAS_HIT  :string = 'PLAYER_HAS_HIT';
    public static HIT      :string = 'PLAYER_HIT';
    public static ATTACK   :string = 'ATTACK';
    public static GAIN_LIFE   :string = 'GAIN_LIFE';

    public static GOT_BEST_SCORE :string = 'GOT_BEST_SCORE';
    public static GOT_SCORE      :string = 'GOT_SCORE';
    public static GOT_COIN       :string = 'GOT_COIN';
    public static GOT_XP         :string = 'GOT_XP';
    public static GOT_LEVEL      :string = 'GOT_LEVEL';

    public static IN_ARENA      :string = 'IN_ARENA';

    constructor(pEventName:string, pParams:any = undefined) {
        super(pEventName, pParams);
    }
}
