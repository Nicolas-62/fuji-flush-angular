import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): Promise<boolean> | boolean{
  	return new Promise((resolve, reject) => {
      if(this.authService.player != null){
        resolve(true);
      }else{
        console.log("acces denied")
        this.router.navigate(['/signin']);
        reject(false);
      }
  	});
  }
}
