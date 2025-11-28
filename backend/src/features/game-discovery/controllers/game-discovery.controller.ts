import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
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

  @Get(':steamId/achievements/global')
  async getGlobalAchievements(@Param('steamId') steamId: string) {
    return this.discoveryService.getGameAchievementsWithGlobalStats(steamId);
  }

  @Get(':id/games/recent')
  async getRecentGames(@Param('id', ParseIntPipe) id: number) {
    return this.discoveryService.getUserRecentGames(id);
  }
}
