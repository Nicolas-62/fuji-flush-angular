import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms' ;
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
  gamesToJoin: Game[];
  gamesToPlay: Game[];
  user =  new User("bob@g.com");
  @Input()
  game: Game;
  
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getGames();
      this.gamesSubscription = this.gameService.gamesSubject.subscribe(
        (games: any[]) => {
          this.games = games;
          console.log("games in component subscription : " +this.games);         
          this.games.forEach(game => {
            let join = false;
            game.hands.forEach(hand => join = hand.player.email == this.user.email ? true : false);
              if(join){
                this.gamesToPlay.push(game);
              }else{
                this.gamesToJoin.push(game);
              }
            }
          );
        }
      );
  } 
  onSubmit(form: NgForm) {
    const nbPlayer = form.value['nbPlayer'];
    this.gameService.addGame(nbPlayer);
  }
  ngOnDestroy(){
  	this.gamesSubscription.unsubscribe();
  }  
}
