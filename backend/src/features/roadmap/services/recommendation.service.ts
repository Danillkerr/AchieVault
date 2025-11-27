import { Injectable, Logger } from '@nestjs/common';

export interface GameMetricData {
  gameId: number;
  title: string;
  achievementsCount: number;
  timeToBeat: number | null;
  unlockedCount: number;
  lockedPercentages: number[];
}

export interface GameScoreResult {
  gameId: number;
  title: string;
  score: number;
  details: {
    normCount: number;
    difficulty: number;
    timeFactor: number;
    progress: number;
  };
}

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  private readonly Wp = 0.2;
  private readonly Wc = 0.4;
  private readonly Wd = 0.3;
  private readonly Wt = 0.1;

  public calculateBestGame(games: GameMetricData[]): GameScoreResult | null {
    if (games.length === 0) return null;

    const { cMin, cMax, tMin, tMax } = this.findMinMaxValues(games);

    const scoredGames = games.map((game) => {
      const P = game.unlockedCount / game.achievementsCount;

      const Cnorm = this.normalizeLog(
        game.achievementsCount - game.unlockedCount,
        cMin,
        cMax,
      );

      const medianRarity = this.calculateMedian(game.lockedPercentages);
      const Drem = medianRarity / 100;

      let Kt = 0;
      let It = 0;

      if (game.timeToBeat !== null && game.timeToBeat > 0) {
        It = 1;
        Kt = this.normalizeTimeInverted(game.timeToBeat, tMin, tMax);
      }

      const numerator =
        this.Wp * P + this.Wc * Cnorm + this.Wd * Drem + It * this.Wt * Kt;
      const denominator = this.Wp + this.Wc + this.Wd + It * this.Wt;

      const IP = numerator / denominator;

      return {
        gameId: game.gameId,
        title: game.title,
        score: IP,
        details: {
          progress: P,
          normCount: Cnorm,
          difficulty: Drem,
          timeFactor: Kt,
        },
      };
    });

    scoredGames.sort((a, b) => b.score - a.score);

    return scoredGames[0];
  }

  private findMinMaxValues(games: GameMetricData[]) {
    let cMin = Infinity,
      cMax = -Infinity;
    let tMin = Infinity,
      tMax = -Infinity;

    for (const g of games) {
      if (g.achievementsCount - g.unlockedCount < cMin)
        cMin = g.achievementsCount - g.unlockedCount;
      if (g.achievementsCount - g.unlockedCount > cMax)
        cMax = g.achievementsCount - g.unlockedCount;

      if (g.timeToBeat !== null && g.timeToBeat > 0) {
        if (g.timeToBeat < tMin) tMin = g.timeToBeat;
        if (g.timeToBeat > tMax) tMax = g.timeToBeat;
      }
    }

    if (tMin === Infinity) {
      tMin = 0;
      tMax = 1;
    }

    return { cMin, cMax, tMin, tMax };
  }

  private normalizeLog(val: number, min: number, max: number): number {
    const v = Math.max(val, 1);
    const mn = Math.max(min, 1);
    const mx = Math.max(max, 1);

    const numerator = Math.log(v) - Math.log(mn);
    const denominator = Math.log(mx) - Math.log(mn);

    if (denominator === 0) return 0;
    return 1 - numerator / denominator;
  }

  private normalizeTimeInverted(val: number, min: number, max: number): number {
    const denominator = max - min;
    if (denominator === 0) return 1;
    return 1 - (val - min) / denominator;
  }

  private calculateMedian(values: number[]): number {
    if (!values || values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 !== 0) {
      return sorted[mid];
    } else {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
  }
}
