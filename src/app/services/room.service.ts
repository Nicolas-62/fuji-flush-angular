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
  topicSubscription: Subscription;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http:HttpClient,
    private rxStompService: RxStompService) { 
    console.log("roomService construct..")
 //   this.getGames();
  }
  subscribeToRoomWebSocket(player: User){
    this.topicSubscription =  this.rxStompService.watch('/send/games').subscribe((gamesReceived: Message) => {
      this.games = JSON.parse(gamesReceived.body);
      this.emitGames(); 
    });
    // this.roomWebSocket = webSocket('ws://localhost:9000/websocket/room?email='+ player.email);
    // this.roomWebSocket.subscribe(
    //   gamesReceived =>{
    //     this.games = gamesReceived;
    //     console.log("games received from WS (nb games) : "+ this.games.length);
    //     this.emitGames();     
    // });
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
    //this.roomWebSocket.next(game);
    this.rxStompService.publish({
      destination: "/api/ws/joinGame", 
      body: JSON.stringify({gameUuid : game.uuid, playerEmail : player.email})});
  }
  addGameWS(nbPlayer: number, user: User){
    const game = new Game(nbPlayer);
    game.author = user;  
    //this.roomWebSocket.next(game);
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
  // private log(message: string){
  //   this.messageService.add(message);
  // }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error("error : "+error.message); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  
}
