import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { User } from '../models/User';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

	errorMessage: string;
	players: User[];

  constructor(private authService: AuthService,
  						private router: Router,
  						private formBuilder: FormBuilder) { }

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
}
