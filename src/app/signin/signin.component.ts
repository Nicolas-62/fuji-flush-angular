import { Component, OnInit } from '@angular/core';
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
  playerDemo = new User("bob@g.com", "Bob");

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
    this.spinner.show();
    this.authService.player = this.playerDemo;
    this.roomService.addGameDemo().subscribe(
      game =>{
        this.gameService.game = game;
        console.log("gameDemo added received from server (id) : "+ game.id);
        this.spinner.hide();
        this.router.navigate(['/game/'+game.uuid]);
    });
  }
}
