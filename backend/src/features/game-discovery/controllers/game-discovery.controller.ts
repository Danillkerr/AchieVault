import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameDiscoveryService } from '../services/game-discovery.service';

@Controller('games-discovery')
export class GameDiscoveryController {
  constructor(private readonly discoveryService: GameDiscoveryService) {}

  @Get('popular')
  async getPopularGames() {
    return this.discoveryService.getPopularGames();
  }

  @Get('search')
  async searchGames(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return [];
    }
    return this.discoveryService.searchGames(query);
  }
}
