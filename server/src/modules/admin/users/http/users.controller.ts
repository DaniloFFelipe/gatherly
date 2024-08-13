import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { UsersService } from '../core/users.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from '../core/dtos/create-account.dto';
import { AuthWithPasswordDto } from '../core/dtos/auth-with-password.dto';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';
import { Public } from 'src/lib/auth/auth.metadata';

@Controller('admin')
@ApiTags('admin')
@UsePipes(ZodValidationPipe)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post('/users')
  @ApiCreatedResponse({
    type: CreateAccountDto,
  })
  async createAccount(@Body() data: CreateAccountDto) {
    await this.usersService.createAccount(data);
  }

  @Public()
  @Post('/session/password')
  @ApiCreatedResponse({
    type: AuthWithPasswordDto,
  })
  authWithPassword(@Body() data: AuthWithPasswordDto) {
    return this.usersService.authWithPassword(data);
  }

  @Get('me')
  getProfile(@CurrentUser() { sub }: ICurrentUser) {
    return this.usersService.getProfile(sub);
  }
}
