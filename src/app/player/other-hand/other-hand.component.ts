import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models/Game';
import { Hand } from 'src/app/models/Hand';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-other-hand',
  templateUrl: './other-hand.component.html',
  styleUrls: ['./other-hand.component.css']
})
export class OtherHandComponent implements OnInit, OnDestroy {

  @Input() hand: Hand;
  @Input() game: Game;
  @Input() index: number;

  gameSubscription: Subscription;
  currentPlayer: boolean;
 
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.isTheCurrentPlayer(this.game);
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      game => {
        this.game = game;
        // find the hand of the player
        this.hand = this.game.hands[this.index];
        this.isTheCurrentPlayer(this.game);
      }
    );
  }
  isTheCurrentPlayer(game: Game){
    // check if he's the current player
    if(!game.isFinished){
      if(this.hand.player.email == game.currentPlayer.email){
        this.currentPlayer = true;
      }else{
        this.currentPlayer = false;
      }
    }
  }
  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
}
