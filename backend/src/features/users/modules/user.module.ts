import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { TypeOrmUserRepository } from '../repositories/infrastructures/user.repository';
import { UserRepository } from '../repositories/abstracts/user.repository.abstract';
import { UserController } from '../controller/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UsersService,
    TypeOrmUserRepository,
    {
      provide: UserRepository,
      useExisting: TypeOrmUserRepository,
    },
  ],
  exports: [UsersService, UserRepository],
})
export class UserModule {}
