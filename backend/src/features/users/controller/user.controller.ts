import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';

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
}
