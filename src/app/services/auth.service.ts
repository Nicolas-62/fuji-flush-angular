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
    new User("anakin@g.com", "Anakin"),
    new User("han.solo@g.com", "Han"),
    new User("dark.vador@g.com", "Vador"),
    new User("boba.fett@g.com", "Boba"),
    new User("obi.wan@g.com", "Obi-Wan"),
    new User("ki.adi.mundi@g.com", "Ki-Adi-Mundi"),
    new User("leia@g.com", "Leia")
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