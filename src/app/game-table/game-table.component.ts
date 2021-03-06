import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Hand } from '../models/Hand';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';

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
  demoEnd: boolean =false;
  // joueur courant
  player: User;
  playerHand: Hand = null;
  currentHand: Hand;
  constructor(private route: ActivatedRoute, 
              private router: Router,
              private gameService: GameService,
              private authService: AuthService,
              private spinner: NgxSpinnerService,
              private location: Location) { 
                
              }

  ngOnInit() {
    this.spinner.show();
    // on récupère le joueur connecté
    this.player = this.authService.player;
    // data récupérée durant la navigation sinon erreur test 'undefined' sur les attribut dans le template.
    this.game = this.route.snapshot.data.game;
    // on récupère la main du joueur dans la partie
    this.setHand();
    // on passe la partie au game service
    this.gameService.game = this.game;
    // connection au service
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      game => {
        this.game = game;
        // on récupère la main du joueur
        this.setHand();
        if(game.isFinished){
          // on défini les gagnants pour le template
          this.setWinners();
          // on redirige au dashboard après affichage des gagants
          setTimeout(() =>{
            this.authService.signOutUser();
            this.router.navigate(['/games']);
          }, 2000);
        // si c'est une partie automatique on joue une carte du joueur courant
        }else if(this.game.author.email === "klaatu@g.com" && !this.demoEnd){
          this.setCurrentHand();
          setTimeout(() =>{
            this.playCardDemo(this.currentHand.cards.length-1, this.currentHand);
          }, 1000);
        }
        this.spinner.hide();          
      }
    );    
    // si on lance une partie automatique
    if(!this.game.isFinished && this.game.author.email === "klaatu@g.com"){
      this.setCurrentHand();
      this.playCardDemo(this.currentHand.cards.length-1, this.currentHand);
    }else{
      // on se connecte au websocket du service
      this.gameService.subscribeToGameWebSocket(this.player.email);     
    }
    // on fait emmettre le service
    this.gameService.emitGame();
  }
  leave() {
    if(this.player.email === "klaatu@g.com"){
      this.demoEnd = true;
      this.router.navigate(['/']);
    }else{
      this.gameService.leave(this.game.uuid, this.game.hands.indexOf(this.playerHand));  
      this.router.navigate(['/games']);
    }
  }  
  setHand(): void {
    for(let i=0; i< this.game.hands.length; i++){
        if(this.game.hands[i].player.email === this.player.email){
          this.playerHand = this.game.hands[i];
          break;
        }
    }
  }
  setCurrentHand(): void {
    for(let i=0; i< this.game.hands.length; i++){
      if(this.game.hands[i].player.email === this.game.currentPlayer.email){
        this.currentHand = this.game.hands[i];
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
  back(){
    this.location.back();
  }
  playCardDemo(cardIndex: number, hand: Hand){
    this.gameService.playCardDemo(this.game.uuid, this.game.hands.indexOf(hand), cardIndex);
  }
  ngOnDestroy(){
    this.gameSubscription.unsubscribe();
    if(this.gameService.gameWebSocket != null){
      this.gameService.gameWebSocket.unsubscribe();
    }
  }  
}
