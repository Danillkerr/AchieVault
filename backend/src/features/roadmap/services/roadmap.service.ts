import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RoadmapRepository } from '../repositories/abstracts/roadmap.repository.abstract';
import { CreateRoadmapDto } from '../dto/create-roadmap.dto';
import { GameService } from '../../game/service/game.service';
import {
  GameMetricData,
  RecommendationService,
} from './recommendation.service';
import { UserGameService } from 'src/features/users/services/user-game.service';
import { RoadmapStatus } from '../entities/roadmap-game.entity';
import { AchievementService } from 'src/features/game/service/achievement.service';
import { RoadmapGameRepository } from '../repositories/abstracts/roadmap-game.repository.abstract';
import { UserAchievementService } from 'src/features/users/services/user-achievement.service';
import {
  RoadmapDetailsResponse,
  RoadmapPreviewResponse,
} from '../interface/RoadmapData.interface';
import { UpdateGameStatusDto } from '../dto/update-game-status.dto';

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name);

  constructor(
    @Inject(RoadmapRepository) private readonly roadmapRepo: RoadmapRepository,
    private readonly userGameService: UserGameService,
    private readonly gameService: GameService,
    private readonly recommendationService: RecommendationService,
    private readonly achievementService: AchievementService,
    private readonly userAchievementService: UserAchievementService,
    @Inject(RoadmapGameRepository)
    private readonly roadmapGameRepo: RoadmapGameRepository,
  ) {}

  async getRoadmapPreview(
    userId: number,
  ): Promise<RoadmapPreviewResponse | null> {
    const roadmap = await this.roadmapRepo.findLatestByUserId(userId);

    if (!roadmap) {
      return null;
    }

    const totalGames = roadmap.games.length;
    const completedGames = roadmap.games.filter(
      (g) => g.status === RoadmapStatus.COMPLETED,
    ).length;
    const inProgressGames = roadmap.games.filter(
      (g) => g.status === RoadmapStatus.IN_PROGRESS,
    ).length;
    const deferredGames = roadmap.games.filter(
      (g) => g.status === RoadmapStatus.DEFERRED,
    ).length;

    const progress =
      totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

    const response: RoadmapPreviewResponse = {
      id: roadmap.id,
      title: roadmap.name,
      estimated_time: roadmap.etc_time,

      progress,
      total_games: totalGames,
      completed_games: completedGames,
      in_progress: inProgressGames,
      abandoned: deferredGames,

      recommended_game: roadmap.recommendedGame
        ? {
            id: roadmap.recommendedGame.id,
            steam_id: roadmap.recommendedGame.steam_id,
            title: roadmap.recommendedGame.title,
            cover: roadmap.recommendedGame.logo || '',
          }
        : undefined,
    };

    return response;
  }

  async createRoadmap(userId: number, dto: CreateRoadmapDto) {
    const existing = await this.roadmapRepo.findLatestByUserId(userId);

    if (existing) {
      throw new BadRequestException('You already have a roadmap created.');
    }
    const stats = await this.gameService.getRoadmapStats(dto.gameIds);

    const gamesMetricsRaw =
      await this.userGameService.getGamesForRecommendation(userId, dto.gameIds);

    const gamesForEngine: GameMetricData[] = gamesMetricsRaw.map((row) => ({
      gameId: row.game_id,
      title: row.title,
      achievementsCount: parseInt(row.total_achievements, 10) || 0,
      timeToBeat: row.time_to_beat ? parseInt(row.time_to_beat, 10) : null,
      unlockedCount: parseInt(row.unlocked_count, 10) || 0,
      lockedPercentages: row.locked_achievements || [],
    }));

    const bestGame =
      this.recommendationService.calculateBestGame(gamesForEngine);

    if (bestGame) {
      this.logger.log(
        `Recommendation Algorithm chose: ${bestGame.title} (Score: ${bestGame.score.toFixed(2)})`,
      );
    }

    return this.roadmapRepo.create(userId, {
      ...dto,
      etcTime: stats.totalTime,
      totalAchievements: stats.totalAchievements,
      recGameId: bestGame ? bestGame.gameId : null,
    });
  }

  async recalculateRoadmapStatuses(userId: number) {
    this.logger.log(`Recalculating statuses for user ${userId}...`);

    const roadmap = await this.roadmapRepo.findLatestByUserId(userId);
    if (!roadmap) return;

    const gameIds = roadmap.games.map((rg) => rg.gameId);

    const userGames = await this.userGameService.findByGameIds(userId, gameIds);

    const unlockedMap =
      await this.userAchievementService.getUnlockedAchievementsCount(
        userId,
        gameIds,
      );

    const totalMap =
      await this.achievementService.getTotalCountsByGameIds(gameIds);

    const updates: Promise<any>[] = [];
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    for (const item of roadmap.games) {
      const userGame = userGames.find((ug) => ug.game_id === item.gameId);
      const unlockedCount = unlockedMap.get(item.gameId) || 0;
      const totalCount = totalMap.get(item.gameId) || 0;

      const newStatus = this._calculateStatus(
        userGame,
        unlockedCount,
        totalCount,
        roadmap.created_at,
        monthAgo,
      );

      if (newStatus !== item.status) {
        updates.push(this.roadmapGameRepo.updateStatus(item.id, newStatus));
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
      this.logger.log(`Updated status for ${updates.length} games.`);
    }
  }

  private _calculateStatus(
    userGame: any,
    unlockedCount: number,
    totalAchievements: number,
    roadmapCreatedAt: Date,
    monthAgo: Date,
  ): RoadmapStatus {
    if (unlockedCount >= totalAchievements) {
      return RoadmapStatus.COMPLETED;
    }

    if (!userGame || userGame.playtime === 0) {
      return RoadmapStatus.PLANNED;
    }

    const lastPlayed = new Date(userGame.updated_at);

    if (lastPlayed < roadmapCreatedAt) {
      return RoadmapStatus.PLANNED;
    }

    if (lastPlayed < monthAgo) {
      return RoadmapStatus.DEFERRED;
    }

    return RoadmapStatus.IN_PROGRESS;
  }

  async getRoadmapDetails(
    id: number,
    userId: number,
  ): Promise<RoadmapDetailsResponse | null> {
    const roadmap = await this.roadmapRepo.findById(id);
    if (!roadmap) return null;

    const gameIds = roadmap.games.map((rg) => rg.gameId);

    const userGames = await this.userGameService.findByGameIds(userId, gameIds);

    const unlockedMap =
      await this.userAchievementService.getUnlockedAchievementsCount(
        userId,
        gameIds,
      );

    const totalMap =
      await this.achievementService.getTotalCountsByGameIds(gameIds);

    const buildGameStats = (roadmapItem: (typeof roadmap.games)[0]) => {
      const game = roadmapItem.game;
      const userGame = userGames.find((ug) => ug.game_id === game.id);

      const playtime = userGame?.playtime || 0;
      const totalAch = totalMap.get(game.id) || 0;
      const unlockedAch = unlockedMap.get(game.id) || 0;

      const percent =
        totalAch > 0 ? Math.round((unlockedAch / totalAch) * 100) : 0;

      let etc: number | null = game.time_to_beat;

      return {
        id: game.id,
        steam_id: game.steam_id,
        title: game.title,
        cover: game.logo || '',
        status: roadmapItem.status,
        playtime,
        achievements_total: totalAch,
        achievements_unlocked: unlockedAch,
        completion_percent: percent,
        estimated_time_to_completion: etc,
      };
    };

    const gamesList = roadmap.games.map((item) => buildGameStats(item));

    let recommendedGameObj: RoadmapDetailsResponse['recommended_game'] =
      undefined;
    if (roadmap.recGameId) {
      const recItem = roadmap.games.find(
        (rg) => rg.gameId === roadmap.recGameId,
      );
      if (recItem) {
        recommendedGameObj = buildGameStats(recItem);
      }
    }

    return {
      id: roadmap.id,
      title: roadmap.name,
      total_etc: roadmap.etc_time,
      total_achievements: roadmap.total_achievements,
      recommended_game: recommendedGameObj,
      games: gamesList,
    };
  }

  async updateGameStatus(
    userId: number,
    roadmapId: number,
    gameId: number,
    dto: UpdateGameStatusDto,
  ) {
    const roadmap = await this.roadmapRepo.findById(roadmapId);

    if (!roadmap) {
      throw new NotFoundException(`Roadmap ${roadmapId} not found`);
    }

    if (roadmap.userId !== userId) {
      throw new ForbiddenException('You do not own this roadmap');
    }

    await this.roadmapGameRepo.updateStatusByRelation(
      roadmapId,
      gameId,
      dto.status,
    );
  }

  async deleteRoadmap(userId: number, roadmapId: number): Promise<void> {
    const roadmap = await this.roadmapRepo.findById(roadmapId);

    if (!roadmap) {
      throw new NotFoundException(`Roadmap ${roadmapId} not found`);
    }

    if (roadmap.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this roadmap',
      );
    }

    await this.roadmapRepo.delete(roadmapId);
  }

  async refreshRoadmap(userId: number) {
    this.logger.log(`Refreshing roadmap for user ${userId}...`);

    const roadmap = await this.roadmapRepo.findLatestByUserId(userId);
    if (!roadmap || !roadmap.games.length) return;

    const gameIds = roadmap.games.map((rg) => rg.gameId);

    const userGames = await this.userGameService.findByGameIds(userId, gameIds);
    const unlockedMap =
      await this.userAchievementService.getUnlockedAchievementsCount(
        userId,
        gameIds,
      );
    const totalMap =
      await this.achievementService.getTotalCountsByGameIds(gameIds);

    const updates: Promise<any>[] = [];
    const activeGameIds: number[] = [];

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    for (const item of roadmap.games) {
      const userGame = userGames.find((ug) => ug.game_id === item.gameId);
      const unlockedCount = unlockedMap.get(item.gameId) || 0;
      const totalCount = totalMap.get(item.gameId) || 0;

      const newStatus = this._calculateStatus(
        userGame,
        unlockedCount,
        totalCount,
        roadmap.created_at,
        monthAgo,
      );

      if (newStatus !== item.status) {
        updates.push(this.roadmapGameRepo.updateStatus(item.id, newStatus));
      }

      if (newStatus !== RoadmapStatus.COMPLETED) {
        activeGameIds.push(item.gameId);
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
      this.logger.log(`Updated statuses for ${updates.length} games.`);
    }

    if (activeGameIds.length === 0) {
      await this.roadmapRepo.updateRecommendedGame(roadmap.id, null);
      return;
    }

    const gamesMetricsRaw =
      await this.userGameService.getGamesForRecommendation(
        userId,
        activeGameIds,
      );

    const gamesForEngine: GameMetricData[] = gamesMetricsRaw.map((row) => ({
      gameId: row.game_id,
      title: row.title,
      achievementsCount: parseInt(row.total_achievements, 10) || 0,
      timeToBeat: row.time_to_beat ? parseInt(row.time_to_beat, 10) : null,
      unlockedCount: parseInt(row.unlocked_count, 10) || 0,
      lockedPercentages: row.locked_percentages || [],
    }));

    const bestGame =
      this.recommendationService.calculateBestGame(gamesForEngine);

    if (bestGame && bestGame.gameId !== roadmap.recGameId) {
      this.logger.log(`New recommendation: ${bestGame.title}`);
      await this.roadmapRepo.updateRecommendedGame(roadmap.id, bestGame.gameId);
    }
  }
}
