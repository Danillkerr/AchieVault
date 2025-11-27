import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Patch,
  UseGuards,
  HttpStatus,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/core/entities/user.entity';
import { RoadmapService } from '../services/roadmap.service';
import { CreateRoadmapDto } from '../dto/create-roadmap.dto';
import { UpdateGameStatusDto } from '../dto/update-game-status.dto';

@Controller('roadmaps')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req, @Body() dto: CreateRoadmapDto) {
    const user = req.user as User;
    return this.roadmapService.createRoadmap(user.id, dto);
  }

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  async getUserRoadmaps(@Req() req) {
    const user = req.user as User;
    return this.roadmapService.getRoadmapPreview(user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user as User;
    await this.roadmapService.deleteRoadmap(user.id, id);
  }

  @Get('/recalculate-statuses')
  @UseGuards(AuthGuard('jwt'))
  async recalculateStatuses(@Req() req) {
    const user = req.user as User;
    return this.roadmapService.recalculateRoadmapStatuses(user.id);
  }

  @Get(':id/details')
  @UseGuards(AuthGuard('jwt'))
  async getDetails(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user as User;
    const details = await this.roadmapService.getRoadmapDetails(id, user.id);
    return details || null;
  }

  @Patch(':id/games/:gameId')
  @UseGuards(AuthGuard('jwt'))
  async updateGameStatus(
    @Param('id', ParseIntPipe) roadmapId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() dto: UpdateGameStatusDto,
    @Req() req,
  ) {
    const user = req.user as User;

    await this.roadmapService.updateGameStatus(user.id, roadmapId, gameId, dto);

    return { success: true };
  }
}
