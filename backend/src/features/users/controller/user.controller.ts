import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('search')
  async searchUsers(@Query('q') query: string) {
    return this.userService.search(query);
  }
}
