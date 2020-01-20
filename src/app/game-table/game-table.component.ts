import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { Hand } from '../models/Hand';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css']
})
export class GameTableComponent implements OnInit, OnDestroy {

  // Variable qui écoute la partie émise par le service 
  gameSubscription: Subscription;
  // partie, mise grâce au service quand celui ci recoit des datas
  game: Game;
  // joueur courant
  player: User;

  constructor(private route: ActivatedRoute, 
              private gameService: GameService,
              private authService: AuthService) { 
                
              }

  ngOnInit() {
    this.player = this.authService.player;

    // data récupérée durant la navigation de game-room à game-table
    this.game = this.route.snapshot.data.game;

    // on la passe au game service
    this.gameService.game = this.game;

    // on se connecte au websocket du service
    this.gameService.subscribeToGameWebSocket(this.player.email);

    // on ecoute l'éméteur du service
    this.gameSubscription = this.gameService.gameSubject.subscribe(
      game => {
        console.log("after subcription : " +  game.uuid);
        this.game = game;
      }
    );

  }
  ngOnDestroy(){
    this.gameSubscription.unsubscribe();
    this.gameService.gameWebSocket.unsubscribe();
  }  
}
