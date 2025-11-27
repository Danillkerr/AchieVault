import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { UserGameService } from '../services/user-game.service';
import { GetUserLibraryDto } from '../dto/get-user-library.dto';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';

@Controller('user-game')
export class UserGameController {
  constructor(private readonly userGameService: UserGameService) {}
  @Get(':id/library')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUserLibrary(
    @Param('id', ParseIntPipe) userId: number,
    @Query() query: GetUserLibraryDto,
  ) {
    return this.userGameService.getUserLibrary(userId, query);
  }
}
