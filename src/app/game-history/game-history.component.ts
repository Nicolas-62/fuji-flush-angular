import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Game } from '../models/Game';
import { GameEvent } from '../models/GameEvent';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css']
})
export class GameHistoryComponent implements OnInit, OnDestroy {

  @Input()
  game: Game;

  gameEvents: GameEvent[];
  gameSubscription: Subscription;


  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      game => {
        this.gameEvents = game.gameEvents;
      }
    );
  }
  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
}
