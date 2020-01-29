import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Hand } from '../models/Hand';
import { AuthService } from '../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { resolve } from 'url';
import { NgxSpinnerService } from 'ngx-spinner';
import { stringify } from 'querystring';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css']
})
export class GameTableComponent implements OnInit, OnDestroy {

  // Variable qui écoute la partie émise par le service 
  gameSubscription: Subscription;
  game: Game;
  winners: Hand[];
  // joueur courant
  player: User;
  playerHand: Hand = null;
  constructor(private route: ActivatedRoute, 
              private router: Router,
              private gameService: GameService,
              private authService: AuthService,
              private spinner: NgxSpinnerService) { 
                
              }

  ngOnInit() {
    this.spinner.show();
    this.player = this.authService.player;
    // data récupérée durant la navigation
    console.log("game received from resolver (id) : " + this.route.snapshot.data.game.id)
    this.game = this.route.snapshot.data.game;
    // on récupère la main du joueur
    this.setHand();
    // on passe la partie au game service
    this.gameService.game = this.game;
    // on ecoute l'éméteur du service
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      game => {
        console.log("from gameTable, received from gameService (id): " +  game.uuid);
        this.game = game;
        this.setHand();
        this.spinner.hide();
        if(game.isFinished){
          this.setWinners();
          setTimeout(() =>{
            this.router.navigate(['/games']);
          }, 2000);
        }
      }
    );
    // on fait émettre le service
    this.gameService.emitGame();
    // on se connecte au websocket du service
    this.gameService.subscribeToGameWebSocket(this.player.email);
    if(this.game.author.email = "bob@g.com"){
      this.launchGameDemo();
    }
  }
  leave() {
    this.gameService.leave(this.game.uuid, this.game.hands.indexOf(this.playerHand));  
    this.router.navigate(['/games']);
  }  
  setHand(): void {
    for(let i=0; i< this.game.hands.length; i++){
        if(this.game.hands[i].player.email === this.player.email){
          this.playerHand = this.game.hands[i];
          break;
        }
    }
  }
  setWinners(): void {
    this.winners = [];
    for(let i=0; i< this.game.hands.length; i++){
      if(this.game.hands[i].hasWon){
        this.winners.push(this.game.hands[i]);
      }
    }
  }
  ngOnDestroy(){
    this.gameSubscription.unsubscribe();
    if(this.gameService.gameWebSocket != null){
      this.gameService.gameWebSocket.unsubscribe();
    }
  }  
  launchGameDemo(){
    while(!this.game.isFinished){
      for(let hand of this.game.hands){
        if(hand.cards.length != 0){
          setTimeout(() => {
            this.playCardDemo(hand.cards.length-1, hand)
          }, 1000)
        }
      }
    }

  }
  playCardDemo(cardIndex: number, hand: Hand){
    this.gameService.playCard(this.game.uuid, this.game.hands.indexOf(hand), cardIndex);
  }
}
