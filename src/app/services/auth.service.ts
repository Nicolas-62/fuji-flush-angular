import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  player: User = null;
  
  availablePlayers: User[] = [
    new User("boba.fett@coaxys.com", "Boba"),
    new User("bob@g.com", "Bob"),
    new User("dark.maul@coaxys.com", "Maul"),
    new User("lisa@g.com", "Lisa"),
    new User("alex@g.com", "Alex")
  ]
  constructor() { }

  signInUser(email: string){
    return new Promise((resolve, reject) => {
      this.availablePlayers.find(
        (user) => {
          if(user.email === email){
            resolve(user);
          }
        }
      )       
    });
  }
  signOutUser(){
    this.player = null;
  }
}