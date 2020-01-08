import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';
import { Game } from '../models/Game';
import { User } from '../models/User';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  gamesSubscription: Subscription;
  games: Game[];
  
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gamesSubscription = this.gameService.gamesSubject.subscribe(
  		(games: Game[]) => {
  			this.games = games;
        console.log("games in component subscription : " +this.games);
      }
      );
    this.gameService.emitGames(); 
  }
  addGame(nbPlayer: number, author: User): void {
    const game = new Game(author, nbPlayer);
    this.gameService.addGame(game);
  }  
  ngOnDestroy(){
  	this.gamesSubscription.unsubscribe();
  }  
}
