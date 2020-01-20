import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Game } from './Game';
import { Observable } from 'rxjs';
import { GameService } from '../services/game.service';


@Injectable()
export class GameResolver implements Resolve<Observable<Game>> {
  constructor(private gameService: GameService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.gameService.getGame(route.paramMap.get('uuid'));
  }
}