import { Injectable } from '@angular/core';
import { Resolve,} from '@angular/router';
import { Game } from './Game';
import { Observable } from 'rxjs';
import { RoomService } from '../services/room.service';


@Injectable()
export class GamesResolver implements Resolve<Observable<Game[]>> {
  constructor(private roomService: RoomService) {}

  resolve() {
    return this.roomService.getGames();
  }
}