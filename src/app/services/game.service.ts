import { Injectable } from '@angular/core';
import { Game } from '../models/Game';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  game: Game;
  API_URL = "http://localhost:9000/api";
  gameSubject = new Subject<any>();
  gameWebSocket: WebSocketSubject<any>;

  constructor(private http:HttpClient) { 
  }

  getGame(uuid: string): Observable<Game> {
    return this.http.get<Game>(this.API_URL+"/game/" + uuid);
  }
  subscribeToGameWebSocket(email: string){
    // création du socket
    this.gameWebSocket = webSocket(
      "ws://localhost:9000/websocket/game?" +
      "gameUuid=" + this.game.uuid +
      "&email=" + email);
      // souscription au socket, emission des données reçu par le socket
    this.gameWebSocket.subscribe(
      gameReceived => {
        this.game = gameReceived;
        console.log("game play received from WS (id) : "+ gameReceived.id);
        this.emitGame();
      }
    )
  }
  emitGame(){
    this.gameSubject.next(this.game);
  }
  playCard(cardIndex: number){
    this.gameWebSocket.next(cardIndex);
  }
  leave(){
    this.gameWebSocket.next(-1);
  }
}
