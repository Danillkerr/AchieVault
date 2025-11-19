import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../core/entities/user.entity';
import { UsersService } from '../services/users.service';
import { TypeOrmUserRepository } from '../repositories/infrastructures/user.repository';
import { UserRepository } from '../repositories/abstracts/user.repository.abstract';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
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
