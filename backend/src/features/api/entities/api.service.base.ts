import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export abstract class BaseApiService {
  protected readonly logger: Logger;

  constructor(protected readonly httpService: HttpService) {
    this.logger = new Logger(this.constructor.name);
  }

  protected async _makePostRequest(url: string, data: any, headers: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  protected async _makeGetRequest(url: string, params: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { params }),
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
