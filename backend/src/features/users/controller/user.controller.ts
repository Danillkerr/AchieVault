import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { User } from '../../../core/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}
  @Get('search')
  async searchUsers(@Query('q') query: string) {
    return this.userService.search(query);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyself(@Req() req) {
    const user = req.user as User;

    await this.userService.deleteUser(user.id);
  }
}
