import { Injectable } from '@angular/core';
import { Game } from '../models/Game';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Subject, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game: Game;
  API_URL = "http://localhost:8080/api";
  gameSubject = new Subject<any>();
  gameWebSocket: WebSocketSubject<any>;
  gameSubscription: Subscription;

  constructor(private http:HttpClient,
    private rxStompService: RxStompService) { 
    console.log("gameService construct..")
  }
  subscribeToGameWebSocket(email: string){
    this.gameSubscription =  this.rxStompService.watch('/send/game').subscribe((gamesReceived: Message) => {
      this.game = JSON.parse(gamesReceived.body);
      this.emitGame(); 
    });
  }
  emitGame(){
    this.gameSubject.next(this.game);
  }
  getGame(uuid: string): Observable<Game> {
    return this.http.get<Game>("api/game/" + uuid);
  }
  playCard( gameUuid : string, handIndex: number, cardIndex: number,){
    this.rxStompService.publish(
      {
        destination: '/api/ws/playCard', 
        body: JSON.stringify({gameUuid : gameUuid, handIndex : handIndex, cardIndex : cardIndex}),
      }
    );
  }
  leave(gameUuid : string, handIndex: number){
    this.rxStompService.publish(
      {
        destination: '/api/ws/leave', 
        body: JSON.stringify({gameUuid : gameUuid, handIndex : handIndex}),
      }
    );
  }
}
