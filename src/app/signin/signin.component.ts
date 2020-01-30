import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { User } from '../models/User';
import { Game } from '../models/Game';
import { GameService } from '../services/game.service';
import { RoomService } from '../services/room.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

	errorMessage: string;
  players: User[];
  gameDemo: Game;
  playerDemo = new User("klaatu@g.com", "Klaatu");

  constructor(private authService: AuthService,
  						private router: Router,
              private gameService: GameService,
              private roomService: RoomService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.players = this.authService.availablePlayers;
  }
  onSubmit(form: NgForm){
	const email = form.value['email'];
	this.authService.signInUser(email).then((user: User) => {
        this.authService.player = user;
		this.router.navigate(['/games']);
    });
  }
  launchDemo(){
    this.authService.player = this.playerDemo;
    this.authService.emitPlayer();
    this.roomService.addGameDemo().subscribe(
      game =>{
        this.gameDemo = game;
        this.router.navigate(['/game/'+this.gameDemo.uuid]);
      });
    }
}
