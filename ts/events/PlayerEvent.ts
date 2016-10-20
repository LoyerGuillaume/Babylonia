class PlayerEvent extends BEvent {

    public static DEATH  :string = 'PLAYER_DEATH';
    public static HAS_HIT:string = 'PLAYER_HAS_HIT';
    public static HIT    :string = 'PLAYER_HIT';

    public player:Player;
    public enemyScore:number;

    constructor(pEventName:string, pPlayer:Player, pEnemyScore:number = 0) {
        super(pEventName);
        this.player     = pPlayer;
        this.enemyScore = pEnemyScore;
    }
}
