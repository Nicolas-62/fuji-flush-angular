import { Game } from './Game';
import { User } from './User';
import { Card } from './Card';

export class Hand{
    game: Game;
    player: User;
    cards?: Card[];
    cardP?: Card;
    hasLeft: boolean;
    hasWon: boolean;
}