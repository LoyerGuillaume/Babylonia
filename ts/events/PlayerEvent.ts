class PlayerEvent extends BEvent {

    public static DEATH  :string = 'PLAYER_DEATH';
    public static HAS_HIT:string = 'PLAYER_HAS_HIT';

    public player:Player;

    constructor(pPlayer:Player, pEventName:string) {
        super(pEventName);
        this.player = pPlayer;
    }
}
