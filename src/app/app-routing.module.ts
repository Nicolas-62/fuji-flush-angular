import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameRoomComponent } from './game-room/game-room.component';
import { GameTableComponent } from './game-table/game-table.component';
import { SigninComponent } from './signin/signin.component';
import { AuthGuardService } from './services/auth-gard.service';
import { GameResolver } from './models/GameResolver';

const routes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: 'signin', component: SigninComponent },
    { path: 'games', canActivate: [AuthGuardService], component: GameRoomComponent },
    { path: 'game/:uuid', canActivate: [AuthGuardService], component: GameTableComponent,  resolve: {game: GameResolver}  },
    { path: '**', redirectTo: 'signin' },
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
      GameResolver
    ]
  })
  export class AppRoutingModule { }