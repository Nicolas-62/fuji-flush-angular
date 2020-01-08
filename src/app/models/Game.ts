import { User } from './User';
import { Hand } from './Hand';
import { Card } from './Card';

export class Game{
    hands: Hand[];
    currentPlayer?: User;
    deck?: Card[];
    discard?: Card[];
    winners?: User[];
    isFinished: boolean;
    constructor(public author: User,
                public nbPlayerMissing: number){}

}