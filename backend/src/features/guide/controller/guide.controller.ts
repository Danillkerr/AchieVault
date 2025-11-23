import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { GuideService } from '../service/guide.service';
import { CreateGuideRequestDto } from '../dto/create-guide.dto';
import { GetGuidesQueryDto } from '../dto/get-guides.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateGuideDto } from '../dto/update-guide.dto';
import { User } from '../../../core/entities/user.entity';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';

@Controller('guides')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req, @Body() dto: CreateGuideRequestDto) {
    return this.guideService.createGuide(dto);
  }

  @Get('/')
  async getAll(@Query() query: GetGuidesQueryDto) {
    return this.guideService.getAllGuides(
      query.page,
      query.limit,
      query.userId,
      query.gameId,
    );
  }

  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.guideService.getGuideById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGuideDto,
    @Req() req,
  ) {
    const user = req.user as User;
    return this.guideService.updateGuide(user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user as User;
    await this.guideService.deleteGuide(user.id, id);
    return { message: 'Guide deleted successfully' };
  }
}
