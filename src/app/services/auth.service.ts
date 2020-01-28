import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  player: User = null;
  playerSubject = new Subject<User>();
  
  availablePlayers: User[] = [
    new User("bob@g.com", "Bob"),
    new User("lisa@g.com", "Lisa"),
    new User("alex@g.com", "Alex"),
    new User("boba.fett@coaxys.com", "Boba"),
    new User("dark.maul@coaxys.com", "Maul"),
    new User("ki-adi-mundi@coaxys.com", "Ki-Adi-Mundi")
  ]
  constructor() { }
  emitPlayer(){
    this.playerSubject.next(this.player);
  }
  signInUser(email: string){
    return new Promise((resolve, reject) => {
      this.availablePlayers.find(
        (player) => {
          if(player.email === email){
            this.player = player;
            resolve(player);
            this.emitPlayer();
          }
        }
      )       
    });
  }
  signOutUser(){
    this.player = null;
  }
}