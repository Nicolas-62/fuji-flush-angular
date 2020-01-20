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
              private authSerice: AuthService) { }

  ngOnInit() {
    this.player = this.authSerice.player;
    this.isTheCurrentPlayer(this.game);
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      gameReceived => {
        this.game = gameReceived;
        this.getHand(this.game);
        this.isTheCurrentPlayer(this.game);       
      }
    );
  }
  // find the hand of the player
  getHand(game: Game){
    this.hand = game.hands.find(
      (hand) => { 
        hand.player.email === this.player.email;
      });
      
  }
  // check if he's the current player
  isTheCurrentPlayer(game: Game){
    if(this.player.email == game.currentPlayer.email){
      this.currentPlayer = true;
    }else{
      this.currentPlayer = false;
    }
  }
  playCard(cardIndex: number){
    this.gameService.playCard(cardIndex);
  }
  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
}
