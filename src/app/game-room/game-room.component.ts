import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms' ;
import { Subscription } from 'rxjs';
import { RoomService } from '../services/room.service';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Hand } from '../models/Hand';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit, OnDestroy {

  // variable qui écoute les parties émises par le service
  gamesSubscription: Subscription;
  // toutes les parties reçus
  games: any[];
  // les parties triées selon qu le joueur les a déjà rejoint ou pas
  gamesToJoin: Game[];
  gamesToPlay: Game[];
  // le joueur
  player: User;
  // main du joueur dans une partie qu'il a déjà rejoint (voir si il a quitté la partie)
  aHand: Hand;
  
  constructor(private roomService: RoomService, 
              private authService: AuthService) { }

  ngOnInit() {
    this.player = this.authService.player;
    // connection du service au websocket
    this.roomService.subscribeToRoomWebSocket(this.player);
    // connection à l'emétteur du service qui recoit et émet les données du websocket    
    this.gamesSubscription = this.roomService.gamesSubject.subscribe(
      (games: any[]) => {
        this.games = games;
        console.log("games received after subscription : " +this.games.length);  
        this.orderGames();      
    });
  }
  // rejoindre une partie
  join(game: Game) {
    this.roomService.joinGameWS(game);
  }
  // récuperer la main du joueur pour voir si il a quitté la partie
  getHandOfPlayer(game: Game): boolean{
    this.aHand=null;
    for(const hand of game.hands){
      if(hand.player.email === this.player.email){
        this.aHand = hand;
        return true;
      }
    }
    return false;
  }
  // créer une partie
  onSubmit(form: NgForm) {
    const nbPlayer = form.value['nbPlayer'];
    this.roomService.addGameWS(nbPlayer, this.player);
  }
  ngOnDestroy(){
    this.gamesSubscription.unsubscribe();
    this.roomService.roomWebSocket.unsubscribe();
  }  
  // classer le parties
  orderGames(){
    this.gamesToJoin = [];
    this.gamesToPlay = [];
    this.games.forEach(game => {
      let joined = false;
      if(!game.isFinished){
        // checking if player already joined to the game
        for(let i = 0; i <game.hands.length; i++){
          if(game.hands[i].player.email == this.player.email){
            joined = true; 
            break;
          }
        }
        if(joined){
          this.gamesToPlay.push(game);
        }else{
          this.gamesToJoin.push(game);
        }
      }
    });
  }
}
