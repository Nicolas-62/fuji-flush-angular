import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms' ;
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Hand } from '../models/Hand';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {

  gamesSubscription: Subscription;
  games: any[];
  gamesToJoin: Game[] = [];
  gamesToPlay: Game[] = [];
  user =  new User("boba.fett@coaxys.com");
  @Input()
  game: Game;
  hand: Hand;
  
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.getGames();
    this.gamesSubscription = this.gameService.gamesSubject.subscribe(
      (games: any[]) => {
        this.games = games;
        console.log("games in component subscription : " +this.games);  
        this.gamesToJoin = [];
        this.gamesToPlay = [];
        this.games.forEach(game => {
          let join = false;
          if(!game.isFinished){
            for(let i = 0; i <game.hands.length; i++){
              if(game.hands[i].player.email == this.user.email){
                console.log(game.hands[i].player.email);
                join = true; 
                break;
              }
            }
            if(join){
              this.gamesToPlay.push(game);
            }else{
              this.gamesToJoin.push(game);
            }
          }
        });
        console.log("gamesToPlay : "+this.gamesToPlay);
      });
    this.gameService.emitGames();
    }
  getHandOfPlayer(game: Game){
    this.hand=null;
    for(let i=0; i<game.hands.length; i++){
      if(game.hands[i].player.email === this.user.email){
        this.hand = game.hands[i];
        return true;
      }
    }
    return false;
  }
  onSubmit(form: NgForm) {
    const nbPlayer = form.value['nbPlayer'];
    this.gameService.addGame(nbPlayer);
  }
  ngOnDestroy(){
  	this.gamesSubscription.unsubscribe();
  }  
}
