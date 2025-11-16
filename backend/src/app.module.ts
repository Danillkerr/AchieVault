import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/users/user.module';
import { ConfigService } from '@nestjs/config';
import { User } from './core/entities/user.entity';
import { UserGame } from './core/entities/user-game.entity';
import { Game } from './core/entities/game.entity';
import { SyncModule } from './features/sync/sync.module';
import { GameModule } from './features/game/game.module';
import { SteamModule } from './features/api/steam/steam.module';
import { IgdbModule } from './features/api/igdb/igdb.module';

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

        entities: [User, UserGame, Game],

        ssl: true,
      }),
    }),

    AuthModule,
    UserModule,
    GameModule,
    SyncModule,
    SteamModule,
    IgdbModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
