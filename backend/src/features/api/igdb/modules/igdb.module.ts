import { Module } from '@nestjs/common';
import { IgdbService } from '../service/igdb.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ExternalGameRepository } from 'src/core/repositories/external-game.repository.abstract';
import { IgdbExternalGameRepository } from '../repositories/igdb-external-game.repository';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: IgdbService,
      inject: [HttpService, ConfigService],
      useFactory: (http: HttpService, config: ConfigService) => {
        const igdbApiUrl = config.get<string>('IGDB_API_URL');
        const clientId = config.get<string>('CLIENT_ID');
        const authorization = config.get<string>('AUTHORIZATION');

        if (!igdbApiUrl || !clientId || !authorization) {
          throw new Error('IGDB environment variables are not set.');
        }
        return new IgdbService(http, {
          apiUrl: igdbApiUrl,
          clientId,
          authorization,
        });
      },
    },
    IgdbExternalGameRepository,
    {
      provide: ExternalGameRepository,
      useExisting: IgdbExternalGameRepository,
    },
  ],
  exports: [ExternalGameRepository],
})
export class IgdbModule {}
