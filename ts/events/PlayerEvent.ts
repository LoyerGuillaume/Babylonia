class PlayerEvent extends BEvent {

    public static DEATH:string = 'player_death';

    public player:Player;

    constructor(pPlayer:Player) {
        super(PlayerEvent.DEATH);
        this.player = pPlayer;
    }
}
