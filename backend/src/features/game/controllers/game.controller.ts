import { Controller } from '@nestjs/common';
import { Get, Param } from '@nestjs/common';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Get('/:steamId')
  async getGame(@Param('steamId') steamId: string) {
    return this.gameService.findBySteamIds([steamId]);
  }
}
