import { EntityManager, Repository } from 'typeorm';
import { User } from '../../core/entities/user.entity';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IProfileFromSteam,
  ISteamProfile,
} from 'src/core/interfaces/steam/steam-profile.interface';
import { UserGame } from 'src/core/entities/user-game.entity';
import { ISteamOwnedGame } from 'src/core/interfaces/steam/steam-owned-games.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserGame)
    private userGameRepository: Repository<UserGame>,
  ) {}

  async findOrCreateBySteamProfile({
    id,
    displayName,
    photos,
  }: IProfileFromSteam): Promise<User> {
    const profile: ISteamProfile = {
      steamid: id,
      name: displayName,
      avatar: photos[2]?.value,
    };

    let user = await this.userRepository.findOneBy({
      steamid: profile.steamid,
    });

    if (!user) {
      user = this.userRepository.create(profile);
      await this.userRepository.save(user);
    }

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async getOwnedGameSteamIds(userId: number): Promise<string[]> {
    const userGames: { steamid: string }[] = await this.userGameRepository
      .createQueryBuilder('User_Game')
      .leftJoin('User_Game.game', 'Game')
      .select('Game.steam_id', 'steamid')
      .where('User_Game.user_id = :userId', { userId })
      .getRawMany();

    return userGames.map((game) => game.steamid);
  }

  async updateUserGameCount(
    userId: number,
    count: number,
    manager: EntityManager,
  ) {
    await manager.update(User, { id: userId }, { game_count: count });
  }

  async bulkUpsertUserGamesBySteamId(
    userId: number,
    steamGames: ISteamOwnedGame[],
    manager: EntityManager,
  ): Promise<void> {
    if (steamGames.length === 0) return;

    const steamIds = steamGames.map((g) => g.appid.toString());
    const playtimes = steamGames.map((g) => g.playtime_forever);
    const lastPlayedTimes = steamGames.map((g) => g.rtime_last_played);
    const sql = `
      INSERT INTO "User_Game" (user_id, game_id, playtime, rtime_last_played) 
      SELECT
        $1 AS user_id,
        g.id AS game_id,
        s.playtime AS playtime,
        s.rtime_last_played AS rtime_last_played
      FROM
        unnest($2::text[], $3::int[], $4::bigint[]) AS s(steam_id, playtime, rtime_last_played)
      
      INNER JOIN "Game" g ON g.steam_id = s.steam_id
      
      ON CONFLICT (user_id, game_id) DO UPDATE
      SET
        playtime = EXCLUDED.playtime,
        rtime_last_played = EXCLUDED.rtime_last_played;
    `;
    await manager.query(sql, [userId, steamIds, playtimes, lastPlayedTimes]);
  }
}
