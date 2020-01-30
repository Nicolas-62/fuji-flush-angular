import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms' ;
import { Subscription } from 'rxjs';
import { RoomService } from '../services/room.service';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Hand } from '../models/Hand';
import { AuthService } from '../services/auth.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

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
  // les parties triées selon que le joueur les a déjà rejoint ou pas
  gamesToJoin: Game[];
  gamesToPlay: Game[];
  // le joueur
  player: User;
  // main du joueur dans une partie qu'il a déjà rejoint (voir si il a quitté la partie)
  aHand: Hand;
  
  constructor(private route: ActivatedRoute,
              private roomService: RoomService, 
              private authService: AuthService,
              private spinner: NgxSpinnerService,
              private router: Router) { }

  ngOnInit() {

    this.spinner.show();
    this.player = this.authService.player;
    // connection à l'emétteur du service.   
    // data récupérée durant la navigation
    this.games = this.route.snapshot.data.games;
    // ajout des parties au service.
    this.roomService.games = this.games;
    // connection au service
    this.gamesSubscription = this.roomService.gamesSubject.subscribe(
      (games: any[]) => {
        this.games = games;
        this.orderGames();     
        this.spinner.hide(); 
    });
    // connection du service au websocket
    this.roomService.subscribeToRoomWebSocket(this.player);
  }
  // rejoindre une partie
  join(game: Game) {
    this.roomService.joinGameWS(game, this.player);
  }
  goToplay(gameUuid: string){
    this.router.navigate(['/game/'+gameUuid]);
  }
  // récuperer la main du joueur pour voir si il a quitté la partie
  getHandOfPlayer(game: Game): boolean{
    this.aHand=null;
    for(let i=0; i<game.hands.length; i++){
      if(game.hands[i].player.email === this.player.email){
        this.aHand = game.hands[i];
        return true;
      }
    }
    return false;
  }
  // créer une partie
  onSubmit(form: NgForm) {
    const nbPlayer = form.value['nbPlayer'] ? form.value['nbPlayer'] : 3;
    this.roomService.addGameWS(nbPlayer, this.player);
  }
  ngOnDestroy(){
    this.gamesSubscription.unsubscribe();
    if(this.roomService.roomSubscription != null){
      this.roomService.roomSubscription.unsubscribe();
    }
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
          if(game.nbPlayerMissing != 0){
            this.gamesToJoin.push(game);
          }
        }
      }
    });
  }
}
