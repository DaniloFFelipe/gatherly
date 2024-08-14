import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async getEventDetails(participantId: string) {
    const participant = await this.prisma.participant.findUnique({
      where: {
        id: participantId,
      },
      select: {
        event: {
          select: {
            id: true,
            name: true,
            description: true,
            avatarUrl: true,
            lessons: {
              select: {
                id: true,
                name: true,
                availableAt: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    });

    if (!participant) {
      throw new UnauthorizedException();
    }

    return {
      event: participant.event,
    };
  }
}
