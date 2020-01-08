import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { Game } from '../models/Game';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  games: Game[];
  gamesSubject = new Subject<Game[]>();

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  constructor(private http:HttpClient) { 
    this.getGames();
  }
  API_URL = "http://localhost:9000/api";
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error("error : "+error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  emitGames(){
    this.gamesSubject.next(this.games);
  }
  // private log(message: string){
  //   this.messageService.add(message);
  // }
  getGames(){
    this.http.get<Game[]>(this.API_URL+"/games")      
    .pipe(
      catchError(this.handleError<Game[]>('getGames', []))
    ).subscribe(
      games =>{
        this.games = games ? games : []
        console.log("games received : "+ this.games);
        this.emitGames();
      
      });
  }
  addGame(game : Game){
    this.http.post<Game>(this.API_URL+"/game/add", game, this.httpOptions)      
    .pipe(
      catchError(this.handleError<Game>('getGame', null))
    ).subscribe(
      game =>{
        this.games.push(game);
        console.log("game received : "+ game);
        this.emitGames();
      
      });
  }
  getGameSlug(slug:String):Observable<Game>{
    return this.http.get<Game>(this.API_URL+"/Games/"+slug);
  }
}
