import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConstants } from './contants';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  sign(sub: string) {
    return this.jwtService.signAsync({ sub }, { secret: JwtConstants.secret });
  }

  validate(token: string): Promise<{ sub: string }> {
    return this.jwtService.verifyAsync(token, { secret: JwtConstants.secret });
  }
}
