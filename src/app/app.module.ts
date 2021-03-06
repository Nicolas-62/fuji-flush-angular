import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GameTableComponent } from './game-table/game-table.component';
import { GameHistoryComponent } from './game-history/game-history.component';
import { PlayerHandComponent } from './player/player-hand/player-hand.component';
import { SigninComponent } from './signin/signin.component';
import { AuthService } from './services/auth.service';
import { OtherHandComponent } from './player/other-hand/other-hand.component';
import { GameService } from './services/game.service';
import { AuthGuardService } from './services/auth-gard.service';
import { RulesComponent } from './rules/rules.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as SockJS from 'sockjs-client';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './my-rx-stomp.config';

export function socketProvider() {
  return new SockJS('http://localhost:8080/api');
}
@NgModule({
  declarations: [
    AppComponent,
    GameRoomComponent,
    HeaderComponent,
    GameTableComponent,
    GameHistoryComponent,
    PlayerHandComponent,
    SigninComponent,
    OtherHandComponent,
    RulesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [AuthService, 
    GameService, 
    AuthGuardService,
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
