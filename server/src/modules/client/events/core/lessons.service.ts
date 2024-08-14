import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async getLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        availableAt: true,
        contentUrl: true,
        instructor: {
          select: {
            name: true,
            description: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new BadRequestException('Lesson not found');
    }

    if (lesson.availableAt > new Date()) {
      throw new BadRequestException('Lesson not available');
    }

    return {
      lesson,
    };
  }
}
