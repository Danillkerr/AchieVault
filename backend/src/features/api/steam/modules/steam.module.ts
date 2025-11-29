import { Module } from '@nestjs/common';
import { SteamService } from '../service/steam.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SteamUserSourceRepository } from '../repositories/steam-user-source.repository';
import { IGameSource } from 'src/core/repositories/interfaces/game-source.interface';
import { ISocialSource } from 'src/core/repositories/interfaces/social-source.interface';
import { IAchievementSource } from 'src/core/repositories/interfaces/achievement-source.interface';
import { IGameDiscoverySource } from 'src/core/repositories/interfaces/game-discovery-source.interface';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: SteamService,
      inject: [HttpService, ConfigService],
      useFactory: (http: HttpService, config: ConfigService) => {
        const steamApiUrl = config.get<string>('STEAM_API_URL');
        const steamApiKey = config.get<string>('STEAM_API_KEY');
        const steamApiStoreUrl = config.get<string>('STEAM_API_STORE_URL');

        if (!steamApiUrl || !steamApiKey || !steamApiStoreUrl) {
          throw new Error('STEAM environment variables are not set.');
        }
        return new SteamService(http, {
          steamApiUrl,
          steamApiKey,
          steamApiStoreUrl,
        });
      },
    },
    { provide: IGameSource, useExisting: SteamUserSourceRepository },
    { provide: ISocialSource, useExisting: SteamUserSourceRepository },
    { provide: IAchievementSource, useExisting: SteamUserSourceRepository },
    { provide: IGameDiscoverySource, useExisting: SteamUserSourceRepository },
    SteamUserSourceRepository,
  ],
  exports: [
    IGameDiscoverySource,
    IGameSource,
    IAchievementSource,
    ISocialSource,
  ],
})
export class SteamModule {}
