import { User } from './User';
import { Hand } from './Hand';
import { Card } from './Card';

export class Game{
    author: User;
    hands?: Hand[];
    currentPlayer?: User;
    deck?: Card[];
    discard?: Card[];
    winners?: User[];
    isFinished?: boolean;
    constructor(public nbPlayerMissing: number){}

}