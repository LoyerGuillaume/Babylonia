class EnemyEvent extends BEvent {

    public static ALL_DEAD    :string = 'ALL_ENEMY_DEAD';

    constructor(pEventName:string, pParams:any = undefined) {
        super(pEventName, pParams);
    }
} 
