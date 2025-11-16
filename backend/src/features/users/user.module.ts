import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../core/entities/user.entity';
import { UsersService } from './users.service';
import { UserGame } from 'src/core/entities/user-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserGame])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
