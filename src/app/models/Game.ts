import { User } from './User';
import { Hand } from './Hand';
import { Card } from './Card';
import { GameEvent } from './GameEvent';

export class Game{
    id?: number;
    uuid?: string;
    author: User;
    hands?: Hand[];
    currentPlayer?: User;
    deck?: Card[];
    discard?: Card[];
    isFinished?: boolean;
    gameEvents?: GameEvent[];
    constructor(public nbPlayerMissing: number){}

}