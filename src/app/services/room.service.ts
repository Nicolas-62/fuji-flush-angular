import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of, Subscription, } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Game } from '../models/Game';
import { User } from '../models/User';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  // API_URL = "http://localhost:8080/api";
  games: Game[] = [];
  gamesSubject = new Subject<Game[]>();
  roomWebSocket: WebSocketSubject<any>;
  roomSubscription: Subscription;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http:HttpClient,
    private rxStompService: RxStompService) { 
    console.log("roomService construct..")
 //   this.getGames();
  }
  subscribeToRoomWebSocket(player: User){
    this.roomSubscription =  this.rxStompService.watch('/send/games').subscribe((gamesReceived: Message) => {
      this.games = JSON.parse(gamesReceived.body);
      this.emitGames(); 
    });
  }
  getGames(){
    console.log("start request get all games");
    this.http.get<Game[]>("/api/games")   
    .subscribe(
      games => {
        this.games = games ? games : [];
        console.log("games received from API (nb games) : "+ this.games.length);
        this.emitGames();     
      }
    );
  }
  emitGames(){
    this.gamesSubject.next(this.games);
  }
  joinGameWS(game: Game, player: User){
    this.rxStompService.publish({
      destination: "/api/ws/joinGame", 
      body: JSON.stringify({gameUuid : game.uuid, playerEmail : player.email})
    });
  }
  addGameWS(nbPlayer: number, user: User){
    const game = new Game(nbPlayer);
    game.author = user;  
    this.rxStompService.publish({destination: '/api/ws/addGame', body: JSON.stringify(game)});
  }
  addGame(nbPlayer: number, user: User){
    const game = new Game(nbPlayer);
    game.author = user;
    console.log("start request add game");
    this.http.post<any>("api/game/add", JSON.stringify(game))      
    .subscribe(
        game =>{
          this.games.push(game);
          console.log("game added received from server (id) : "+ game.id);
          this.emitGames();     
      });
  }
}
