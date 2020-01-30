import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  player: User = null;
  playerSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) { }

  disabled: boolean = true;
  ngOnInit() {
    this.playerSubscription = this.authService.playerSubject.subscribe(
      (player: User) => {
        this.player = player;
      }
    );  
  }
  inProgress() {   
    alert("cette page est en cours de développement");
  }
  logout(){
    this.authService.player = null;
    this.authService.emitPlayer();
    this.router.navigate(['/signin']);
  }
}
