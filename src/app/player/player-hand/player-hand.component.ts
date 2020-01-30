import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Hand } from '../../models/Hand';
import { Game } from '../../models/Game';
import { User } from 'src/app/models/User';
import { GameService } from 'src/app/services/game.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.css']
})
export class PlayerHandComponent implements OnInit, OnDestroy {
 
  @Input() hand: Hand;
  @Input() game: Game;

  gameSubscription: Subscription;
  currentPlayer: boolean;
  player: User;

  constructor(private gameService: GameService,
              private authService: AuthService) { }

  ngOnInit() {
    this.player = this.authService.player;
    this.isTheCurrentPlayer(this.game);
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      gameReceived => {
        this.game = gameReceived;
        this.setHand();
        this.isTheCurrentPlayer(this.game);       
      }
    );
  }
  // find the hand of the player
  setHand(): void {
    for(let i=0; i< this.game.hands.length; i++){
        if(this.game.hands[i].player.email === this.player.email){
          this.hand = this.game.hands[i];
          break;
        }
    }
  }
  // check if he's the current player
  isTheCurrentPlayer(game: Game){
    if(!game.isFinished){
      if(this.hand.player.email == game.currentPlayer.email){
        this.currentPlayer = true;
      }else{
        this.currentPlayer = false;
      }
    }
  }
  playCard(cardIndex: number){
    if(this.currentPlayer) this.gameService.playCard(this.game.uuid, this.game.hands.indexOf(this.hand), cardIndex);
  }
  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
}
