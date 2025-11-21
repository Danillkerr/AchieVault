import { Module } from '@nestjs/common';
import { SteamService } from '../service/steam.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SteamUserSourceRepository } from '../repositories/steam-user-source.repository';
import { UserSourceRepository } from 'src/core/repositories/user-source.repository.abstract';

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
    SteamUserSourceRepository,
    {
      provide: UserSourceRepository,
      useExisting: SteamUserSourceRepository,
    },
  ],
  exports: [UserSourceRepository],
})
export class SteamModule {}
