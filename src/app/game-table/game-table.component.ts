import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Hand } from '../models/Hand';
import { AuthService } from '../services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { resolve } from 'url';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css']
})
export class GameTableComponent implements OnInit, OnDestroy {

  // Variable qui écoute la partie émise par le service 
  gameSubscription: Subscription;
  game: Game;
  // joueur courant
  player: User;
  playerHand: Hand = null;
  constructor(private route: ActivatedRoute, 
              private router: Router,
              private gameService: GameService,
              private authService: AuthService) { 
                
              }

  ngOnInit() {
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
        this.setHand;
        if(game.isFinished){
          setTimeout(() =>{
            this.router.navigate(['/games']);
          }, 3000);
        }
      }
    );
    // on fait émettre le service
    this.gameService.emitGame();
    // on se connecte au websocket du service
    this.gameService.subscribeToGameWebSocket(this.player.email);
  }
  leave() {
    this.gameService.leave();
  }  
  // find the hand of the player
  // setHand = () => {
  //   this.playerHand = this.game.hands.find(
  //     (hand) => { 
  //       hand.player.email === this.player.email;
  //     });     
  // }
  setHand(): void {
    for(let i=0; i< this.game.hands.length; i++){
        if(this.game.hands[i].player.email === this.player.email){
          this.playerHand = this.game.hands[i];
          break;
        }
    }
  }
  ngOnDestroy(){
    this.gameSubscription.unsubscribe();
    this.gameService.gameWebSocket.unsubscribe();
  }  
}
