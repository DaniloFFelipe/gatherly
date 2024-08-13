import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { JoinDto } from './dtos/join.dto';
import { AuthService } from 'src/lib/auth/auth.service';

@Injectable()
export class ParticipantsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async join({ code, email }: JoinDto) {
    const participants = await this.prisma.participant.findUnique({
      where: {
        email_code: {
          email,
          code,
        },
      },
    });

    if (!participants) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.authService.sign(participants.id);
    return {
      token,
    };
  }
}
