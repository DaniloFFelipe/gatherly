import { Module } from '@nestjs/common';
import { UsersController } from './http/users.controller';
import { UsersService } from './core/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
