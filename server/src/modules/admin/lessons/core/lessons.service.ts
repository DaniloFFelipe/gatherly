import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { PermissionService } from 'src/modules/common/roles/permissions.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { getUserPermissions } from 'src/modules/common/roles/utils';
import { EventsService } from '../../events/core/events.service';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(
    private prisma: PrismaService,
    private permissions: PermissionService,
    private eventService: EventsService,
  ) {}

  async createLesson(
    slug: string,
    eventSlug: string,
    userId: string,
    {
      contentUrl,
      description,
      name,
      instructorId,
      availableAt,
    }: CreateLessonDto,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('create', 'Event')) {
      throw new ForbiddenException(`You're not allowed to create new lesson.`);
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to create new lesson.`);
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        contentUrl,
        description,
        name,
        eventId: event.id,
        instructorId,
        availableAt,
      },
    });

    return {
      lessonId: lesson.id,
    };
  }

  async updateLesson(
    slug: string,
    eventSlug: string,
    lessonId: string,
    userId: string,
    data: UpdateLessonDto,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('create', 'Event')) {
      throw new ForbiddenException(`You're not allowed to update new lesson.`);
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to update new lesson.`);
    }

    const { lesson } = await this.findById(lessonId);
    if (lesson.eventId !== event.id) {
      throw new ForbiddenException(`You're not allowed to update new lesson.`);
    }

    await this.prisma.lesson.update({
      where: {
        id: lesson.id,
      },
      data,
    });
  }

  async getLesson(
    slug: string,
    eventSlug: string,
    lessonId: string,
    userId: string,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Event')) {
      throw new ForbiddenException(`You're not allowed to get lesson.`);
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to get lesson.`);
    }
    const { lesson } = await this.findById(lessonId, {
      id: true,
      name: true,
      description: true,
      eventId: true,
      instructor: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      contentUrl: true,
    });
    if (lesson.eventId !== event.id) {
      throw new ForbiddenException(`You're not allowed to get lesson.`);
    }

    return {
      lesson,
    };
  }

  async getLessons(slug: string, eventSlug: string, userId: string) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Event')) {
      throw new ForbiddenException(`You're not allowed to get lesson.`);
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to get lesson.`);
    }

    const lessons = await this.prisma.lesson.findMany({
      where: {
        eventId: event.id,
      },
    });

    return { lessons };
  }

  async findById(id: string, select?: Prisma.LessonSelect) {
    const lesson = await this.prisma.lesson.findUnique({
      select,
      where: {
        id,
      },
    });
    if (!lesson) {
      throw new BadRequestException('Lesson not found');
    }
    return { lesson };
  }
}
