import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/modules/auth.module';
import { ConfigService } from '@nestjs/config';
import { SyncModule } from './features/sync/modules/sync.module';
import { GameModule } from './features/game/modules/game.module';
import { SteamModule } from './features/api/steam/modules/steam.module';
import { IgdbModule } from './features/api/igdb/modules/igdb.module';
import { UserProfileModule } from './features/users/user-profile.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull/dist/bull.module';
import { LeaderboardModule } from './features/leaderboard/modules/leaderboard.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SchedulerModule } from './features/scheduler/modules/scheduler.module';
import * as redisStore from 'cache-manager-redis-store';
import { GameDiscoveryModule } from './features/game-discovery/modules/game-discovery.module';
import { GuideModule } from './features/guide/module/guide.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    SchedulerModule,

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST'),
          port: parseInt(config.get('REDIS_PORT') || '6379', 10),
          password: config.get('REDIS_PASSWORD'),
          tls: {},
        },
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: parseInt(config.get('REDIS_PORT') || '6379', 10),
        auth_pass: config.get('REDIS_PASSWORD'),
        ttl: 600,
      }),
    }),

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

        autoLoadEntities: true,

        ssl: true,
      }),
    }),

    AuthModule,
    LeaderboardModule,
    UserProfileModule,
    GameModule,
    SyncModule,
    SteamModule,
    IgdbModule,
    GameDiscoveryModule,
    SchedulerModule,
    GuideModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
