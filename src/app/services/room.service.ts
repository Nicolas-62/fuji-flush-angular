import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of, } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Game } from '../models/Game';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  API_URL = "http://localhost:9000/api";
  games: Game[] = [];
  gamesSubject = new Subject<Game[]>();
  roomWebSocket: WebSocketSubject<any>;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http:HttpClient) { 
    this.getGames();
  }
  subscribeToRoomWebSocket(player: User){
    this.roomWebSocket = webSocket('ws://localhost:9000/websocket/room?email='+ player.email);
    this.roomWebSocket.subscribe(
      gameReceived =>{
          /* find if game already existe */
          const gameIndexToRemove = this.games.findIndex(
            (game) => {
              if(game.uuid === gameReceived.uuid){
                return true;
              }
            }
          );
          /* if not also it's a new game, push it */
          if(gameIndexToRemove == -1){
            this.games.push(gameReceived);
          }
          else{
            /* replace 1 element at index 'gameIndexToRemove' to gameReceived */
            this.games.splice(gameIndexToRemove, 1, gameReceived);
          }
        console.log("game added received from WS (id) : "+ gameReceived.id);
        this.emitGames();     
    });
  }
  emitGames(){
    this.gamesSubject.next(this.games);
  }
  joinGameWS(game: Game){
    this.roomWebSocket.next(game);
  }
  addGameWS(nbPlayer: number, user: User){
    const game = new Game(nbPlayer);
    game.author = user;  
    this.roomWebSocket.next(game);
  }
  getGames(){
    console.log("start request get all games");
    this.http.get<Game[]>(this.API_URL+"/games")      
    .subscribe(
      games => {
        this.games = games ? games : [];
        console.log("games received from server : "+ this.games.length);
        this.emitGames();     
      }
    );
  }
  addGame(nbPlayer: number, user: User){
    const game = new Game(nbPlayer);
    game.author = user;
    console.log("start request add game");
    this.http.post<any>(this.API_URL+"/game/add", JSON.stringify(game))      
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
