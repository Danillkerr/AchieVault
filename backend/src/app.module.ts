import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/modules/auth.module';
import { ConfigService } from '@nestjs/config';
import { User } from './core/entities/user.entity';
import { UserGame } from './features/users/entities/user-game.entity';
import { Game } from './features/game/entities/game.entity';
import { SyncModule } from './features/sync/modules/sync.module';
import { GameModule } from './features/game/modules/game.module';
import { SteamModule } from './features/api/steam/modules/steam.module';
import { IgdbModule } from './features/api/igdb/modules/igdb.module';
import { Achievement } from './features/game/entities/achievement.entity';
import { UserAchievement } from './features/users/entities/user-achievement.entity';
import { FriendList } from './features/users/entities/friendship.entity';
import { UserProfileModule } from './features/users/user-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),

        entities: [
          User,
          UserGame,
          Game,
          UserAchievement,
          Achievement,
          FriendList,
        ],

        ssl: true,
      }),
    }),

    AuthModule,
    UserProfileModule,
    GameModule,
    SyncModule,
    SteamModule,
    IgdbModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
